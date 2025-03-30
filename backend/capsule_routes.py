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
    

