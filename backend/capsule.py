import logging
from bson import ObjectId
import datetime
from mongodb import db
from error import Error
from user import User

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)



class Capsule:
    """
    Class representing a time capsule with the following properties:
    - title: The title of the capsule
    - content: The encrypted content of the capsule (IPFS CID)
    - unlock_date: The date when the capsule can be opened
    - is_private: Whether the capsule is private or not
    - description: Optional description of the capsule
    - recipients: Optional list of recipient email addresses
    - owner_id: The user ID of the capsule creator
    """
    
    def __init__(self):
        self.collection_name = "capsules"
        self._ensure_indexes()
    
    def _ensure_indexes(self):
        """Create necessary indexes for the capsules collection"""
        collection = db.get_collection(self.collection_name)
        if collection is not None:
            try:
                # Create index on owner_id for faster retrieval of user's capsules
                collection.create_index("owner_id")
                # Create index on unlock_date for efficient querying of unlockable capsules
                collection.create_index("unlock_date")
                logger.info("Capsule collection indexes created/verified")
            except Exception as e:
                logger.error(f"Error creating indexes: {e}")
    
    def create(self, title, content, unlock_date, is_private, owner_id, description=None, recipients=None):
        """
        Create a new time capsule
        
        Args:
            title (str): The title of the capsule
            content (str): The IPFS CID of the encrypted content
            unlock_date (str): The date when the capsule can be opened (ISO format)
            is_private (bool): Whether the capsule is private or not
            owner_id (str): The user ID of the capsule creator
            description (str, optional): Optional description of the capsule
            recipients (list, optional): Optional list of recipient email addresses
            
        Returns:
            str or Error: The ID of the created capsule or an Error object
        """
        # Validate required fields
        if not title or not content or not unlock_date or not owner_id:
            logger.error("Missing required fields for capsule creation")
            return Error("Missing required fields: title, content, unlock_date, and owner_id are required")
        
        # Validate unlock_date format and ensure it's in the future
        try:
            unlock_datetime = datetime.datetime.fromisoformat(unlock_date)
            if unlock_datetime <= datetime.datetime.now():
                return Error("Unlock date must be in the future")
        except ValueError:
            return Error("Invalid unlock date format. Use ISO format (YYYY-MM-DDTHH:MM:SS)")
        
        collection = db.get_collection(self.collection_name)
        if collection is None:
            logger.error("Database connection not established")
            return Error("Database connection error")
        
        try:
            # Create capsule document
            capsule_doc = {
                "title": title,
                "content": content,  # IPFS CID of encrypted content
                "unlock_date": unlock_datetime,
                "is_private": is_private,
                "owner_id": owner_id,
                "created_at": datetime.datetime.now(),
                "is_deleted": False
            }
            
            # Add optional fields if provided
            if description:
                capsule_doc["description"] = description
            if recipients:
                capsule_doc["recipients"] = recipients
            
            # Insert capsule into database
            result = collection.insert_one(capsule_doc)
            
            logger.info(f"Capsule created with ID: {result.inserted_id}")
            return str(result.inserted_id)
            
        except Exception as e:
            logger.error(f"Error creating capsule: {e}")
            return Error(f"Error creating capsule: {str(e)}")
    
    def get_by_id(self, capsule_id, user_id=None):
        """
        Retrieve a capsule by its ID
        
        Args:
            capsule_id (str): The ID of the capsule to retrieve
            user_id (str, optional): The ID of the user requesting the capsule
            
        Returns:
            dict or Error: The capsule document or an Error object
        """
        if not capsule_id:
            return Error("Capsule ID is required")
        
        collection = db.get_collection(self.collection_name)
        if collection is None:
            logger.error("Database connection not established")
            return Error("Database connection error")
        
        try:
            # Convert string ID to ObjectId
            obj_id = ObjectId(capsule_id)
            
            # Get the capsule
            capsule = collection.find_one({"_id": obj_id, "is_deleted": False})
            
            if not capsule:
                return Error("Capsule not found")
            
            # Check if the capsule is unlockable
            now = datetime.datetime.now()
            is_unlockable = now >= capsule["unlock_date"]
            
            # Check access permissions
            if not is_unlockable and (capsule["is_private"] and user_id != capsule["owner_id"]):
                return Error("Access denied: This capsule is private and not yet unlockable")
            
            # Add unlockable status to the response
            capsule["is_unlockable"] = is_unlockable
            
            # Convert ObjectId to string for JSON serialization
            capsule["_id"] = str(capsule["_id"])
            
            return capsule
            
        except Exception as e:
            logger.error(f"Error retrieving capsule: {e}")
            return Error(f"Error retrieving capsule: {str(e)}")
    
    def get_user_capsules(self, user_id):
        """
        Retrieve all capsules owned by a user
        
        Args:
            user_id (str): The ID of the user
            
        Returns:
            list or Error: A list of capsule documents or an Error object
        """
        if not user_id:
            return Error("User ID is required")
        
        collection = db.get_collection(self.collection_name)
        if collection is None:
            logger.error("Database connection not established")
            return Error("Database connection error")
        
        try:
            # Get all capsules for the user
            cursor = collection.find({"owner_id": user_id, "is_deleted": False})
            
            capsules = []
            now = datetime.datetime.now()
            
            for capsule in cursor:
                # Add unlockable status
                capsule["is_unlockable"] = now >= capsule["unlock_date"]
                # Convert ObjectId to string for JSON serialization
                capsule["_id"] = str(capsule["_id"])
                capsules.append(capsule)
            
            return capsules
            
        except Exception as e:
            logger.error(f"Error retrieving user capsules: {e}")
            return Error(f"Error retrieving user capsules: {str(e)}")
    
    def delete(self, capsule_id, user_id):
        """
        Soft delete a capsule (mark as deleted)
        
        Args:
            capsule_id (str): The ID of the capsule to delete
            user_id (str): The ID of the user requesting the deletion
            
        Returns:
            bool or Error: True if deleted successfully, or an Error object
        """
        if not capsule_id or not user_id:
            return Error("Capsule ID and User ID are required")
        
        collection = db.get_collection(self.collection_name)
        if collection is None:
            logger.error("Database connection not established")
            return Error("Database connection error")
        
        try:
            # Convert string ID to ObjectId
            obj_id = ObjectId(capsule_id)
            
            # Check if capsule exists and belongs to the user
            capsule = collection.find_one({"_id": obj_id, "is_deleted": False})
            
            if not capsule:
                return Error("Capsule not found")
                
            if capsule["owner_id"] != user_id:
                return Error("Access denied: You don't have permission to delete this capsule")
            
            # Soft delete the capsule
            result = collection.update_one(
                {"_id": obj_id},
                {"$set": {"is_deleted": True, "deleted_at": datetime.datetime.now()}}
            )
            
            if result.modified_count > 0:
                logger.info(f"Capsule {capsule_id} deleted successfully")
                return True
            else:
                return Error("Failed to delete capsule")
            
        except Exception as e:
            logger.error(f"Error deleting capsule: {e}")
            return Error(f"Error deleting capsule: {str(e)}")
    
    def get_capsules(self, user_id):
        """
        Retrieve all capsules that are:
        1. Public (is_private = false), OR
        2. Owned by the user (owner_id = user_id), OR
        3. User's email is in the recipients list
        
        Args:
            user_id (str): The ID of the user
            
        Returns:
            list or Error: A list of capsule documents or an Error object
        """
        if not user_id:
            return Error("User ID is required")
        
        collection = db.get_collection(self.collection_name)
        if collection is None:
            logger.error("Database connection not established")
            return Error("Database connection error")
        
        try:
            # Get user's email for recipient matching
            user_data = User.get_by_id(user_id)
            if not user_data:
                return Error("User not found")
            
            user_email = user_data.get("email")
            
            # Create query to match any of our criteria
            query = {
                "$or": [
                    {"is_private": False},  # Public capsules
                    {"owner_id": user_id},  # User's own capsules
                    {"recipients": user_email}  # Capsules where user is a recipient
                ],
                "is_deleted": False  # Don't include deleted capsules
            }
            
            # Execute query
            cursor = collection.find(query)
            
            capsules = []
            now = datetime.datetime.now()
            
            for capsule in cursor:
                # Add unlockable status
                capsule["is_unlockable"] = now >= capsule["unlock_date"]
                # Convert ObjectId to string for JSON serialization
                capsule["_id"] = str(capsule["_id"])
                capsules.append(capsule)
            
            return capsules
            
        except Exception as e:
            logger.error(f"Error retrieving capsules: {e}")
            return Error(f"Error retrieving capsules: {str(e)}")

    def get_unlockable_capsules(self):
        collection = db.get_collection(self.collection_name)
        if collection is None:
            logger.error("Database connection not established")
            return Error("Database connection error")

        capsules = []
        now = datetime.datetime.now()
        for capsule in collection:
            # Add unlockable status
            capsule["is_unlockable"] = now >= capsule["unlock_date"]
            # Convert ObjectId to string for JSON serialization
            capsule["_id"] = str(capsule["_id"])
            capsules.append(capsule)

        return [capsule for capsule in capsules if capsule["is_unlockable"]]