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
