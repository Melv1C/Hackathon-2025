import logging
import json
import os
import uuid
from capsule import Capsule
from error import Error
from encryption import encrypt_message, decrypt_message
import ipfs_api

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
            