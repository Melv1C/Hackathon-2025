import logging
import json
import os
import uuid
from capsule import Capsule
from error import Error
from encryption import encrypt_message, decrypt_message
import ipfs_api
import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class CapsuleService:
    def __init__(self, encryption_key):
        """
        Initialize the capsule service
        
        Args:
            encryption_key (bytes): The key to use for encryption/decryption
        """
        self.encryption_key = encryption_key
        
    def create_capsule(self, data, user_id):
        """
        Create a new time capsule
        
        Args:
            data (dict): The capsule data containing title, content, unlock_date, etc.
            user_id (str): The ID of the user creating the capsule
            
        Returns:
            dict or Error: The created capsule data or an Error object
        """
        try:
            # Extract capsule data
            title = data.get("title")
            description = data.get("description")
            unlock_date = data.get("unlockDate")
            is_private = data.get("isPrivate", False)
            recipients = data.get("recipients", [])
            content_data = data.get("content")
            
            # Validate required fields
            if not title or not content_data or not unlock_date:
                return Error("Missing required fields: title, content, and unlockDate are required")
                
            # Prepare content for storage
            json_content = json.dumps(content_data).encode('utf-8')
            
            # Encrypt the content
            iv, encrypted_content = encrypt_message(json_content, self.encryption_key)
            
            # Prepare storage object
            storage_obj = {
                "iv": iv.hex(),
                "content": encrypted_content.hex()
            }

            res = decrypt_message(iv, encrypted_content, self.encryption_key)
            
            
            # Convert to JSON and then to bytes for IPFS storage
            storage_json = json.dumps(storage_obj).encode('utf-8')
            
            # Create temporary file for IPFS upload
            temp_dir = "temp"
            os.makedirs(temp_dir, exist_ok=True)
            temp_file_path = os.path.join(temp_dir, f"{uuid.uuid4()}.json")
            
            with open(temp_file_path, "wb") as f:
                f.write(storage_json)
            
            # Upload to IPFS
            cid = ipfs_api.publish(temp_file_path)
            
            # Clean up temp file
            os.remove(temp_file_path)
            
            if not cid:
                return Error("Failed to upload content to IPFS")
                
            # Pin the content to ensure it's not garbage collected
            ipfs_api.pin(cid)
            
            # Store capsule metadata in MongoDB
            capsule = Capsule()
            capsule_id = capsule.create(
                title=title,
                content=cid,
                unlock_date=unlock_date,
                is_private=is_private,
                owner_id=user_id,
                description=description,
                recipients=recipients
            )
            
            if isinstance(capsule_id, Error):
                return capsule_id
                
            return {
                "id": capsule_id,
                "title": title,
                "unlockDate": unlock_date,
                "isPrivate": is_private,
                "message": "Capsule created successfully"
            }
                
        except Exception as e:
            logger.error(f"Error creating capsule: {e}")
            return Error(f"Error creating capsule: {str(e)}")
        

    def get_capsule(self, capsule_id, user_id=None):
        """
        Retrieve a capsule by its ID
        
        Args:
            capsule_id (str): The ID of the capsule to retrieve
            user_id (str): The ID of the user requesting the capsule
            
        Returns:
            dict or Error: The capsule content or an Error object
        """
        # Get the capsule from the database
        capsule = Capsule().get_by_id(capsule_id, user_id)

        if isinstance(capsule, Error):
            return capsule
        
        # Check unlock date
        """if capsule["unlock_date"] > datetime.datetime.now():
            return {
                    "id": capsule_id,
                    "title": capsule["title"],
                    "content": None,
                    "description": capsule["description"],
                    "unlockDate": capsule["unlock_date"],
                    "isPrivate": capsule["is_private"],
                    "ownerId": capsule["owner_id"]
                    "recipients": capsule["recipients"],
                }"""
        
        # Get the content from IPFS using the CID
        try:
            # Download the file from IPFS
            temp_file_path = "temp_file.json"
            ipfs_api.download(capsule["content"], temp_file_path)

            # Read the downloaded file
            with open(temp_file_path, "r") as f:
                encrypted_data = f.read()

            # Clean up the temporary file
            os.remove(temp_file_path)
                
            if not encrypted_data:
                return {Error("Impossible de retirer la capsule de IPVS")}
                
            # on transforme le json en dico
            storage_obj = json.loads(encrypted_data)

            # Convert hex strings back to bytes
            iv = bytes.fromhex(storage_obj["iv"])

            encrypted_content = bytes.fromhex(storage_obj["content"])          
        
            # Decrypt the content
            decrypted_content = decrypt_message(iv, encrypted_content, self.encryption_key)
                
            # Parse the decrypted JSON content
            content_data = json.loads(decrypted_content.decode('utf-8'))
                
            # Return the complete capsule data
            return {
                "id": capsule_id,
                "title": capsule["title"],
                "content": content_data,
                #"description": capsule["description"],
                "unlockDate": capsule["unlock_date"],
                "isPrivate": capsule["is_private"],
                "ownerId": capsule["owner_id"],
                "recipients": capsule["recipients"]
            }
                
        except Exception as e:
            logger.error(f"Error retrieving capsule content: {e}")
            return Error(f"Error retrieving capsule content: {str(e)}")
                
