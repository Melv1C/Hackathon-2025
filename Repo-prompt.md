This file is a merged representation of a subset of the codebase, containing files not matching ignore patterns, combined into a single document by Repomix. The content has been processed where security check has been disabled.

<file_summary>
This section contains a summary of this file.

<purpose>
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.
</purpose>

<file_format>
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files, each consisting of:
  - File path as an attribute
  - Full contents of the file
</file_format>

<usage_guidelines>
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.
</usage_guidelines>

<notes>
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching these patterns are excluded: .github/**, **/README.md
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Security check has been disabled - content may contain sensitive information
</notes>

<additional_info>

</additional_info>

</file_summary>

<directory_structure>
Hackathon-2025-main/
  backend/
    utils/
      email_content.html
      email_utils.py
      ia.py
      prompt.txt
    ai_routes.py
    auth_routes.py
    auth_service.py
    capsule_routes.py
    capsule_service.py
    capsule.py
    encryption.py
    error.py
    mongodb.py
    periodic_tasks.py
    requirements.txt
    server.py
    user.py
  frontend/
    public/
      time-capsule-hero.svg
    src/
      api/
        aiApi.ts
        apiClient.ts
        authApi.ts
        capsuleApi.ts
      assets/
        time-capsule-hero.svg
      components/
        auth/
          ProtectedRoute.tsx
        capsules/
          CapsuleCard.tsx
        layouts/
          MainLayout.tsx
        ui/
          CountdownTimer.tsx
          FileUpload.tsx
          MarkdownViewer.tsx
      hooks/
        useAiAnalysis.ts
        useAuth.ts
        useCapsules.ts
        useCountdown.ts
      pages/
        CapsulePage.tsx
        CreateCapsulePage.tsx
        HomePage.tsx
        LoginPage.tsx
        MyCapsules.tsx
        ProfilePage.tsx
        RegisterPage.tsx
      router/
        routes.tsx
      schemas/
        authSchemas.ts
        capsuleSchemas.ts
      store/
        userAtoms.ts
      theme/
        theme.ts
      App.css
      App.tsx
      env.ts
      folder-structure.md
      index.css
      main.tsx
      vite-env.d.ts
    .gitignore
    eslint.config.js
    index.html
    package.json
    tsconfig.app.json
    tsconfig.json
    tsconfig.node.json
    vite.config.ts
  .gitignore
  docker-compose.yml
</directory_structure>

<files>
This section contains the contents of the repository's files.

<file path="Hackathon-2025-main/backend/utils/email_content.html">
<!-- filepath: c:\Users\maxim\Developpement\hack\Hackathon-2025\backend\utils\email_content.html -->
<html>
<body>
    <h1 style="color: #4CAF50;">Bienvenue dans Capsule Temporelle 2025</h1>
    <p>Bonjour,</p>
    <p>Merci d'utiliser notre application pour créer votre capsule temporelle.</p>
    <p>Voici quelques informations importantes :</p>
    <ul>
        <li>Vos données sont sécurisées avec un chiffrement AES-256.</li>
        <li>Vous pouvez accéder à vos capsules à tout moment.</li>
    </ul>
    <p>Merci,</p>
    <p>L'équipe Capsule Temporelle</p>
</body>
</html>
</file>

<file path="Hackathon-2025-main/backend/utils/email_utils.py">
import smtplib
from email.message import EmailMessage
import ssl


def send_email(message:str, adress:str, subject = ""):
    send_many_email(message, [adress], subject)

def send_many_email(message: str, multiple_addresses, subject=""):
    sender_email = "capsuletemporelle2025@gmail.com"
    port = 465
    password = "ncfp ahry kumi xiwv"  # Faudrais pas mettre le mdp mais vsy
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
        server.login(sender_email, password)
        for address in multiple_addresses:
            # Create an email message
            msg = EmailMessage()
            # Set email headers
            msg['Subject'] = subject
            msg['From'] = sender_email
            msg['To'] = address

            # Check if the message is HTML or plain text
            if "<html>" in message:
                msg.add_alternative(message, subtype="html")
            else:
                msg.set_content(message)

            server.sendmail(sender_email, address, msg.as_string())

def return_email_content(file_path="email_content.html"):
    """
    Reads the content of the email from a file.
    Supports both plain text and HTML content.
    """
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    return content
</file>

<file path="Hackathon-2025-main/backend/utils/ia.py">
from openai import OpenAI
import os
from dotenv import load_dotenv

def createClient():
    load_dotenv()
    api = os.getenv("AI_API_KEY")
    return OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api,
        )

def make_prompt(client, content):
    with open("utils/prompt.txt", "r") as f:
        prompt = f.read()
    prompt = prompt.format(content=content)
    response = client.chat.completions.create(
        extra_body={},
        #model="google/gemini-2.5-pro-exp-03-25:free",
        model="google/gemini-2.0-flash-exp:free",
        messages=[
            {
            "role": "user",
            "content": [
                {
                "type": "text",
                "text": prompt
                }
            ]
            }
        ]
    )
    return response.choices[0].message.content
</file>

<file path="Hackathon-2025-main/backend/utils/prompt.txt">
whats in the content {content} ?
</file>

<file path="Hackathon-2025-main/backend/ai_routes.py">
from flask import Blueprint, request, jsonify
import logging
from utils.ia import *
from error import Error
from auth_service import AuthService

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Create blueprint
ai_bp = Blueprint('ai', __name__, url_prefix='/ai')

aiClient = createClient()

@ai_bp.route('/analyse', methods=['POST'])
def process_ai_request():
    """Process AI request with provided data"""
    try:
        # Get request data
        data = request.get_json()

        content = data.get('content')
        
        logger.info(f"Received AI processing request: {data}")
        
        # Process data with AI service
        result = make_prompt(aiClient, content)
        
        if isinstance(result, Error):
            return jsonify(result.to_dict()), 400
        
        return jsonify(result), 200
    
    except Exception as e:
        logger.error(f"Error processing AI request: {e}")
        return jsonify({"error": "An error occurred while processing the AI request"}), 500
</file>

<file path="Hackathon-2025-main/backend/auth_routes.py">
from flask import Blueprint, request, jsonify
import logging
from user import User
from auth_service import AuthService
from error import Error

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Create blueprint
auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

# Initialize services
auth_service = AuthService()
user_manager = User()

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Extract required fields
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
            
        # Create user
        user_id = user_manager.create(email, password, name)
        
        if isinstance(user_id, Error):
            return jsonify({"error": user_id.message}), 400
            
        # Generate token
        token, refresh_token = auth_service.generate_tokens(user_id)
        
        # Get user data without sensitive info
        user_data = User.get_by_id(user_id)
        
        return jsonify({
            "user": {
                "id": user_data["_id"],
                "email": user_data["email"],
                "name": user_data.get("name"),
                "createdAt": user_data["created_at"],
            },
            "token": token,
            "refreshToken": refresh_token
        }), 201
        
    except Exception as e:
        logger.error(f"Error registering user: {e}")
        return jsonify({"error": "An error occurred during registration"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login an existing user"""
    try:
        data = request.get_json()
        
        # Extract credentials
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
            
        # Verify credentials
        if not User.verify_password(email, password):
            return jsonify({"error": "Invalid credentials"}), 401
            
        # Get user
        user_doc = User.get_by_email(email)
        if not user_doc:
            return jsonify({"error": "User not found"}), 404
            
        user_id = str(user_doc["_id"])
        
        # Generate tokens
        token, refresh_token = auth_service.generate_tokens(user_id)
        
        # Get user data without sensitive info
        user_data = User.get_by_id(user_id)
        
        return jsonify({
            "user": {
                "id": user_data["_id"],
                "email": user_data["email"],
                "name": user_data.get("name"),
                "createdAt": user_data["created_at"],
            },
            "token": token,
            "refreshToken": refresh_token
        }), 200
        
    except Exception as e:
        logger.error(f"Error logging in user: {e}")
        return jsonify({"error": "An error occurred during login"}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout the current user"""
    try:
        # In a more robust implementation, we would invalidate the token here
        # For simplicity, we'll just return success as the frontend will handle 
        # removing the tokens from localStorage
        return jsonify({"message": "Logout successful"}), 200
        
    except Exception as e:
        logger.error(f"Error logging out user: {e}")
        return jsonify({"error": "An error occurred during logout"}), 500

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """Get the current authenticated user"""
    try:
        # Get user_id from token
        user_id = auth_service.get_user_id_from_request(request)
        
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
            
        # Get user data
        user_data = User.get_by_id(user_id)
        
        if not user_data:
            return jsonify({"error": "User not found"}), 404
            
        return jsonify({
            "id": user_data["_id"],
            "email": user_data["email"],
            "name": user_data.get("name"),
            "createdAt": user_data["created_at"],
        }), 200
        
    except Exception as e:
        logger.error(f"Error retrieving current user: {e}")
        return jsonify({"error": "An error occurred while retrieving user data"}), 500

@auth_bp.route('/refresh', methods=['POST'])
def refresh_token():
    """Refresh the authentication token"""
    try:
        data = request.get_json()
        refresh_token = data.get('refreshToken')
        
        if not refresh_token:
            return jsonify({"error": "Refresh token is required"}), 400
            
        # Verify refresh token and get user_id
        user_id = auth_service.verify_refresh_token(refresh_token)
        
        if not user_id:
            return jsonify({"error": "Invalid or expired refresh token"}), 401
            
        # Generate new tokens
        token, new_refresh_token = auth_service.generate_tokens(user_id)
        
        return jsonify({
            "token": token,
            "refreshToken": new_refresh_token
        }), 200
        
    except Exception as e:
        logger.error(f"Error refreshing token: {e}")
        return jsonify({"error": "An error occurred while refreshing token"}), 500
</file>

<file path="Hackathon-2025-main/backend/auth_service.py">
import jwt
import datetime
import os
import logging
from flask import Request

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AuthService:
    """Service for authentication-related operations"""
    
    def __init__(self):
        # Get secret key from environment or use a default for development
        self.secret_key = os.getenv('SECRET_KEY', 'dev-key-for-development-only')
        self.token_expiry = 3600 * 24   # 1 day in seconds
        self.refresh_token_expiry = 7 * 24 * 3600  # 7 days in seconds
    
    def generate_tokens(self, user_id):
        """
        Generate JWT access and refresh tokens
        
        Args:
            user_id (str): The user ID to encode in the tokens
            
        Returns:
            tuple: (access_token, refresh_token)
        """
        try:
            # Create token payload
            payload = {
                'user_id': user_id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=self.token_expiry),
                'iat': datetime.datetime.utcnow()
            }
            
            # Create refresh token payload
            refresh_payload = {
                'user_id': user_id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=self.refresh_token_expiry),
                'iat': datetime.datetime.utcnow(),
                'type': 'refresh'
            }
            
            # Generate tokens
            token = jwt.encode(payload, self.secret_key, algorithm='HS256')
            refresh_token = jwt.encode(refresh_payload, self.secret_key, algorithm='HS256')
            
            return token, refresh_token
            
        except Exception as e:
            logger.error(f"Error generating tokens: {e}")
            return None, None
    
    def verify_token(self, token):
        """
        Verify the JWT token and return its payload
        
        Args:
            token (str): The JWT token to verify
            
        Returns:
            dict or None: The token payload if valid, None otherwise
        """
        try:
            # Decode and verify token
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
            return payload
            
        except jwt.ExpiredSignatureError:
            logger.warning("Token has expired")
            return None
            
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid token: {e}")
            return None
            
        except Exception as e:
            logger.error(f"Error verifying token: {e}")
            return None
    
    def verify_refresh_token(self, token):
        """
        Verify the refresh token and return the user ID
        
        Args:
            token (str): The refresh token to verify
            
        Returns:
            str or None: The user ID if valid, None otherwise
        """
        try:
            # Decode and verify token
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
            
            # Check if it's a refresh token
            if payload.get('type') != 'refresh':
                logger.warning("Not a refresh token")
                return None
                
            return payload.get('user_id')
            
        except jwt.ExpiredSignatureError:
            logger.warning("Refresh token has expired")
            return None
            
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid refresh token: {e}")
            return None
            
        except Exception as e:
            logger.error(f"Error verifying refresh token: {e}")
            return None
    
    def get_user_id_from_request(self, request):
        """
        Extract and verify user ID from the request's Authorization header
        
        Args:
            request (Request): The Flask request object
            
        Returns:
            str or None: The user ID if valid, None otherwise
        """
        auth_header = request.headers.get('Authorization')
        print(auth_header)
        if not auth_header:
            return None
            
        try:
            # Extract token from header
            token = auth_header.split(' ')[1] if 'Bearer' in auth_header else auth_header
            # Verify token
            payload = self.verify_token(token)
            print(payload)
            if not payload:
                return None
                
            return payload.get('user_id')
            
        except Exception as e:
            logger.error(f"Error extracting user ID from request: {e}")
            return None
</file>

<file path="Hackathon-2025-main/backend/capsule_routes.py">
from flask import Blueprint, request, jsonify
import logging
import os
from capsule_service import CapsuleService
from error import Error
from auth_service import AuthService

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Create blueprint
capsule_bp = Blueprint('capsule', __name__, url_prefix='')

# Create capsule service with encryption key
encryption_key = os.getenv('SECRET_KEY', 'default-very-secure-encryption-key').encode('utf-8')
capsule_service = CapsuleService(encryption_key)

auth_service = AuthService()

@capsule_bp.route('/capsules', methods=['get'])
def get_capsules():
    """Get all capsules for a user"""
    try:
        # Verify authentication
        user_id = auth_service.get_user_id_from_request(request=request)
        
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
        
        # Get capsules
        result = capsule_service.get_capsules(user_id)
        
        if isinstance(result, Error):
            return jsonify(result.to_dict()), 404 if "not found" in str(result) else 403
            
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Error retrieving capsules: {e}")
        return jsonify({"error": "An error occurred while retrieving capsules"}), 500

@capsule_bp.route('/capsules', methods=['POST'])
def create_capsule():
    """Create a new time capsule"""
    try:
        # Verify authentication
        user_id = auth_service.get_user_id_from_request(request=request)
        
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
        # Get request data
        data = request.get_json()
        print(data)

        print(f"Received data: {data}")  # Debugging line
        
        # Create capsule
        result = capsule_service.create_capsule(data, user_id)
        
        if isinstance(result, Error):
            return jsonify(result.to_dict()), 400
            
        return jsonify(result), 201
        
    except Exception as e:
        logger.error(f"Error creating capsule: {e}")
        return jsonify({"error": "An error occurred while creating capsule"}), 500

@capsule_bp.route('/capsules/<capsule_id>', methods=['GET'])
def get_capsule(capsule_id):
    """Get a specific capsule"""
    try:
        # Get user_id from token (if authenticated)
        user_id = auth_service.get_user_id_from_request(request=request)

        
        # Get capsule
        result = capsule_service.get_capsule(capsule_id, user_id)
        
        if isinstance(result, Error):
            return jsonify(result.to_dict()), 404 if "not found" in str(result) else 403
            
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Error retrieving capsule: {e}")
        return jsonify({"error": "An error occurred while retrieving capsule"}), 500
</file>

<file path="Hackathon-2025-main/backend/capsule_service.py">
import logging
import json
import os
import uuid
from capsule import Capsule
from error import Error
from encryption import encrypt_message, decrypt_message
import ipfs_api
import datetime
from utils.email_utils import send_many_email, send_email, return_email_content
import hashlib

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
            hash_value = hashlib.sha256(json_content).hexdigest()
            
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
                recipients=recipients,
                hash= hash_value
            )
            
            if isinstance(capsule_id, Error):
                return capsule_id

            send_many_email(return_email_content(), recipients, "On t'as envoyé une capsule !" )

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
        if capsule["is_unlocked"] == False:
            return {
                "id": capsule_id,
                "title": capsule["title"],
                "content": None,
                "description": capsule.get("description", ""),
                "unlockDate": capsule["unlock_date"],
                "isPrivate": capsule["is_private"],
                "ownerId": capsule["owner_id"],
                "recipients": capsule.get("recipients", []),
                "creationDate": capsule["created_at"],
                "isUnlocked": capsule["is_unlocked"]
            }
        
        
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
                
            new_hash = hashlib.sha256(decrypted_content).hexdigest()
            # Parse the decrypted JSON content
            content_data = json.loads(decrypted_content.decode('utf-8'))
            # Return the complete capsule data
            return {
                "id": capsule_id,
                "title": capsule["title"],
                "content": content_data,
                "description": capsule.get("description", ""),
                "unlockDate": capsule["unlock_date"],
                "isPrivate": capsule["is_private"],
                "ownerId": capsule["owner_id"],
                "recipients": capsule.get("recipients", []),
                "creationDate": capsule["created_at"],
                "isUnlocked": capsule["is_unlocked"],
                "hasChanged": new_hash != capsule.get("hash")
            }
                
        except Exception as e:
            logger.error(f"Error retrieving capsule content: {e}")
            return Error(f"Error retrieving capsule content: {str(e)}")
    
    def get_capsules(self, user_id):
        """
        Get all capsules accessible to a user
        
        Args:
            user_id (str): The ID of the user
            
        Returns:
            list or Error: A list of capsule summaries or an Error object
        """
        try:
            # Get capsules from database
            capsule = Capsule()
            capsules = capsule.get_capsules(user_id)
            
            if isinstance(capsules, Error):
                return capsules
                
            # Return the list of capsules with basic metadata
            return [{
                "id": capsule["_id"],
                "title": capsule["title"],
                "unlockDate": capsule["unlock_date"],
                "isPrivate": capsule["is_private"],
                "isUnlocked": capsule["is_unlocked"],
                "ownerId": capsule["owner_id"],
                "description": capsule.get("description")
            } for capsule in capsules]
                
        except Exception as e:
            logger.error(f"Error retrieving capsules: {e}")
            return Error(f"Error retrieving capsules: {str(e)}")
</file>

<file path="Hackathon-2025-main/backend/capsule.py">
import logging
from bson import ObjectId
import datetime
from mongodb import db
from error import Error
from user import User

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def get_unlockable_capsules():
    collection = db.get_collection("capsules")
    if collection is None:
        logger.error("Database connection not established")
        return Error("Database connection error")

    now = datetime.datetime.now(datetime.timezone.utc)
    # Create query to match any of our criteria
    query = {
        "unlock_date": {"$lte": now},  # Unlock date is less than or equal to now
        "is_deleted": False,  # Exclude deleted capsules
        "email_sent": False  # Exclude capsules that have already been sent
    }
    
    # Execute query
    capsules= collection.find(query)
    return capsules

def update_capsule_attribute(capsule_id, attribute, value):
    """
    Update a specific attribute of a capsule in the database.

    Args:
        capsule_id (str): The ID of the capsule to update.
        attribute (str): The attribute to update.
        value (any): The new value for the attribute.

    Returns:
        bool or Error: True if the update was successful, or an Error object.
    """
    if not capsule_id or not attribute:
        return Error("Capsule ID, User ID, and attribute are required")

    collection = db.get_collection("capsules")
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

        # Update the specified attribute
        result = collection.update_one(
            {"_id": obj_id},
            {"$set": {attribute: value}}
        )

        if result.modified_count > 0:
            logger.info(f"Capsule {capsule_id} updated successfully: {attribute} = {value}")
            return True
        else:
            return Error("Failed to update capsule")

    except Exception as e:
        logger.error(f"Error updating capsule: {e}")
        return Error(f"Error updating capsule: {str(e)}")

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
    
    def create(self, title, content, hash, unlock_date, is_private, owner_id, description=None, recipients=None):
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
            print(f"Unlock date: {unlock_datetime}")
            print(f"Current date: {datetime.datetime.now(datetime.timezone.utc)}")
            if unlock_datetime <= datetime.datetime.now(datetime.timezone.utc):
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
                "hash": hash,
                "unlock_date": unlock_datetime,
                "is_private": is_private,
                "owner_id": owner_id,
                "created_at": datetime.datetime.now(),
                "is_deleted": False,
                "email_sent": False
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
            is_unlocked = now >= capsule["unlock_date"]
            
            # Check access permissions
            if capsule["is_private"] and user_id != capsule["owner_id"]:
                return Error("Access denied: This capsule is private")
            
            # Add unlockable status to the response
            capsule["is_unlocked"] = is_unlocked
            
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
            now = datetime.datetime.now(datetime.timezone.utc)
            
            for capsule in cursor:
                # Add unlocked status
                capsule["unlock_date"] = capsule["unlock_date"].replace(tzinfo=datetime.timezone.utc)
                capsule["is_unlocked"] = now >= capsule["unlock_date"]
                # Convert ObjectId to string for JSON serialization
                capsule["_id"] = str(capsule["_id"])
                capsules.append(capsule)
            
            return capsules
            
        except Exception as e:
            logger.error(f"Error retrieving capsules: {e}")
            return Error(f"Error retrieving capsules: {str(e)}")
</file>

<file path="Hackathon-2025-main/backend/encryption.py">
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from base64 import b64encode, b64decode
import os

def encrypt_message(message, key):
    """
    Encrypt a message using AES-256 in CBC mode
    
    Args:
        message (bytes): The message to encrypt
        key (bytes): The encryption key (must be 32 bytes for AES-256)
        
    Returns:
        tuple: (iv, ciphertext) where both are bytes objects
    """
    # Generate a random IV (unique for each message)
    iv = os.urandom(16)
    
    # Create the cipher
    cipher = Cipher(
        algorithms.AES(key),
        modes.CBC(iv),
        backend=default_backend()
    )
    
    encryptor = cipher.encryptor()
    
    # Add padding (PKCS7)
    padding_length = 16 - (len(message) % 16)
    message += bytes([padding_length]) * padding_length
    
    # Encrypt the message
    ciphertext = encryptor.update(message) + encryptor.finalize()
    
    return iv, ciphertext

def decrypt_message(iv, ciphertext, key):
    """
    Decrypt a message encrypted with AES-256 in CBC mode
    
    Args:
        iv (bytes): The initialization vector
        ciphertext (bytes): The encrypted message
        key (bytes): The encryption key
        
    Returns:
        bytes: The decrypted message
    """
    cipher = Cipher(
        algorithms.AES(key),
        modes.CBC(iv),
        backend=default_backend()
    )

    decryptor = cipher.decryptor()
    plaintext_padded = decryptor.update(ciphertext) + decryptor.finalize()
    
    # Remove PKCS7 padding
    padding_length = plaintext_padded[-1]
    plaintext = plaintext_padded[:-padding_length]
    
    return plaintext
</file>

<file path="Hackathon-2025-main/backend/error.py">
class Error:
    def __init__(self, message, code=None):
        self.message = message
        self.code = code

    def __str__(self):
        return f"Error {self.code}: {self.message}" if self.code else self.message

    def to_dict(self):
        """Convert error to dictionary for JSON response"""
        error_dict = {"error": self.message}
        if self.code:
            error_dict["code"] = self.code
        return error_dict
</file>

<file path="Hackathon-2025-main/backend/mongodb.py">
import pymongo
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import logging
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class MongoDBConnection:
    """MongoDB Connection Handler"""
    
    def __init__(self, username, password, db_name, host='localhost', port=27017):
        """Initialize connection parameters"""
        self.host = host
        self.port = port
        self.db_name = db_name
        self.username = username
        self.password = password
        self.client = None
        self.db = None
    
    def connect(self):
        """Establish connection to MongoDB"""
        try:
            # Create connection string
            if self.username and self.password:
                connection_string = f"mongodb://{self.username}:{self.password}@{self.host}:{self.port}/"
            else:
                connection_string = f"mongodb://{self.host}:{self.port}/"
            
            # Connect to MongoDB
            self.client = MongoClient(connection_string, serverSelectionTimeoutMS=5000)
            
            # Check if connection is successful
            self.client.admin.command('ping')
            
            # Get database
            self.db = self.client[self.db_name]
            
            logger.info(f"Connected to MongoDB at {self.host}:{self.port}")
            return True
            
        except ConnectionFailure as e:
            logger.error(f"MongoDB Connection Error: {e}")
            return False
        except ServerSelectionTimeoutError as e:
            logger.error(f"MongoDB Server Selection Timeout: {e}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error when connecting to MongoDB: {e}")
            return False
    
    def close(self):
        """Close the MongoDB connection"""
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")
    
    def get_collection(self, collection_name):
        """Get a collection from the database"""
        if self.db is None:  # Changed from 'if not self.db:'
            logger.error("Database connection not established. Call connect() first.")
            return None
        return self.db[collection_name]
    
    def insert_document(self, collection_name, document):
        """Insert a single document into the specified collection"""
        collection = self.get_collection(collection_name)
        if collection is not None:  # Changed from 'if collection:'
            try:
                result = collection.insert_one(document)
                logger.info(f"Document inserted with ID: {result.inserted_id}")
                return result.inserted_id
            except Exception as e:
                logger.error(f"Error inserting document: {e}")
                return None
        return None
    
    def find_documents(self, collection_name, query=None, projection=None):
        """Find documents in the specified collection"""
        collection = self.get_collection(collection_name)
        if collection is not None: 
            try:
                if query is None:
                    query = {}
                return list(collection.find(query, projection))
            except Exception as e:
                logger.error(f"Error finding documents: {e}")
                return []
        return []

# Create a singleton instance
db = MongoDBConnection(
    host=os.getenv('MONGODB_HOST', 'localhost'),
    port=int(os.getenv('MONGODB_PORT', 27017)),
    db_name=os.getenv('MONGODB_DB_NAME', 'hackathon_db'),
    username=os.getenv('MONGODB_USERNAME', 'root'),
    password=os.getenv('MONGODB_PASSWORD', 'example')
)
db.connect()
</file>

<file path="Hackathon-2025-main/backend/periodic_tasks.py">
from capsule import get_unlockable_capsules, update_capsule_attribute
from utils.email_utils import send_many_email

#verifier toutes les capsules pour éventuellement les envoyer par email
def periodic_task():
    """Task to run every 24 hours"""
    capsules_to_send = get_unlockable_capsules()
    for caps in capsules_to_send:
        if caps.get("recipients") is None:
            continue
        send_many_email("bien  joudsnjknvx", caps.get("recipients"), "sujet du mail")
        update_capsule_attribute(caps["_id"],"email_sent",True)
</file>

<file path="Hackathon-2025-main/backend/requirements.txt">
Flask==3.1.0
python-dotenv
cryptography
IPFS-Toolkit
flask-cors
pyjwt
pymongo==4.11.3
APScheduler==3.11.0
openai
</file>

<file path="Hackathon-2025-main/backend/server.py">
import os
import logging  # Import logging module
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from capsule_routes import capsule_bp
from auth_routes import auth_bp
from ai_routes import ai_bp
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
import atexit
from periodic_tasks import periodic_task
from utils.ia import *

# Load environment variables
load_dotenv()

def create_app(test_config=None):
    """Create and configure the Flask application"""
    app = Flask(__name__)
    CORS(app)

    app.config.from_mapping(
        SECRET_KEY=os.getenv('SECRET_KEY', 'dev-key-for-development-only'),
        IPFS_API_URL=os.getenv('IPFS_API_URL', 'http://localhost:5001/api/v0'),
        IPFS_GATEWAY_URL=os.getenv('IPFS_GATEWAY_URL', 'https://ipfs.io/ipfs'),
    )

    if test_config:
        app.config.update(test_config)

    app.register_blueprint(auth_bp)
    app.register_blueprint(capsule_bp)
    app.register_blueprint(ai_bp)

    @app.errorhandler(404)
    def not_found(error):
        return {"error": "Resource not found"}, 404

    @app.errorhandler(500)
    def internal_error(error):
        return {"error": "Internal server error"}, 500

    os.makedirs('temp', exist_ok=True)

    # Configure APScheduler logging level
    logging.getLogger('apscheduler').setLevel(logging.WARNING)

    scheduler = BackgroundScheduler()
    scheduler.add_job(
        func=periodic_task,
        trigger=IntervalTrigger(seconds=10),  # Exécuter toutes les 24 heures
        id='periodic_task',
        name='Clean up temporary files every 24 hours',
        replace_existing=True
    )
    scheduler.start()

    atexit.register(lambda: scheduler.shutdown())

    return app

if __name__ == '__main__':
    capsule_app = create_app()
    capsule_app.run(debug=True, host='0.0.0.0', port=3000)
</file>

<file path="Hackathon-2025-main/backend/user.py">
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
    def __init__(self):
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
    
    def create(self, email, password, name=None):
        """
        Create a new user
        
        Returns:
            str or Error: User ID if successful, Error object otherwise
        """
        if not email or not password:
            logger.error("Email and password are required to create a user")
            return Error("Email and password are required")
        
        collection = db.get_collection(self.collection_name)
        if collection is not None:
            try:
                # Check if user already exists
                existing_user = collection.find_one({"email": email})
                if existing_user:
                    return Error("User already exists")
                
                # Hash password
                password_data = self._hash_password(password)
                
                # Create user document
                user_doc = {
                    "email": email,
                    "password_hash": password_data['hash'],
                    "salt": password_data['salt'],
                    "created_at": datetime.datetime.now(),
                    "updated_at": datetime.datetime.now()
                }
                
                # Add name if provided
                if name:
                    user_doc["name"] = name
                
                # Insert user into database
                result = collection.insert_one(user_doc)
                
                logger.info(f"User created with ID: {result.inserted_id}")
                return str(result.inserted_id)
                
            except DuplicateKeyError:
                logger.error(f"Duplicate key error: User with email {email} already exists")
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
</file>

<file path="Hackathon-2025-main/frontend/public/time-capsule-hero.svg">
<svg width="600" height="400" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Time capsule illustration - a stylized capsule with a clock -->
  <circle cx="300" cy="200" r="150" fill="#f0f4f8" stroke="#3f51b5" stroke-width="8"/>
  <circle cx="300" cy="200" r="130" fill="white" stroke="#3f51b5" stroke-width="4"/>
  
  <!-- Clock hands -->
  <line x1="300" y1="200" x2="300" y2="120" stroke="#3f51b5" stroke-width="6" stroke-linecap="round"/>
  <line x1="300" y1="200" x2="350" y2="240" stroke="#3f51b5" stroke-width="6" stroke-linecap="round"/>
  
  <!-- Clock center -->
  <circle cx="300" cy="200" r="10" fill="#3f51b5"/>
  
  <!-- Hour markers -->
  <line x1="300" y1="90" x2="300" y2="110" stroke="#3f51b5" stroke-width="4" stroke-linecap="round"/>
  <line x1="300" y1="290" x2="300" y2="310" stroke="#3f51b5" stroke-width="4" stroke-linecap="round"/>
  <line x1="190" y1="200" x2="210" y2="200" stroke="#3f51b5" stroke-width="4" stroke-linecap="round"/>
  <line x1="390" y1="200" x2="410" y2="200" stroke="#3f51b5" stroke-width="4" stroke-linecap="round"/>
  
  <!-- Digital elements surrounding the capsule -->
  <rect x="120" y="100" width="30" height="30" rx="5" fill="#f50057" opacity="0.7"/>
  <rect x="450" y="150" width="40" height="40" rx="5" fill="#3f51b5" opacity="0.7"/>
  <rect x="180" y="320" width="25" height="25" rx="5" fill="#00bfa5" opacity="0.7"/>
  <rect x="430" y="280" width="35" height="35" rx="5" fill="#f50057" opacity="0.7"/>
  
  <!-- Document icons -->
  <rect x="180" y="120" width="40" height="50" rx="5" fill="#e3f2fd" stroke="#3f51b5" stroke-width="2"/>
  <line x1="190" y1="135" x2="210" y2="135" stroke="#3f51b5" stroke-width="2"/>
  <line x1="190" y1="145" x2="210" y2="145" stroke="#3f51b5" stroke-width="2"/>
  <line x1="190" y1="155" x2="200" y2="155" stroke="#3f51b5" stroke-width="2"/>
  
  <rect x="400" y="120" width="40" height="50" rx="5" fill="#e3f2fd" stroke="#3f51b5" stroke-width="2"/>
  <line x1="410" y1="135" x2="430" y2="135" stroke="#3f51b5" stroke-width="2"/>
  <line x1="410" y1="145" x2="430" y2="145" stroke="#3f51b5" stroke-width="2"/>
  <line x1="410" y1="155" x2="420" y2="155" stroke="#3f51b5" stroke-width="2"/>
  
  <!-- Photo frame -->
  <rect x="380" y="250" width="50" height="40" rx="5" fill="#e3f2fd" stroke="#3f51b5" stroke-width="2"/>
  <circle cx="395" cy="265" r="5" fill="#3f51b5"/>
  <rect x="390" y="275" width="30" height="10" fill="#3f51b5" opacity="0.5"/>
</svg>
</file>

<file path="Hackathon-2025-main/frontend/src/api/aiApi.ts">
import apiClient from './apiClient';

export const aiApi = {
    /**
     * Request AI analysis of text content
     * @param content - The text content to analyze
     * @returns The AI analysis result
     */
    analyzeContent: async (content: string) => {
        const response = await apiClient.post('/ai/analyse', { content });
        return response.data;
    },
};
</file>

<file path="Hackathon-2025-main/frontend/src/api/apiClient.ts">
import axios, { AxiosError, AxiosInstance } from 'axios';
import { API_BASE_URL } from '../env';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to attach token to requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor for token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config;

        // If error is 401 Unauthorized and we haven't tried to refresh the token yet
        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest.headers['x-retry']
        ) {
            try {
                // Get refresh token
                const refreshToken = localStorage.getItem('refresh_token');

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Try to get a new token
                const response = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    {
                        refreshToken,
                    }
                );

                // Store new tokens
                if (response.data.token) {
                    localStorage.setItem('auth_token', response.data.token);

                    if (response.data.refreshToken) {
                        localStorage.setItem(
                            'refresh_token',
                            response.data.refreshToken
                        );
                    }

                    // Update the failed request with new token and retry
                    originalRequest.headers[
                        'Authorization'
                    ] = `Bearer ${response.data.token}`;
                    originalRequest.headers['x-retry'] = 'true';

                    // Retry the original request
                    return apiClient(originalRequest);
                }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (refreshError) {
                // If refresh fails, log out the user
                localStorage.removeItem('auth_token');
                localStorage.removeItem('refresh_token');
                // Redirect to login or handle as needed
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
</file>

<file path="Hackathon-2025-main/frontend/src/api/authApi.ts">
import {
    AuthResponseType,
    LoginUserType,
    RegisterUserType,
    UserType,
} from '../schemas/authSchemas';
import apiClient from './apiClient';

export const authApi = {
    /**
     * Register a new user
     * @param userData - The user registration data
     * @returns User data and auth token
     */
    registerUser: async (
        userData: RegisterUserType
    ): Promise<AuthResponseType> => {
        const response = await apiClient.post('/auth/register', userData);

        // Store token in localStorage for future requests
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);

            if (response.data.refreshToken) {
                localStorage.setItem(
                    'refresh_token',
                    response.data.refreshToken
                );
            }
        }

        return response.data;
    },

    /**
     * Log in an existing user
     * @param credentials - User login credentials
     * @returns User data and auth token
     */
    loginUser: async (
        credentials: LoginUserType
    ): Promise<AuthResponseType> => {
        const response = await apiClient.post('/auth/login', credentials);

        // Store token in localStorage for future requests
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);

            if (response.data.refreshToken) {
                localStorage.setItem(
                    'refresh_token',
                    response.data.refreshToken
                );
            }
        }

        return response.data;
    },

    /**
     * Log out the current user
     */
    logoutUser: async (): Promise<void> => {
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear local storage tokens
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
        }
    },

    /**
     * Get current user profile
     * @returns Current user data
     */
    getCurrentUser: async (): Promise<UserType> => {
        console.log('Fetching current user...');
        const response = await apiClient.get('/auth/me');
        return response.data;
    },

    /**
     * Refresh the authentication token
     * @returns New auth token and refresh token
     */
    refreshToken: async (): Promise<{
        token: string;
        refreshToken?: string;
    }> => {
        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await apiClient.post('/auth/refresh', {
            refreshToken,
        });

        // Store new tokens
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);

            if (response.data.refreshToken) {
                localStorage.setItem(
                    'refresh_token',
                    response.data.refreshToken
                );
            }
        }

        return response.data;
    },
};
</file>

<file path="Hackathon-2025-main/frontend/src/api/capsuleApi.ts">
import { CapsuleSchema, CreateCapsuleType, UserCapsulesSchema, UserCapsulesType } from '../schemas/capsuleSchemas';
import apiClient from './apiClient';

export const capsuleApi = {
    /**
     * Create a new time capsule
     * @param capsuleData - The capsule data to create
     * @returns The created capsule data with ID
     */
    createCapsule: async (capsuleData: CreateCapsuleType) => {
        console.log('Creating capsule with data:', capsuleData);

        const response = await apiClient.post('/capsules', capsuleData);
        return response.data;
    },

    /**
     * Get a capsule by ID
     * @param id - The capsule ID
     */
    getCapsule: async (id: string) => {
        const response = await apiClient.get(`/capsules/${id}`);
        console.log('Capsule response:', response.data);
        // Handle response data which might contain base64 file content
        return CapsuleSchema.parse(response.data);
    },

    /**
     * Get all capsules for current user
     */
    getUserCapsules: async (): Promise<UserCapsulesType> => {
        const response = await apiClient.get('/capsules');
        return UserCapsulesSchema.parse(response.data);
    },

    /**
     * Delete a capsule by ID
     * @param id - The capsule ID
     */
    deleteCapsule: async (id: string) => {
        const response = await apiClient.delete(`/capsules/${id}`);
        return response.data;
    },
};
</file>

<file path="Hackathon-2025-main/frontend/src/assets/time-capsule-hero.svg">
<svg width="600" height="400" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Time capsule illustration - a stylized capsule with a clock -->
  <circle cx="300" cy="200" r="150" fill="#f0f4f8" stroke="#3f51b5" stroke-width="8"/>
  <circle cx="300" cy="200" r="130" fill="white" stroke="#3f51b5" stroke-width="4"/>
  
  <!-- Clock hands -->
  <line x1="300" y1="200" x2="300" y2="120" stroke="#3f51b5" stroke-width="6" stroke-linecap="round"/>
  <line x1="300" y1="200" x2="350" y2="240" stroke="#3f51b5" stroke-width="6" stroke-linecap="round"/>
  
  <!-- Clock center -->
  <circle cx="300" cy="200" r="10" fill="#3f51b5"/>
  
  <!-- Hour markers -->
  <line x1="300" y1="90" x2="300" y2="110" stroke="#3f51b5" stroke-width="4" stroke-linecap="round"/>
  <line x1="300" y1="290" x2="300" y2="310" stroke="#3f51b5" stroke-width="4" stroke-linecap="round"/>
  <line x1="190" y1="200" x2="210" y2="200" stroke="#3f51b5" stroke-width="4" stroke-linecap="round"/>
  <line x1="390" y1="200" x2="410" y2="200" stroke="#3f51b5" stroke-width="4" stroke-linecap="round"/>
  
  <!-- Digital elements surrounding the capsule -->
  <rect x="120" y="100" width="30" height="30" rx="5" fill="#f50057" opacity="0.7"/>
  <rect x="450" y="150" width="40" height="40" rx="5" fill="#3f51b5" opacity="0.7"/>
  <rect x="180" y="320" width="25" height="25" rx="5" fill="#00bfa5" opacity="0.7"/>
  <rect x="430" y="280" width="35" height="35" rx="5" fill="#f50057" opacity="0.7"/>
  
  <!-- Document icons -->
  <rect x="180" y="120" width="40" height="50" rx="5" fill="#e3f2fd" stroke="#3f51b5" stroke-width="2"/>
  <line x1="190" y1="135" x2="210" y2="135" stroke="#3f51b5" stroke-width="2"/>
  <line x1="190" y1="145" x2="210" y2="145" stroke="#3f51b5" stroke-width="2"/>
  <line x1="190" y1="155" x2="200" y2="155" stroke="#3f51b5" stroke-width="2"/>
  
  <rect x="400" y="120" width="40" height="50" rx="5" fill="#e3f2fd" stroke="#3f51b5" stroke-width="2"/>
  <line x1="410" y1="135" x2="430" y2="135" stroke="#3f51b5" stroke-width="2"/>
  <line x1="410" y1="145" x2="430" y2="145" stroke="#3f51b5" stroke-width="2"/>
  <line x1="410" y1="155" x2="420" y2="155" stroke="#3f51b5" stroke-width="2"/>
  
  <!-- Photo frame -->
  <rect x="380" y="250" width="50" height="40" rx="5" fill="#e3f2fd" stroke="#3f51b5" stroke-width="2"/>
  <circle cx="395" cy="265" r="5" fill="#3f51b5"/>
  <rect x="390" y="275" width="30" height="10" fill="#3f51b5" opacity="0.5"/>
</svg>
</file>

<file path="Hackathon-2025-main/frontend/src/components/auth/ProtectedRoute.tsx">
import { Box, CircularProgress } from '@mui/material';
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
    children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Show loading spinner while authentication status is being determined
    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // Redirect to login if not authenticated, preserving the intended destination
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Render children if authenticated
    return <>{children}</>;
}
</file>

<file path="Hackathon-2025-main/frontend/src/components/capsules/CapsuleCard.tsx">
import LockClockIcon from '@mui/icons-material/LockClock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserCapsulesType } from '../../schemas/capsuleSchemas';

type CapsuleCardProps = {
    capsule: UserCapsulesType[0];
};

export function CapsuleCard(props: CapsuleCardProps) {
    const { capsule } = props;
    const navigate = useNavigate();

    const unlockDate = new Date(capsule.unlockDate);
    const isUnlocked = capsule.isUnlocked;

    // Format date and time
    const formattedDateTime = unlockDate.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const handleClick = () => {
        navigate(`/capsule/${capsule.id}`);
    };

    // Common card content
    const cardContent = (
        <>
            <Box
                sx={{
                    bgcolor: isUnlocked ? 'success.main' : 'primary.main',
                    color: 'white',
                    p: 2.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                }}
            >
                {isUnlocked ? (
                    <LockOpenIcon fontSize="medium" />
                ) : (
                    <LockClockIcon fontSize="medium" />
                )}
                <Typography variant="body1" fontWeight="medium">
                    {isUnlocked ? 'Unlocked' : 'Locked'}
                </Typography>
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    noWrap
                    sx={{
                        fontWeight: 600,
                        mb: 2,
                    }}
                >
                    {capsule.title}
                </Typography>

                <Box
                    mt={2.5}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                    }}
                >
                    <Chip
                        label={
                            isUnlocked
                                ? `Unlocked on ${formattedDateTime}`
                                : `Unlocks on ${formattedDateTime}`
                        }
                        color={isUnlocked ? 'success' : 'primary'}
                        size="medium"
                        icon={isUnlocked ? <LockOpenIcon /> : <LockClockIcon />}
                        sx={{
                            px: 1,
                            py: 0.75,
                            '& .MuiChip-label': {
                                px: 1,
                                fontWeight: 500,
                            },
                            '& .MuiChip-icon': {
                                ml: 0.5,
                            },
                        }}
                    />
                </Box>
            </CardContent>
        </>
    );

    return (
        <Card
            elevation={4}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 8,
                },
                overflow: 'hidden',
                border: `1px solid ${
                    isUnlocked
                        ? 'rgba(76, 175, 80, 0.3)'
                        : 'rgba(25, 118, 210, 0.3)'
                }`,
                cursor: 'pointer',
            }}
            onClick={handleClick}
        >
            <CardActionArea
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    justifyContent: 'flex-start',
                }}
            >
                {cardContent}
            </CardActionArea>
        </Card>
    );
}
</file>

<file path="Hackathon-2025-main/frontend/src/components/layouts/MainLayout.tsx">
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Container,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useState } from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Navigation links for the header
const navItems = [
    { text: 'Home', path: '/' },
    { text: 'Create Capsule', path: '/capsules/create' },
    { text: 'My Capsules', path: '/my-capsules' },
];

export function MainLayout() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const { isAuthenticated, user, logoutUser } = useAuth();

    // Account menu state
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleOpenAccountMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseAccountMenu = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await logoutUser();
        handleCloseAccountMenu();
    };

    // Mobile drawer component
    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                }}
            >
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/"
                    sx={{ textDecoration: 'none', color: 'text.primary' }}
                >
                    Time Capsule
                </Typography>
                <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="close drawer"
                    onClick={handleDrawerToggle}
                >
                    <CloseIcon />
                </IconButton>
            </Box>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to={item.path}
                            sx={{ textAlign: 'center' }}
                        >
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
                {isAuthenticated ? (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ textAlign: 'center' }}>
                                <ListItemText
                                    primary={`Hello, ${user?.name || 'User'}`}
                                />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton
                                component={RouterLink}
                                to="/profile"
                                sx={{ textAlign: 'center' }}
                            >
                                <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                                    <Avatar sx={{ width: 24, height: 24 }} />
                                </ListItemIcon>
                                <ListItemText primary="Profile" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={handleLogout}
                                sx={{ textAlign: 'center' }}
                            >
                                <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                                    <LogoutIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                    </>
                ) : (
                    <ListItem disablePadding>
                        <ListItemButton
                            component={RouterLink}
                            to="/login"
                            sx={{ textAlign: 'center' }}
                        >
                            <ListItemText primary="Login" />
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
        </Box>
    );

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            {/* Header */}
            <AppBar
                position="static"
                color="default"
                elevation={1}
                sx={{ backgroundColor: 'background.paper' }}
            >
                <Container maxWidth="lg">
                    <Toolbar
                        disableGutters
                        sx={{ justifyContent: 'space-between' }}
                    >
                        {/* Logo */}
                        <Typography
                            variant="h6"
                            component={RouterLink}
                            to="/"
                            sx={{
                                textDecoration: 'none',
                                color: 'text.primary',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Box
                                component="img"
                                src="/src/assets/time-capsule-hero.svg"
                                alt="Time Capsule Logo"
                                sx={{
                                    height: 32,
                                    width: 'auto',
                                    mr: 1,
                                    display: { xs: 'none', sm: 'block' },
                                }}
                            />
                            Time Capsule
                        </Typography>

                        {/* Navigation - Desktop */}
                        {!isMobile && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {navItems.map((item) => (
                                    <Button
                                        key={item.text}
                                        component={RouterLink}
                                        to={item.path}
                                        sx={{ mx: 1 }}
                                    >
                                        {item.text}
                                    </Button>
                                ))}

                                {isAuthenticated ? (
                                    <>
                                        <Tooltip title="Account settings">
                                            <IconButton
                                                onClick={handleOpenAccountMenu}
                                                size="small"
                                                sx={{ ml: 2 }}
                                                aria-controls={
                                                    open
                                                        ? 'account-menu'
                                                        : undefined
                                                }
                                                aria-haspopup="true"
                                                aria-expanded={
                                                    open ? 'true' : undefined
                                                }
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        bgcolor: 'primary.main',
                                                    }}
                                                >
                                                    {user?.name?.charAt(0) ||
                                                        'U'}
                                                </Avatar>
                                            </IconButton>
                                        </Tooltip>
                                        <Menu
                                            anchorEl={anchorEl}
                                            id="account-menu"
                                            open={open}
                                            onClose={handleCloseAccountMenu}
                                            onClick={handleCloseAccountMenu}
                                            PaperProps={{
                                                elevation: 0,
                                                sx: {
                                                    overflow: 'visible',
                                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                                    mt: 1.5,
                                                    '& .MuiAvatar-root': {
                                                        width: 32,
                                                        height: 32,
                                                        ml: -0.5,
                                                        mr: 1,
                                                    },
                                                },
                                            }}
                                            transformOrigin={{
                                                horizontal: 'right',
                                                vertical: 'top',
                                            }}
                                            anchorOrigin={{
                                                horizontal: 'right',
                                                vertical: 'bottom',
                                            }}
                                        >
                                            <MenuItem
                                                component={RouterLink}
                                                to="/profile"
                                            >
                                                <Avatar /> Profile
                                            </MenuItem>
                                            <MenuItem onClick={handleLogout}>
                                                <ListItemIcon>
                                                    <LogoutIcon fontSize="small" />
                                                </ListItemIcon>
                                                Logout
                                            </MenuItem>
                                        </Menu>
                                    </>
                                ) : (
                                    <Button
                                        component={RouterLink}
                                        to="/login"
                                        variant="outlined"
                                        sx={{ ml: 2 }}
                                    >
                                        Login
                                    </Button>
                                )}
                            </Box>
                        )}

                        {/* Mobile menu button */}
                        {isMobile && (
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="end"
                                onClick={handleDrawerToggle}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 240,
                    },
                }}
            >
                {drawer}
            </Drawer>

            {/* Main content */}
            <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
                <Outlet />
            </Box>

            {/* Simplified Footer */}
            <Box
                component="footer"
                sx={{
                    py: 2,
                    mt: 'auto',
                    backgroundColor: theme.palette.grey[100],
                    borderTop: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                    >
                        © {new Date().getFullYear()} Decentralized Time Capsule
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
}
</file>

<file path="Hackathon-2025-main/frontend/src/components/ui/CountdownTimer.tsx">
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Box, Paper, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';

type TimeUnitProps = {
    value: number;
    label: string;
};

function TimeUnit(props: TimeUnitProps) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 1,
                minWidth: 60,
                textAlign: 'center',
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                borderRadius: 1,
            }}
        >
            <Typography variant="h5" fontWeight="bold">
                {props.value.toString().padStart(2, '0')}
            </Typography>
            <Typography variant="caption">{props.label}</Typography>
        </Paper>
    );
}

export function CountdownTimer(props: {
    years?: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    title?: string;
    onComplete?: () => void;
}) {
    // Ref to track if onComplete has been called
    const hasCompletedRef = useRef(false);

    useEffect(() => {
        // Check if countdown has reached zero and onComplete callback exists
        if (
            props.onComplete &&
            (!props.years || props.years === 0) &&
            props.days === 0 &&
            props.hours === 0 &&
            props.minutes === 0 &&
            props.seconds === 0 &&
            !hasCompletedRef.current
        ) {
            // Set ref to prevent multiple calls
            hasCompletedRef.current = true;

            // Call the callback
            props.onComplete();
        }

        // Reset the ref if countdown has values again (in case it gets reused)
        if (
            (props.years && props.years > 0) ||
            props.days > 0 ||
            props.hours > 0 ||
            props.minutes > 0 ||
            (props.seconds > 0 && hasCompletedRef.current)
        ) {
            hasCompletedRef.current = false;
        }
    }, [props]);

    return (
        <Box sx={{ mt: 2 }}>
            {props.title && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTimeIcon sx={{ mr: 1, fontSize: 20 }} />
                    <Typography variant="subtitle2" fontWeight="medium">
                        {props.title}
                    </Typography>
                </Box>
            )}

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {props.years !== undefined && (
                    <TimeUnit value={props.years} label="YEARS" />
                )}
                <TimeUnit value={props.days} label="DAYS" />
                <TimeUnit value={props.hours} label="HOURS" />
                <TimeUnit value={props.minutes} label="MINS" />
                <TimeUnit value={props.seconds} label="SECS" />
            </Box>
        </Box>
    );
}
</file>

<file path="Hackathon-2025-main/frontend/src/components/ui/FileUpload.tsx">
import {
    Clear as ClearIcon,
    CloudUpload as CloudUploadIcon,
    InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    IconButton,
    LinearProgress,
    Paper,
    Typography,
} from '@mui/material';
import React, { useCallback, useState } from 'react';

interface FileUploadProps {
    onFileSelect: (fileData: {
        fileData: string;
        fileName: string;
        fileType: string;
    }) => void;
    maxSizeMB?: number;
    acceptedTypes?: string[];
}

export const FileUpload: React.FC<FileUploadProps> = ({
    onFileSelect,
    maxSizeMB = 10, // Default 10MB max size
    acceptedTypes = ['image/*', 'application/pdf', 'text/*'],
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const validateFile = (file: File): boolean => {
        setError(null);

        // Check file size
        if (file.size > maxSizeBytes) {
            setError(`File size exceeds the ${maxSizeMB}MB limit`);
            return false;
        }

        // Check file type
        const isValidType = acceptedTypes.some((type) => {
            if (type.includes('*')) {
                const category = type.split('/')[0];
                return file.type.startsWith(category);
            }
            return file.type === type;
        });

        if (!isValidType) {
            setError(
                `File type not allowed. Accepted types: ${acceptedTypes.join(
                    ', '
                )}`
            );
            return false;
        }

        return true;
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result as string;
                // Remove the data:image/jpeg;base64, prefix
                const base64Data = base64String.split(',')[1];
                resolve(base64Data);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFile = async (file: File) => {
        if (validateFile(file)) {
            setFile(file);
            setIsLoading(true);
            try {
                const base64Data = await convertToBase64(file);
                onFileSelect({
                    fileData: base64Data,
                    fileName: file.name,
                    fileType: file.type,
                });
                setIsLoading(false);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
                setError('Error converting file to base64');
                setIsLoading(false);
            }
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);
        },
        []
    );

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };

    const clearFile = () => {
        setFile(null);
        onFileSelect({
            fileData: '',
            fileName: '',
            fileType: '',
        });
    };

    return (
        <Box sx={{ width: '100%' }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {!file ? (
                <Paper
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    sx={{
                        border: isDragging
                            ? '2px dashed #3f51b5'
                            : '2px dashed #ccc',
                        borderRadius: 2,
                        p: 3,
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: isDragging
                            ? 'rgba(63, 81, 181, 0.1)'
                            : 'transparent',
                        transition: 'all 0.3s ease',
                    }}
                >
                    <input
                        type="file"
                        id="file-upload"
                        onChange={handleFileInput}
                        style={{ display: 'none' }}
                        accept={acceptedTypes.join(',')}
                    />
                    <CloudUploadIcon
                        sx={{ fontSize: 48, color: 'primary.main', mb: 1 }}
                    />
                    <Typography variant="h6" gutterBottom>
                        Drag and drop file here
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mb: 2 }}
                    >
                        or
                    </Typography>
                    <Button
                        variant="contained"
                        component="label"
                        htmlFor="file-upload"
                    >
                        Browse Files
                    </Button>
                    <Typography
                        variant="caption"
                        display="block"
                        sx={{ mt: 2, color: 'text.secondary' }}
                    >
                        Maximum size: {maxSizeMB}MB
                    </Typography>
                    <Typography
                        variant="caption"
                        display="block"
                        sx={{ color: 'text.secondary' }}
                    >
                        Accepted types: {acceptedTypes.join(', ')}
                    </Typography>
                </Paper>
            ) : (
                <Paper sx={{ p: 2, position: 'relative' }}>
                    {isLoading && (
                        <LinearProgress
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                            }}
                        />
                    )}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FileIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Box>
                                <Typography variant="body1">
                                    {file.name}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="textSecondary"
                                >
                                    {(file.size / 1024).toFixed(1)} KB
                                </Typography>
                            </Box>
                        </Box>
                        <IconButton onClick={clearFile} size="small">
                            <ClearIcon />
                        </IconButton>
                    </Box>
                </Paper>
            )}
        </Box>
    );
};
</file>

<file path="Hackathon-2025-main/frontend/src/components/ui/MarkdownViewer.tsx">
import { Paper, PaperProps } from '@mui/material';
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownViewerProps extends PaperProps {
    markdown: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
    markdown,
    sx,
    ...paperProps
}) => {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: 3,
                bgcolor: 'background.paper',
                '& img': { maxWidth: '100%' },
                '& pre': {
                    overflowX: 'auto',
                    backgroundColor: 'rgba(0,0,0,0.04)',
                    padding: 1,
                    borderRadius: 1,
                },
                '& code': {
                    fontFamily: 'monospace',
                    backgroundColor: 'rgba(0,0,0,0.04)',
                    padding: '2px 4px',
                    borderRadius: 1,
                },
                '& a': {
                    color: 'primary.main',
                },
                ...sx,
            }}
            {...paperProps}
        >
            <ReactMarkdown>{markdown}</ReactMarkdown>
        </Paper>
    );
};
</file>

<file path="Hackathon-2025-main/frontend/src/hooks/useAiAnalysis.ts">
import { useMutation } from '@tanstack/react-query';
import { aiApi } from '../api/aiApi';

export function useAiAnalysis() {
    const analyzeContentMutation = useMutation({
        mutationFn: (content: string) => aiApi.analyzeContent(content),
    });

    return {
        analyzeContent: analyzeContentMutation.mutate,
        isAnalyzing: analyzeContentMutation.isPending,
        analysisResult: analyzeContentMutation.data,
        analysisError: analyzeContentMutation.error,
        reset: analyzeContentMutation.reset,
    };
}
</file>

<file path="Hackathon-2025-main/frontend/src/hooks/useAuth.ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { authApi } from '../api/authApi';
import { LoginUserType, RegisterUserType } from '../schemas/authSchemas';
import {
    authErrorAtom,
    authLoadingAtom,
    isAuthenticatedAtom,
    logoutActionAtom,
    setAuthErrorAtom,
    setUserAtom,
    userAtom,
} from '../store/userAtoms';

export function useAuth() {
    // Access atoms
    const user = useAtomValue(userAtom);
    const isAuthenticated = useAtomValue(isAuthenticatedAtom);
    const isLoading = useAtomValue(authLoadingAtom);
    const error = useAtomValue(authErrorAtom);
    const setUser = useSetAtom(setUserAtom);
    const setAuthError = useSetAtom(setAuthErrorAtom);
    const logout = useSetAtom(logoutActionAtom);

    // Access query client
    const queryClient = useQueryClient();

    // Check current user on initial load
    const {
        data: userData,
        refetch: refetchUser,
        isError: userQueryError,
    } = useQuery({
        queryKey: ['currentUser'],
        queryFn: authApi.getCurrentUser,
        enabled: false, // We'll call this manually
        retry: false,
    });

    // Handle the query results with useEffect
    useEffect(() => {
        if (userData) {
            setUser(userData);
        } else if (userQueryError) {
            setUser(null);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData]);

    // Initialize auth state on mount if token exists
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token && !isAuthenticated && isLoading) {
            refetchUser();
        } else if (!token) {
            setUser(null);
        }
    }, [isAuthenticated, isLoading, refetchUser, setUser]);

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: authApi.loginUser,
        onSuccess: (data) => {
            console.log('Login successful:', data);
            setUser(data.user);
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        },
        onError: (err: Error) => {
            setAuthError(
                err.message || 'Login failed. Please check your credentials.'
            );
            logout();
        },
    });

    // Register mutation
    const registerMutation = useMutation({
        mutationFn: authApi.registerUser,
        onSuccess: (data) => {
            console.log('Registration successful:', data);
            setUser(data.user);
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        },
        onError: (err: Error) => {
            setAuthError(
                err.message || 'Registration failed. Please try again.'
            );
        },
    });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: authApi.logoutUser,
        onSettled: () => {
            logout();
            queryClient.invalidateQueries();
        },
    });

    // Helper functions
    const loginUser = async (credentials: LoginUserType) => {
        return loginMutation.mutateAsync(credentials);
    };

    const registerUser = async (userData: RegisterUserType) => {
        return registerMutation.mutateAsync(userData);
    };

    const logoutUser = async () => {
        return logoutMutation.mutateAsync();
    };

    return {
        user,
        isAuthenticated,
        isLoading,
        error,
        loginUser,
        registerUser,
        logoutUser,
        refreshUser: refetchUser,
        loginStatus: loginMutation.status,
        registerStatus: registerMutation.status,
        logoutStatus: logoutMutation.status,
    };
}
</file>

<file path="Hackathon-2025-main/frontend/src/hooks/useCapsules.ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { capsuleApi } from '../api/capsuleApi';
import {
    CapsuleType,
    CreateCapsuleType,
    UserCapsulesType,
} from '../schemas/capsuleSchemas';

export const useCapsules = () => {
    const queryClient = useQueryClient();

    /**
     * Hook for creating a new capsule
     * Returns mutation object with mutate function, loading and error states
     * Now supports both text and file content types
     */
    const useCreateCapsule = () => {
        return useMutation({
            mutationFn: (capsuleData: CreateCapsuleType) =>
                capsuleApi.createCapsule(capsuleData),
            onSuccess: () => {
                // Invalidate the user capsules query to refresh the list
                queryClient.invalidateQueries({ queryKey: ['userCapsules'] });
            },
        });
    };

    /**
     * Hook to fetch all capsules for the current user
     */
    const useUserCapsules = () => {
        return useQuery<UserCapsulesType>({
            queryKey: ['userCapsules'],
            queryFn: capsuleApi.getUserCapsules,
        });
    };

    /**
     * Hook to fetch a specific capsule by ID
     */
    const useCapsule = (capsuleId: string | undefined) => {
        return useQuery<CapsuleType>({
            queryKey: ['capsule', capsuleId],
            queryFn: () =>
                capsuleId
                    ? capsuleApi.getCapsule(capsuleId)
                    : Promise.reject('No capsule ID'),
            enabled: !!capsuleId, // Only run the query if we have a capsule ID
        });
    };

    /**
     * Hook for deleting a capsule
     */
    const useDeleteCapsule = () => {
        return useMutation({
            mutationFn: (capsuleId: string) =>
                capsuleApi.deleteCapsule(capsuleId),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['userCapsules'] });
            },
        });
    };

    return {
        useCreateCapsule,
        useUserCapsules,
        useCapsule,
        useDeleteCapsule,
    };
};
</file>

<file path="Hackathon-2025-main/frontend/src/hooks/useCountdown.ts">
import { useEffect, useState } from 'react';

type TimeLeft = {
    years: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

export function useCountdown(targetDate: Date | null): TimeLeft {
    const calculateTimeLeft = (): TimeLeft => {
        if (!targetDate) {
            return { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        const now = new Date();
        const difference = targetDate.getTime() - now.getTime();

        if (difference <= 0) {
            return { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        // Simple calculation approach to avoid edge cases with date manipulations
        const millisecondsPerSecond = 1000;
        const millisecondsPerMinute = millisecondsPerSecond * 60;
        const millisecondsPerHour = millisecondsPerMinute * 60;
        const millisecondsPerDay = millisecondsPerHour * 24;
        const millisecondsPerYear = millisecondsPerDay * 365; // Approximation

        // Calculate years (approximate)
        const years = Math.floor(difference / millisecondsPerYear);
        const remainingAfterYears = difference % millisecondsPerYear;

        // Calculate remaining components
        const days = Math.floor(remainingAfterYears / millisecondsPerDay);
        const hours = Math.floor(
            (remainingAfterYears % millisecondsPerDay) / millisecondsPerHour
        );
        const minutes = Math.floor(
            (remainingAfterYears % millisecondsPerHour) / millisecondsPerMinute
        );
        const seconds = Math.floor(
            (remainingAfterYears % millisecondsPerMinute) /
                millisecondsPerSecond
        );

        // Ensure all values are non-negative (defensive programming)
        return {
            years: Math.max(0, years),
            days: Math.max(0, days),
            hours: Math.max(0, hours),
            minutes: Math.max(0, minutes),
            seconds: Math.max(0, seconds),
        };
    };

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

    useEffect(() => {
        if (!targetDate) return;

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetDate]);

    return timeLeft;
}
</file>

<file path="Hackathon-2025-main/frontend/src/pages/CapsulePage.tsx">
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import LockClockIcon from '@mui/icons-material/LockClock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Paper,
    Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { CountdownTimer } from '../components/ui/CountdownTimer';
import { MarkdownViewer } from '../components/ui/MarkdownViewer';
import { useAiAnalysis } from '../hooks/useAiAnalysis';
import { useCapsules } from '../hooks/useCapsules';
import { useCountdown } from '../hooks/useCountdown';

export function CapsulePage() {
    const { capsuleId } = useParams<{ capsuleId: string }>();
    const { useCapsule } = useCapsules();
    const {
        data: capsule,
        isLoading,
        isError,
        error,
        refetch,
    } = useCapsule(capsuleId);

    const { analyzeContent, isAnalyzing, analysisResult, analysisError } =
        useAiAnalysis();

    const unlockDate =
        capsule && !capsule.isUnlocked ? new Date(capsule.unlockDate) : null;
    const countdown = useCountdown(unlockDate);

    const handleCountdownComplete = () => {
        console.log('Capsule countdown completed - refreshing capsule data');
        refetch();
    };

    const handleAiAnalysis = () => {
        if (capsule && capsule.content?.contentType === 'text') {
            analyzeContent(capsule.content.textContent);
        }
    };

    console.log('Capsule data:', capsule);

    const downloadFile = () => {
        if (
            !capsule ||
            !capsule.content ||
            capsule.content.contentType !== 'file'
        )
            return;

        const { fileData, fileName, fileType } = capsule.content;

        const binaryString = atob(fileData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], {
            type: fileType,
        });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(date).toLocaleDateString('en-US', options);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                Error loading capsule: {error?.message || 'Unknown error'}
            </Alert>
        );
    }

    if (!capsule) {
        return (
            <Alert severity="warning" sx={{ m: 2 }}>
                Capsule not found
            </Alert>
        );
    }

    const creationDate = formatDate(capsule.creationDate);
    const unlockDateFormatted = formatDate(capsule.unlockDate);
    const isUnlocked = capsule.isUnlocked;

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 2,
                    }}
                >
                    <Typography variant="h4" component="h1">
                        {capsule.title}
                    </Typography>
                    <Chip
                        icon={isUnlocked ? <LockOpenIcon /> : <LockClockIcon />}
                        label={isUnlocked ? 'Unlocked' : 'Locked'}
                        color={isUnlocked ? 'success' : 'primary'}
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                    <Chip
                        icon={<CalendarTodayIcon />}
                        label={`Created on: ${creationDate}`}
                        variant="outlined"
                    />
                    <Chip
                        icon={isUnlocked ? <LockOpenIcon /> : <LockClockIcon />}
                        label={
                            isUnlocked
                                ? `Unlocked on: ${unlockDateFormatted}`
                                : `Unlocks on: ${unlockDateFormatted}`
                        }
                        variant="outlined"
                        color={isUnlocked ? 'success' : 'primary'}
                    />
                </Box>

                {capsule.description && (
                    <Box sx={{ mb: 3 }}>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ whiteSpace: 'pre-wrap' }}
                        >
                            {capsule.description}
                        </Typography>
                    </Box>
                )}

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" component="h2" gutterBottom>
                    Capsule Content
                </Typography>

                {!isUnlocked ? (
                    <Card
                        sx={{
                            bgcolor: 'action.hover',
                            mb: 2,
                            background:
                                'linear-gradient(135deg, #8e2de2, #4a00e0)',
                            color: 'white',
                        }}
                    >
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    flexDirection: 'column',
                                }}
                            >
                                {countdown && (
                                    <CountdownTimer
                                        years={countdown.years}
                                        days={countdown.days}
                                        hours={countdown.hours}
                                        minutes={countdown.minutes}
                                        seconds={countdown.seconds}
                                        title="Time remaining until unlock:"
                                        onComplete={handleCountdownComplete}
                                    />
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                ) : (
                    <Box sx={{ mt: 2 }}>
                        {capsule.content!.contentType === 'text' ? (
                            <>
                                <Paper
                                    variant="outlined"
                                    sx={{ p: 3, bgcolor: 'background.paper' }}
                                >
                                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                        {capsule.content!.textContent}
                                    </Typography>
                                </Paper>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        mt: 2,
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        startIcon={
                                            isAnalyzing ? (
                                                <CircularProgress size={20} />
                                            ) : (
                                                <SmartToyIcon />
                                            )
                                        }
                                        onClick={handleAiAnalysis}
                                        disabled={isAnalyzing}
                                    >
                                        {isAnalyzing
                                            ? 'Analyzing...'
                                            : 'Ask AI for Context'}
                                    </Button>
                                </Box>

                                {analysisResult && (
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 3,
                                            mt: 2,
                                            bgcolor: 'background.paper',
                                            borderLeft: 4,
                                            borderColor: 'primary.main',
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                            gutterBottom
                                        >
                                            AI Analysis:
                                        </Typography>
                                        <MarkdownViewer
                                            markdown={analysisResult}
                                            sx={{
                                                border: 'none',
                                                p: 0,
                                                '& p:first-of-type': { mt: 0 },
                                            }}
                                        />
                                    </Paper>
                                )}

                                {analysisError && (
                                    <Alert severity="error" sx={{ mt: 2 }}>
                                        Error getting AI analysis:{' '}
                                        {analysisError instanceof Error
                                            ? analysisError.message
                                            : 'Unknown error'}
                                    </Alert>
                                )}
                            </>
                        ) : capsule.content!.contentType === 'file' ? (
                            <Card sx={{ mb: 2 }}>
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Typography>
                                            File: {capsule.content!.fileName} (
                                            {capsule.content!.fileType})
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            startIcon={<FileDownloadIcon />}
                                            onClick={downloadFile}
                                        >
                                            Download
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        ) : (
                            <Alert severity="warning">
                                Unknown content type
                            </Alert>
                        )}
                    </Box>
                )}

                {capsule.recipients && capsule.recipients.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Recipients:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {capsule.recipients.map((email, index) => (
                                <Chip key={index} label={email} size="small" />
                            ))}
                        </Box>
                    </Box>
                )}
            </Paper>
        </Box>
    );
}
</file>

<file path="Hackathon-2025-main/frontend/src/pages/CreateCapsulePage.tsx">
import { zodResolver } from '@hookform/resolvers/zod';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    Chip,
    Container,
    FormControl,
    FormControlLabel,
    InputAdornment,
    Paper,
    Radio,
    RadioGroup,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FileUpload } from '../components/ui/FileUpload';
import { useCapsules } from '../hooks/useCapsules';
import {
    CreateCapsuleSchema,
    CreateCapsuleType,
} from '../schemas/capsuleSchemas';
import dayjs from 'dayjs';

export function CreateCapsulePage() {
    const navigate = useNavigate();
    const { useCreateCapsule } = useCapsules();
    const {
        mutate: createCapsule,
        isPending,
        isError,
        error,
        isSuccess,
    } = useCreateCapsule();
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [contentType, setContentType] = React.useState<'text' | 'file'>(
        'text'
    );

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
        reset,
    } = useForm<CreateCapsuleType>({
        resolver: zodResolver(CreateCapsuleSchema),
        defaultValues: {
            title: '',
            description: '',
            content: {
                contentType: 'text',
                textContent: '',
            },
            unlockDate: new Date(),
            isPrivate: false,
            recipients: [],
        },
    });

    // Watch the isPrivate value to conditionally render the recipients section
    const isPrivate = watch('isPrivate');
    const [recipientEmail, setRecipientEmail] = React.useState('');
    const [recipients, setRecipients] = React.useState<string[]>([]);

    // For the DateTimePicker, to properly handle date validation
    const today = new Date();

    // Handle success response
    React.useEffect(() => {
        if (isSuccess) {
            setOpenSnackbar(true);
            reset();
            setRecipients([]);
            setContentType('text');

            // Optional: Navigate to a success page or capsules list
            setTimeout(() => {
                navigate('/my-capsules');
            }, 2000);
        }
    }, [isSuccess, navigate, reset]);

    // Handle content type change
    const handleContentTypeChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newType = event.target.value as 'text' | 'file';
        setContentType(newType);

        if (newType === 'text') {
            setValue('content', { contentType: 'text', textContent: '' });
        } else {
            setValue('content', {
                contentType: 'file',
                fileData: '',
                fileName: '',
                fileType: '',
            });
        }
    };

    // Handle file upload
    const handleFileSelect = (fileData: {
        fileData: string;
        fileName: string;
        fileType: string;
    }) => {
        setValue(
            'content',
            {
                contentType: 'file',
                ...fileData,
            },
            { shouldValidate: true }
        );
    };

    const addRecipient = () => {
        if (!recipientEmail.trim()) return;

        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(recipientEmail)) return;

        setRecipients([...recipients, recipientEmail]);
        setRecipientEmail('');
    };

    const removeRecipient = (email: string) => {
        setRecipients(recipients.filter((r) => r !== email));
    };

    const onSubmit = (data: CreateCapsuleType) => {
        // Include the recipients in the form data
        const capsuleData = {
            ...data,
            recipients: isPrivate ? recipients : [],
        };

        // Call the mutation function
        createCapsule(capsuleData);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Create Time Capsule
                </Typography>

                {isError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        Error creating capsule:{' '}
                        {error instanceof Error
                            ? error.message
                            : 'Unknown error'}
                    </Alert>
                )}

                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ mt: 3 }}
                >
                    <Stack spacing={3}>
                        <TextField
                            id="title"
                            label="Title"
                            fullWidth
                            placeholder="Give your time capsule a name"
                            error={!!errors.title}
                            helperText={errors.title?.message}
                            {...register('title')}
                        />

                        <TextField
                            id="description"
                            label="Description (optional)"
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Describe what's in your time capsule"
                            {...register('description')}
                        />

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Content Type
                            </Typography>
                            <Controller
                                name="content.contentType"
                                control={control}
                                render={({ field }) => (
                                    <RadioGroup
                                        row
                                        {...field}
                                        onChange={handleContentTypeChange}
                                        value={contentType}
                                    >
                                        <FormControlLabel
                                            value="text"
                                            control={<Radio />}
                                            label="Text"
                                        />
                                        <FormControlLabel
                                            value="file"
                                            control={<Radio />}
                                            label="File"
                                        />
                                    </RadioGroup>
                                )}
                            />
                        </Box>

                        {contentType === 'text' ? (
                            <Controller
                                name="content.textContent"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        id="textContent"
                                        label="Text Content"
                                        fullWidth
                                        multiline
                                        rows={6}
                                        placeholder="What do you want to preserve for the future?"
                                        {...field}
                                    />
                                )}
                            />
                        ) : (
                            <Box>
                                <Typography variant="subtitle1" gutterBottom>
                                    Upload File
                                </Typography>
                                <FileUpload onFileSelect={handleFileSelect} />
                            </Box>
                        )}

                        <Controller
                            name="unlockDate"
                            control={control}
                            render={({ field, fieldState }) => (
                                <DateTimePicker
                                    label="Unlock Date"
                                    value={field.value ? dayjs(field.value) : null}
                                        onChange={(newValue) => {
                                        field.onChange(newValue ? newValue.toDate() : null);
                                    }}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            variant: 'outlined',
                                            error: !!fieldState.error,
                                            helperText:
                                                fieldState.error?.message ||
                                                'Select when the time capsule should be unlocked',
                                        },
                                    }}
                                    minDateTime={dayjs(today).add(1, 'minute')}
                                    format="YYYY-MM-DD HH:mm"
                                    disablePast={true}
                                    ampm={false}
                                />
                            )}
                        />

                        <FormControl>
                            <FormControlLabel
                                control={
                                    <Controller
                                        name="isPrivate"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox
                                                {...field}
                                                checked={field.value}
                                            />
                                        )}
                                    />
                                }
                                label="Make this capsule private (only accessible to specific recipients)"
                            />
                        </FormControl>

                        {isPrivate && (
                            <Box>
                                <Typography variant="subtitle1" gutterBottom>
                                    Recipients (optional)
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="email"
                                    label="Email Address"
                                    value={recipientEmail}
                                    onChange={(e) =>
                                        setRecipientEmail(e.target.value)
                                    }
                                    placeholder="Enter email address"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={addRecipient}
                                                    startIcon={<AddIcon />}
                                                >
                                                    Add
                                                </Button>
                                            </InputAdornment>
                                        ),
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addRecipient();
                                        }
                                    }}
                                />

                                {recipients.length > 0 && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{ mb: 1 }}
                                        >
                                            Recipients:
                                        </Typography>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            flexWrap="wrap"
                                            useFlexGap
                                        >
                                            {recipients.map((email) => (
                                                <Chip
                                                    key={email}
                                                    label={email}
                                                    onDelete={() =>
                                                        removeRecipient(email)
                                                    }
                                                    deleteIcon={<CloseIcon />}
                                                    sx={{ mb: 1 }}
                                                />
                                            ))}
                                        </Stack>
                                    </Box>
                                )}
                            </Box>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            disabled={isPending}
                            fullWidth
                        >
                            {isPending ? 'Creating...' : 'Create Time Capsule'}
                        </Button>
                    </Stack>
                </Box>
            </Paper>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="success">
                    Time capsule created successfully!
                </Alert>
            </Snackbar>
        </Container>
    );
}
</file>

<file path="Hackathon-2025-main/frontend/src/pages/HomePage.tsx">
import CloudIcon from '@mui/icons-material/Cloud';
import LockClockIcon from '@mui/icons-material/LockClock';
import SecurityIcon from '@mui/icons-material/Security';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function HomePage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { isAuthenticated } = useAuth();

    const features = [
        {
            icon: <LockClockIcon fontSize="large" color="primary" />,
            title: 'Time-Locked Encryption',
            description:
                'Set a future date when your digital memories can be accessed. Until then, they remain securely encrypted.',
        },
        {
            icon: <SecurityIcon fontSize="large" color="primary" />,
            title: 'Military-Grade Security',
            description:
                'Using AES-256 encryption, your content is protected with the same technology trusted by security professionals.',
        },
        {
            icon: <CloudIcon fontSize="large" color="primary" />,
            title: 'Decentralized Storage',
            description:
                "Your capsules are stored on IPFS, ensuring they'll remain accessible long into the future.",
        },
    ];

    return (
        <>
            {/* Hero Section */}
            <Box
                sx={{
                    background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    color: 'white',
                    py: 10,
                    mb: 6,
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={3} alignItems="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography
                                variant="h2"
                                component="h1"
                                gutterBottom
                                fontWeight="bold"
                            >
                                Digital Time Capsules
                            </Typography>
                            <Typography variant="h5" paragraph>
                                Preserve your memories, messages, and media for
                                future discovery.
                            </Typography>
                            <Box mt={4}>
                                <Button
                                    component={RouterLink}
                                    to={
                                        isAuthenticated
                                            ? '/capsules/create'
                                            : '/login'
                                    }
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        mr: 2,
                                        backgroundColor: 'white',
                                        color: theme.palette.primary.main,
                                        '&:hover': {
                                            backgroundColor:
                                                'rgba(255,255,255,0.9)',
                                        },
                                    }}
                                >
                                    Create a Capsule
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to={
                                        isAuthenticated
                                            ? '/my-capsules'
                                            : '/login'
                                    }
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        borderColor: 'white',
                                        color: 'white',
                                        '&:hover': {
                                            borderColor:
                                                'rgba(255,255,255,0.9)',
                                            backgroundColor:
                                                'rgba(255,255,255,0.1)',
                                        },
                                    }}
                                >
                                    My Capsules
                                </Button>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box
                                component="img"
                                src="/src/assets/time-capsule-hero.svg"
                                alt="Digital Time Capsule Illustration"
                                sx={{
                                    width: '100%',
                                    maxWidth: 500,
                                    height: 'auto',
                                    display: { xs: 'none', md: 'block' },
                                    margin: '0 auto',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ mb: 8 }}>
                <Typography
                    variant="h3"
                    component="h2"
                    align="center"
                    gutterBottom
                >
                    Features
                </Typography>
                <Typography
                    variant="h6"
                    align="center"
                    color="textSecondary"
                    paragraph
                    sx={{ mb: 6 }}
                >
                    Our platform offers powerful tools to create meaningful time
                    capsules
                </Typography>

                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid size={{ xs: 12, md: 4 }} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: theme.shadows[8],
                                    },
                                }}
                            >
                                <CardContent
                                    sx={{ flexGrow: 1, textAlign: 'center' }}
                                >
                                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                                    <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="h3"
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* How It Works Section */}
            <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        component="h2"
                        align="center"
                        gutterBottom
                    >
                        How It Works
                    </Typography>
                    <Typography
                        variant="h6"
                        align="center"
                        color="textSecondary"
                        paragraph
                        sx={{ mb: 6 }}
                    >
                        Create your own time capsule in just a few simple steps
                    </Typography>

                    <Grid container spacing={isMobile ? 4 : 8}>
                        {[
                            {
                                number: '01',
                                title: 'Create',
                                description:
                                    'Upload photos, videos, messages, or any digital content to your capsule.',
                            },
                            {
                                number: '02',
                                title: 'Encrypt',
                                description:
                                    'Your content is securely encrypted with AES-256 and stored on IPFS.',
                            },
                            {
                                number: '03',
                                title: 'Set Timer',
                                description:
                                    'Choose when your capsule can be opened - days, months, or years from now.',
                            },
                            {
                                number: '04',
                                title: 'Share',
                                description:
                                    'Optionally share access with friends or family for a future surprise.',
                            },
                        ].map((step, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                                <Box sx={{ textAlign: 'center', mb: 2 }}>
                                    <Typography
                                        variant="h2"
                                        component="div"
                                        color="primary"
                                        fontWeight="bold"
                                    >
                                        {step.number}
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="h5"
                                    component="h3"
                                    gutterBottom
                                    fontWeight="medium"
                                    align="center"
                                >
                                    {step.title}
                                </Typography>
                                <Typography
                                    color="textSecondary"
                                    align="center"
                                >
                                    {step.description}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ textAlign: 'center', mt: 6 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            component={RouterLink}
                            to={
                                isAuthenticated
                                    ? '/capsules/create'
                                    : '/register'
                            }
                        >
                            Get Started
                        </Button>
                    </Box>
                </Container>
            </Box>
        </>
    );
}
</file>

<file path="Hackathon-2025-main/frontend/src/pages/LoginPage.tsx">
import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginUserSchema, LoginUserType } from '../schemas/authSchemas';

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { loginUser, error, loginStatus, isAuthenticated } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginUserType>({
        resolver: zodResolver(LoginUserSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginUserType) => {
        try {
            console.log('Login data:', data); // Log the data being sent
            await loginUser(data);
            navigate('/');
        } catch (error) {
            // Error is handled by the useAuth hook
            console.error('Login failed', error);
        }
    };

    const toggleShowPassword = () => setShowPassword((prev) => !prev);

    const isLoading = loginStatus === 'pending';

    // Get the intended destination from location state, or default to homepage
    const from = location.state?.from?.pathname || '/';

    // Redirect to intended destination if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Card elevation={3}>
                <CardContent sx={{ p: 4 }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        textAlign="center"
                    >
                        Login
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                    >
                        <Stack spacing={3}>
                            <TextField
                                label="Email Address"
                                fullWidth
                                autoComplete="email"
                                autoFocus
                                {...register('email')}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                disabled={isLoading}
                            />

                            <TextField
                                label="Password"
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                {...register('password')}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                disabled={isLoading}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={toggleShowPassword}
                                                edge="end"
                                                aria-label={
                                                    showPassword
                                                        ? 'hide password'
                                                        : 'show password'
                                                }
                                            >
                                                {showPassword ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                loading={isLoading}
                            >
                                Log In
                            </Button>

                            <Box sx={{ textAlign: 'center' }}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Don't have an account?{' '}
                                    <Button
                                        component={Link}
                                        to="/register"
                                        color="primary"
                                    >
                                        Register
                                    </Button>
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}
</file>

<file path="Hackathon-2025-main/frontend/src/pages/MyCapsules.tsx">
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import LockClockIcon from '@mui/icons-material/LockClock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {
    Box,
    Card,
    CircularProgress,
    Container,
    Grid,
    Paper,
    Tab,
    Tabs,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { CapsuleCard } from '../components/capsules/CapsuleCard';
import { CountdownTimer } from '../components/ui/CountdownTimer';
import { useCapsules } from '../hooks/useCapsules';
import { useCountdown } from '../hooks/useCountdown';

// TabPanel component to handle tab content
function TabPanel(props: {
    children: React.ReactNode;
    value: number;
    index: number;
}) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`capsule-tabpanel-${index}`}
            aria-labelledby={`capsule-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

export function MyCapsules() {
    const [tabValue, setTabValue] = useState(0);
    const { useUserCapsules } = useCapsules();
    const { data: userCapsules, isLoading, error, refetch } = useUserCapsules();

    console.log('userCapsules', userCapsules);

    // Handle tab change
    const handleTabChange = (
        _event: React.SyntheticEvent,
        newValue: number
    ) => {
        setTabValue(newValue);
    };

    // Filter capsules by locked/unlocked status
    const unlockedCapsules =
        userCapsules?.filter((capsule) => capsule.isUnlocked) || [];
    const lockedCapsules =
        userCapsules?.filter((capsule) => !capsule.isUnlocked) || [];

    // Calculate statistics
    const totalCapsules = userCapsules?.length || 0;
    const totalUnlocked = unlockedCapsules.length;
    const totalLocked = lockedCapsules.length;

    // Find the next capsule to be unlocked
    const nextUnlockCapsule =
        lockedCapsules.length > 0
            ? lockedCapsules.sort(
                  (a, b) =>
                      new Date(a.unlockDate).getTime() -
                      new Date(b.unlockDate).getTime()
              )[0]
            : null;

    const nextUnlockDate = nextUnlockCapsule
        ? new Date(nextUnlockCapsule.unlockDate)
        : null;

    const countdown = useCountdown(nextUnlockDate);

    // Handle countdown completion
    const handleCountdownComplete = () => {
        console.log('Countdown completed - refreshing capsules data');
        refetch();
    };

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="60vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography color="error" variant="h6">
                    Error loading your capsules. Please try again later.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Page Title */}
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                My Time Capsules
            </Typography>

            {/* Stats Section */}
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #8e2de2, #4a00e0)',
                    boxShadow:
                        '0 10px 20px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        background:
                            'radial-gradient(circle at top right, rgba(255,255,255,0.15), transparent 70%)',
                    },
                }}
            >
                <Grid container spacing={3}>
                    {/* Total Stats */}
                    <Grid
                        size={{ xs: 12, md: 6 }}
                        sx={{ position: 'relative', zIndex: 1 }}
                    >
                        <Box color="white">
                            <Box display="flex" alignItems="center" mb={1}>
                                <CollectionsBookmarkIcon sx={{ mr: 1 }} />
                                <Typography variant="h5" fontWeight="bold">
                                    Your Capsule Collection
                                </Typography>
                            </Box>

                            <Typography variant="body1" sx={{ mb: 2 }}>
                                You have{' '}
                                <Box
                                    component="span"
                                    fontWeight="bold"
                                    fontSize={18}
                                >
                                    {totalCapsules}
                                </Box>{' '}
                                time{' '}
                                {totalCapsules === 1 ? 'capsule' : 'capsules'}{' '}
                                in total
                            </Typography>

                            {nextUnlockCapsule && (
                                <CountdownTimer
                                    years={countdown.years}
                                    days={countdown.days}
                                    hours={countdown.hours}
                                    minutes={countdown.minutes}
                                    seconds={countdown.seconds}
                                    title="Time until next unlock:"
                                    onComplete={handleCountdownComplete}
                                />
                            )}
                        </Box>
                    </Grid>

                    {/* Locked/Unlocked Count */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Grid container spacing={2}>
                            {/* Unlocked Count */}
                            <Grid size={{ xs: 6 }}>
                                <Card
                                    elevation={4}
                                    sx={{
                                        p: 2,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.9)',
                                        borderRadius: 2,
                                        transition: 'transform 0.2s ease',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                        },
                                    }}
                                >
                                    <LockOpenIcon
                                        color="success"
                                        sx={{ fontSize: 40, mb: 1 }}
                                    />
                                    <Typography variant="h3" fontWeight="bold">
                                        {totalUnlocked}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                    >
                                        Unlocked
                                    </Typography>
                                </Card>
                            </Grid>

                            {/* Locked Count */}
                            <Grid size={{ xs: 6 }}>
                                <Card
                                    elevation={4}
                                    sx={{
                                        p: 2,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.9)',
                                        borderRadius: 2,
                                        transition: 'transform 0.2s ease',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                        },
                                    }}
                                >
                                    <LockClockIcon
                                        color="error"
                                        sx={{ fontSize: 40, mb: 1 }}
                                    />
                                    <Typography variant="h3" fontWeight="bold">
                                        {totalLocked}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                    >
                                        Locked
                                    </Typography>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="capsule tabs"
                    variant="fullWidth"
                >
                    <Tab
                        label={`Unlock Capsule (${totalUnlocked})`}
                        icon={<LockOpenIcon />}
                        iconPosition="start"
                    />
                    <Tab
                        label={`Lock Capsule (${totalLocked})`}
                        icon={<LockClockIcon />}
                        iconPosition="start"
                    />
                </Tabs>
            </Box>

            {/* Unlocked Capsules Tab */}
            <TabPanel value={tabValue} index={0}>
                {unlockedCapsules.length === 0 ? (
                    <Box textAlign="center" py={4}>
                        <Typography variant="h6" color="text.secondary">
                            You don't have any unlocked capsules yet.
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Your capsules will appear here once they're
                            unlocked.
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {unlockedCapsules.map((capsule) => (
                            <Grid
                                size={{ xs: 12, sm: 6, md: 4 }}
                                key={capsule.id}
                            >
                                <CapsuleCard capsule={capsule} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </TabPanel>

            {/* Locked Capsules Tab */}
            <TabPanel value={tabValue} index={1}>
                {lockedCapsules.length === 0 ? (
                    <Box textAlign="center" py={4}>
                        <Typography variant="h6" color="text.secondary">
                            You don't have any locked capsules yet.
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Create a new capsule to get started!
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {lockedCapsules.map((capsule) => (
                            <Grid
                                size={{ xs: 12, sm: 6, md: 4 }}
                                key={capsule.id}
                            >
                                <CapsuleCard capsule={capsule} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </TabPanel>
        </Container>
    );
}
</file>

<file path="Hackathon-2025-main/frontend/src/pages/ProfilePage.tsx">
import {
    Avatar,
    Button,
    Container,
    Grid,
    Paper,
    Typography,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

export const ProfilePage = () => {
    const { user, logoutUser } = useAuth();

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: 2,
                    background: 'linear-gradient(to right, #2a3eb1, #4364f7)',
                    color: 'white',
                    mb: 3,
                }}
            >
                <Grid container spacing={3} alignItems="center">
                    <Grid size={{ xs: 12, md: 4 }} textAlign="center">
                        <Avatar
                            alt={user?.name || 'User'}
                            sx={{
                                width: 100,
                                height: 100,
                                border: '4px solid white',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                            }}
                        >
                            {user?.name?.charAt(0) || 'U'}
                        </Avatar>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }} textAlign="left">
                        <Typography variant="h4" fontWeight="bold">
                            {user?.name || 'User Profile'}
                        </Typography>
                        <Typography variant="subtitle1">
                            {user?.email || 'user@example.com'}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Member since:{' '}
                            {user?.createdAt
                                ? new Date(user.createdAt).toLocaleDateString()
                                : 'Unknown'}
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 12 }} textAlign="center" sx={{ mt: 3 }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => logoutUser()}
                            sx={{ borderRadius: 2 }}
                        >
                            Sign Out
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};
</file>

<file path="Hackathon-2025-main/frontend/src/pages/RegisterPage.tsx">
import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RegisterUserSchema, RegisterUserType } from '../schemas/authSchemas';

export function RegisterPage() {
    const navigate = useNavigate();
    const { registerUser, error, registerStatus } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterUserType>({
        resolver: zodResolver(RegisterUserSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
        },
    });

    const onSubmit = async (data: RegisterUserType) => {
        try {
            await registerUser(data);
            navigate('/');
        } catch (error) {
            // Error is handled by the useAuth hook
            console.error('Registration failed', error);
        }
    };

    const toggleShowPassword = () => setShowPassword((prev) => !prev);
    const toggleShowConfirmPassword = () =>
        setShowConfirmPassword((prev) => !prev);

    const isLoading = registerStatus === 'pending';

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Card elevation={3}>
                <CardContent sx={{ p: 4 }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        textAlign="center"
                    >
                        Create an Account
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                    >
                        <Stack spacing={3}>
                            <TextField
                                label="Name"
                                fullWidth
                                autoComplete="name"
                                autoFocus
                                {...register('name')}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                disabled={isLoading}
                            />

                            <TextField
                                label="Email Address"
                                fullWidth
                                autoComplete="email"
                                {...register('email')}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                disabled={isLoading}
                            />

                            <TextField
                                label="Password"
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                {...register('password')}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                disabled={isLoading}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={toggleShowPassword}
                                                edge="end"
                                                aria-label={
                                                    showPassword
                                                        ? 'hide password'
                                                        : 'show password'
                                                }
                                            >
                                                {showPassword ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                label="Confirm Password"
                                fullWidth
                                type={showConfirmPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                {...register('confirmPassword')}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
                                disabled={isLoading}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={
                                                    toggleShowConfirmPassword
                                                }
                                                edge="end"
                                                aria-label={
                                                    showConfirmPassword
                                                        ? 'hide password'
                                                        : 'show password'
                                                }
                                            >
                                                {showConfirmPassword ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                loading={isLoading}
                            >
                                Register
                            </Button>

                            <Box sx={{ textAlign: 'center' }}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Already have an account?{' '}
                                    <Button
                                        component={Link}
                                        to="/login"
                                        color="primary"
                                    >
                                        Log in
                                    </Button>
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}
</file>

<file path="Hackathon-2025-main/frontend/src/router/routes.tsx">
import { Box } from '@mui/material';
import { Navigate, RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { MainLayout } from '../components/layouts/MainLayout';
import { CapsulePage } from '../pages/CapsulePage';
import { CreateCapsulePage } from '../pages/CreateCapsulePage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { MyCapsules } from '../pages/MyCapsules';
import { ProfilePage } from '../pages/ProfilePage';
import { RegisterPage } from '../pages/RegisterPage';

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'capsules/create',
                element: (
                    <ProtectedRoute>
                        <CreateCapsulePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'my-capsules',
                element: (
                    <ProtectedRoute>
                        <MyCapsules />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'profile',
                element: (
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'capsule/:capsuleId',
                element: (
                    <ProtectedRoute>
                        <CapsulePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'login',
                element: <LoginPage />,
            },
            {
                path: 'register',
                element: <RegisterPage />,
            },
            {
                path: '*',
                element: (
                    <Box sx={{ p: 2 }}>
                        <h1>404 Not Found</h1>
                        <p>The page you are looking for does not exist.</p>
                    </Box>
                ),
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
];
</file>

<file path="Hackathon-2025-main/frontend/src/schemas/authSchemas.ts">
import { z } from 'zod';

// Schema for user registration
export const RegisterUserSchema = z
    .object({
        email: z.string().email('Please enter a valid email address'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(
                /[A-Z]/,
                'Password must contain at least one uppercase letter'
            )
            .regex(/[0-9]/, 'Password must contain at least one number')
            .regex(
                /[^A-Za-z0-9]/,
                'Password must contain at least one special character'
            ),
        confirmPassword: z.string(),
        name: z.string().min(2, 'Name must be at least 2 characters').max(50),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

// Schema for user login
export const LoginUserSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

// Schema for the User data structure
export const UserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    createdAt: z.string()
});

// Exported types
export type RegisterUserType = z.infer<typeof RegisterUserSchema>;
export type LoginUserType = z.infer<typeof LoginUserSchema>;
export type UserType = z.infer<typeof UserSchema>;

// Auth response schema
export const AuthResponseSchema = z.object({
    user: UserSchema,
    token: z.string(),
    refreshToken: z.string().optional(),
});

export type AuthResponseType = z.infer<typeof AuthResponseSchema>;
</file>

<file path="Hackathon-2025-main/frontend/src/schemas/capsuleSchemas.ts">
import { z } from 'zod';

// Define a union type for capsule content
const CapsuleContentSchema = z.discriminatedUnion('contentType', [
    // Text content
    z.object({
        contentType: z.literal('text'),
        textContent: z.string().min(1, 'Content cannot be empty'),
    }),
    // File content
    z.object({
        contentType: z.literal('file'),
        fileData: z.string().min(1, 'File data cannot be empty'), // base64 encoded file
        fileName: z.string().min(1, 'Filename is required'),
        fileType: z.string().min(1, 'File type is required'),
    }),
]);

export const CreateCapsuleSchema = z.object({
    title: z.string().min(2, 'Title must have at least 2 characters'),
    description: z.string().optional(),
    content: CapsuleContentSchema,
    unlockDate: z.coerce.date().refine((date) => date > new Date(), {
        message: 'Unlock date must be in the future',
    }),
    isPrivate: z.boolean().default(false),
    recipients: z.array(z.string().email('Invalid email address')).optional(),
});

// Schema for a single capsule returned from the API
export const CapsuleSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable().optional(),
    content: CapsuleContentSchema.nullable(),
    creationDate: z.coerce.date(),
    unlockDate: z.coerce.date(),
    isPrivate: z.boolean().default(false),
    isUnlocked: z.boolean().default(true),
    ownerId: z.string(),
    recipients: z.array(z.string().email()).optional(),
});

// Compact schema for the list of user's capsules
export const UserCapsulesSchema = z.array(
    CapsuleSchema.pick({
        id: true,
        title: true,
        unlockDate: true,
        isUnlocked: true,
    })
);

export type CapsuleContent = z.infer<typeof CapsuleContentSchema>;
export type CreateCapsuleType = z.infer<typeof CreateCapsuleSchema>;
export type CapsuleType = z.infer<typeof CapsuleSchema>;
export type UserCapsulesType = z.infer<typeof UserCapsulesSchema>;
</file>

<file path="Hackathon-2025-main/frontend/src/store/userAtoms.ts">
import { atom } from 'jotai';
import { UserType } from '../schemas/authSchemas';

// Base atoms
export const userAtom = atom<UserType | null>(null);
export const isAuthenticatedAtom = atom<boolean>(false);
export const authLoadingAtom = atom<boolean>(true);
export const authErrorAtom = atom<string | null>(null);

// Derived atoms
export const isAuthenticatingAtom = atom(
    (get) => get(authLoadingAtom) && !get(isAuthenticatedAtom)
);

export const userNameAtom = atom((get) => get(userAtom)?.name || '');

export const userIdAtom = atom((get) => get(userAtom)?.id);

// Action atoms
export const setUserAtom = atom(
    null, // getter not used
    (_get, set, user: UserType | null) => {
        set(userAtom, user);
        set(isAuthenticatedAtom, !!user);
        set(authLoadingAtom, false);
        set(authErrorAtom, null);
    }
);

export const setAuthErrorAtom = atom(
    null, // getter not used
    (_get, set, error: string | null) => {
        set(authErrorAtom, error);
        set(authLoadingAtom, false);
    }
);

export const logoutActionAtom = atom(
    null, // getter not used
    (_get, set) => {
        set(userAtom, null);
        set(isAuthenticatedAtom, false);
        set(authErrorAtom, null);
        // Clean up localStorage if needed (though this is done in authApi.logoutUser)
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
    }
);
</file>

<file path="Hackathon-2025-main/frontend/src/theme/theme.ts">
import { createTheme } from '@mui/material/styles';

// Custom theme for the Decentralized Time Capsule application
export const theme = createTheme({
    palette: {
        primary: {
            main: '#2E3B55', // Deep blue for trust and security
            light: '#546280',
            dark: '#1A2238',
        },
        secondary: {
            main: '#F19953', // Orange for warmth and nostalgia
            light: '#FFBC80',
            dark: '#D07A2C',
        },
        background: {
            default: '#F5F5F7',
            paper: '#FFFFFF',
        },
        error: {
            main: '#D32F2F',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 500,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 8,
    },
});
</file>

<file path="Hackathon-2025-main/frontend/src/App.css">
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}
</file>

<file path="Hackathon-2025-main/frontend/src/App.tsx">
import { useRoutes } from 'react-router-dom';
import { routes } from './router/routes';

function App() {
  // Use routes configuration to render the appropriate components
  const content = useRoutes(routes);
  
  return content;
}

export default App;
</file>

<file path="Hackathon-2025-main/frontend/src/env.ts">
import { z } from 'zod';

// Define environment variable schema
const envSchema = z.object({
    // API base URL with fallback to localhost for development
    VITE_API_BASE_URL: z.string().default('http://localhost:3000'),

    // Add other environment variables as needed
    VITE_ENV: z
        .enum(['development', 'test', 'production'])
        .default('development'),
});

// Parse environment variables
const env = envSchema.parse({
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_ENV: import.meta.env.VITE_ENV,
});

// Export parsed variables
export const API_BASE_URL = env.VITE_API_BASE_URL;
export const NODE_ENV = env.VITE_ENV;

// For debugging in development
if (env.VITE_ENV === 'development') {
    console.log('Environment variables:', env);
}
</file>

<file path="Hackathon-2025-main/frontend/src/folder-structure.md">
# Project Folder Structure

/src
  /assets        - Static assets (images, icons, etc.)
  /components    
    /ui          - UI components (buttons, inputs, modals)
    /layouts     - Layout components (header, footer, sidebar)
    /capsules    - Capsule-specific components
  /hooks         - Custom React hooks
  /api           - API client and endpoints
  /services      - Business logic services
  /pages         - Page components organized by feature
  /schemas       - Zod validation schemas
  /utils         - Utility functions
  /theme         - MUI theme configuration
  /router        - Routing configuration
  /store         - Jotai store configuration
</file>

<file path="Hackathon-2025-main/frontend/src/index.css">
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}
</file>

<file path="Hackathon-2025-main/frontend/src/main.tsx">
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { theme } from './theme/theme';

// Create a query client with sensible defaults
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60, // 1 minute
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <CssBaseline /> {/* Normalize CSS */}
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </LocalizationProvider>
            </ThemeProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
</file>

<file path="Hackathon-2025-main/frontend/src/vite-env.d.ts">
/// <reference types="vite/client" />
</file>

<file path="Hackathon-2025-main/frontend/.gitignore">
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
</file>

<file path="Hackathon-2025-main/frontend/eslint.config.js">
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
</file>

<file path="Hackathon-2025-main/frontend/index.html">
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/time-capsule-hero.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Time Capsule</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
</file>

<file path="Hackathon-2025-main/frontend/package.json">
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.0",
    "@hookform/resolvers": "^4.1.3",
    "@mui/icons-material": "^7.0.1",
    "@mui/material": "^7.0.1",
    "@mui/x-date-pickers": "^7.28.2",
    "@tanstack/react-query": "^5.70.0",
    "@tanstack/react-query-devtools": "^5.70.0",
    "axios": "^1.8.4",
    "date-fns": "^4.1.0",
    "dayjs": "^1.11.13",
    "jotai": "^2.12.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.55.0",
    "react-markdown": "^10.1.0",
    "react-router-dom": "^7.4.1",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@eslint/js": "^9.21.0",
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.21.0",
    "eslint-plugin-react-hooks": "^5.1.0",
    "eslint-plugin-react-refresh": "^0.4.19",
    "globals": "^15.15.0",
    "typescript": "~5.7.2",
    "typescript-eslint": "^8.24.1",
    "vite": "^6.2.0"
  }
}
</file>

<file path="Hackathon-2025-main/frontend/tsconfig.app.json">
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
</file>

<file path="Hackathon-2025-main/frontend/tsconfig.json">
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
</file>

<file path="Hackathon-2025-main/frontend/tsconfig.node.json">
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
</file>

<file path="Hackathon-2025-main/frontend/vite.config.ts">
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
</file>

<file path="Hackathon-2025-main/.gitignore">
.env
__pycache__
</file>

<file path="Hackathon-2025-main/docker-compose.yml">
services:
  mongodb:
    image: mongo:latest
    container_name: mongodb
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
      MONGO_INITDB_DATABASE: hackathon_db
    volumes:
      - mongodb_data:/data/db
    networks:
      - mongo_network

  mongo-express:
    image: mongo-express:latest
    container_name: mongo-express
    restart: always
    ports:
      - "8081:8081"
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: root
      ME_CONFIG_MONGODB_ADMINPASSWORD: example
      ME_CONFIG_MONGODB_SERVER: mongodb
      ME_CONFIG_BASICAUTH_USERNAME: admin
      ME_CONFIG_BASICAUTH_PASSWORD: admin123
    depends_on:
      - mongodb
    networks:
      - mongo_network

networks:
  mongo_network:
    driver: bridge

volumes:
  mongodb_data:
    name: mongodb_data
</file>

</files>
