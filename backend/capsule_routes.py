from flask import Blueprint, request, jsonify
import logging
import os
from capsule_service import CapsuleService
from error import Error

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Create blueprint
capsule_bp = Blueprint('capsule', __name__, url_prefix='')

# Create capsule service with encryption key
encryption_key = os.getenv('SECRET_KEY', 'default-very-secure-encryption-key').encode('utf-8')
capsule_service = CapsuleService(encryption_key)

def get_user_id_from_token():
    """Helper function to extract user_id from token"""
    auth_header = request.headers.get('Authorization')
    
    if not auth_header:
        return None
        
    token = auth_header.split(' ')[1] if 'Bearer' in auth_header else auth_header
    
    #payload = AuthService.verify_token(token)
    payload = None
    
    if not payload:
        return None
        
    return payload.get('user_id')

@capsule_bp.route('/capsules', methods=['POST'])
def create_capsule():
    """Create a new time capsule"""
    try:
        # Verify authentication
        # user_id = get_user_id_from_token()
        user_id = "123"
        
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
            
        # Get request data
        data = request.get_json()
        
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
        user_id = get_user_id_from_token()
        
        # Get capsule
        result = capsule_service.get_capsule(capsule_id, user_id)
        
        if isinstance(result, Error):
            return jsonify(result.to_dict()), 404 if "not found" in str(result) else 403
            
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Error retrieving capsule: {e}")
        return jsonify({"error": "An error occurred while retrieving capsule"}), 500

@capsule_bp.route('/user/capsules', methods=['GET'])
def get_user_capsules():
    """Get all capsules for the authenticated user"""
    try:
        # Verify authentication
        user_id = get_user_id_from_token()
        
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
            
        # Get capsules
        result = capsule_service.get_user_capsules(user_id)
        
        if isinstance(result, Error):
            return jsonify(result.to_dict()), 400
            
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Error retrieving user capsules: {e}")
        return jsonify({"error": "An error occurred while retrieving capsules"}), 500

@capsule_bp.route('/capsules/<capsule_id>', methods=['DELETE'])
def delete_capsule(capsule_id):
    """Delete a specific capsule"""
    try:
        # Verify authentication
        user_id = get_user_id_from_token()
        
        if not user_id:
            return jsonify({"error": "Authentication required"}), 401
            
        # Delete capsule
        result = capsule_service.delete_capsule(capsule_id, user_id)
        
        if isinstance(result, Error):
            return jsonify(result.to_dict()), 404 if "not found" in str(result) else 403
            
        return jsonify({"message": "Capsule deleted successfully"}), 200
        
    except Exception as e:
        logger.error(f"Error deleting capsule: {e}")
        return jsonify({"error": "An error occurred while deleting capsule"}), 500
