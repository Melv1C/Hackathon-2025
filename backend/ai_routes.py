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
        
        # Process data with AI service
        result = make_prompt(aiClient, data)
        
        if isinstance(result, Error):
            return jsonify(result.to_dict()), 400
        
        return jsonify(result), 200
    
    except Exception as e:
        logger.error(f"Error processing AI request: {e}")
        return jsonify({"error": "An error occurred while processing the AI request"}), 500
