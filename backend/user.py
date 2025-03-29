import hashlib
import uuid
from bson import ObjectId
import logging
import datetime
from pymongo.errors import DuplicateKeyError
from mongodb import db
from error import Error

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class User:
    def __init__(self, email=None, password=None, name=None):
        self.email = email
        self.password = password
        self.name = name
        self.collection_name = "users"
        
        # Create indexes if not exists
        self._ensure_indexes()
    
    def _ensure_indexes(self):
        """Create necessary indexes for the users collection"""
        collection = db.get_collection(self.collection_name)
        if collection is not None:
            try:
                # Create unique index on email field
                collection.create_index("email", unique=True)
                logger.info("User collection indexes created/verified")
            except Exception as e:
                logger.error(f"Error creating indexes: {e}")
    
    def _hash_password(self, password, salt=None):
        """Hash password with salt for secure storage"""
        if salt is None:
            salt = uuid.uuid4().hex
        
        hashed_password = hashlib.sha256((password + salt).encode()).hexdigest()
        return {'hash': hashed_password, 'salt': salt}
    
    def create(self):
        """
        Create a new user
        
        Returns:
            str or Error: User ID if successful, Error object otherwise
        """
        if not self.email or not self.password:
            logger.error("Email and password are required to create a user")
            return Error("Email and password are required")
        
        collection = db.get_collection(self.collection_name)
        if collection is not None:
            try:
                # Check if user already exists
                existing_user = collection.find_one({"email": self.email})
                if existing_user:
                    return Error("User already exists")
                
                # Hash password
                password_data = self._hash_password(self.password)
                
                # Create user document
                user_doc = {
                    "email": self.email,
                    "password_hash": password_data['hash'],
                    "salt": password_data['salt'],
                    "created_at": datetime.datetime.now(),
                    "updated_at": datetime.datetime.now()
                }
                
                # Add name if provided
                if self.name:
                    user_doc["name"] = self.name
                
                # Insert user into database
                result = collection.insert_one(user_doc)
                
                logger.info(f"User created with ID: {result.inserted_id}")
                return str(result.inserted_id)
                
            except DuplicateKeyError:
                logger.error(f"Duplicate key error: User with email {self.email} already exists")
                return Error("User already exists")
            except Exception as e:
                logger.error(f"Error creating user: {e}")
                return Error(f"Error creating user: {str(e)}")
        else:
            logger.error("Database connection not established")
            return Error("Database connection error")
    
    @staticmethod
    def get_by_id(user_id):
        """
        Get user by ID
        
        Args:
            user_id (str): User ID
            
        Returns:
            dict or None: User document if found, None otherwise
        """
        collection = db.get_collection("users")
        if collection is None:
            logger.error("Database connection not established")
            return None
        
        try:
            # Convert string ID to ObjectId
            obj_id = ObjectId(user_id)
            
            # Get user document and remove sensitive fields
            user_doc = collection.find_one({"_id": obj_id})
            if user_doc:
                # Remove sensitive fields
                if 'password_hash' in user_doc:
                    del user_doc['password_hash']
                if 'salt' in user_doc:
                    del user_doc['salt']
                
                # Convert ObjectId to string for JSON serialization
                user_doc["_id"] = str(user_doc["_id"])
                
                return user_doc
            return None
        except Exception as e:
            logger.error(f"Error retrieving user: {e}")
            return None
            
    @staticmethod
    def get_by_email(email):
        """
        Get user by email
        
        Args:
            email (str): User email
            
        Returns:
            dict or None: User document if found, None otherwise
        """
        collection = db.get_collection("users")
        if collection is None:
            logger.error("Database connection not established")
            return None
        
        try:
            # Get user document
            return collection.find_one({"email": email})
        except Exception as e:
            logger.error(f"Error retrieving user by email: {e}")
            return None
            
    @staticmethod
    def verify_password(email, password):
        """
        Verify if the provided password matches the stored hash for the given email
        
        Args:
            email (str): User's email address
            password (str): Password to verify
            
        Returns:
            bool: True if password matches, False otherwise
        """
        if not email or not password:
            logger.error("Email and password are required for verification")
            return False
        
        # Get user from database
        collection = db.get_collection("users")
        if collection is None:
            logger.error("Database connection not established")
            return False
        
        user_doc = collection.find_one({"email": email})
        if not user_doc:
            logger.error(f"User with email {email} not found")
            return False
            
        # Verify password matches
        if 'password_hash' not in user_doc or 'salt' not in user_doc:
            logger.error("User document is missing password hash or salt")
            return False
            
        # Hash the provided password with the stored salt
        salt = user_doc['salt']
        hashed_password = hashlib.sha256((password + salt).encode()).hexdigest()
        
        # Compare the newly generated hash with the stored hash
        return hashed_password == user_doc['password_hash']
