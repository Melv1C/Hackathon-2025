import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from capsule_routes import capsule_bp

# Load environment variables
load_dotenv()

def create_app(test_config=None):
    """Create and configure the Flask application"""
    # Create the Flask instance
    app = Flask(__name__)
    
    # Enable CORS
    CORS(app)
    
    # Configure app
    app.config.from_mapping(
        SECRET_KEY=os.getenv('SECRET_KEY', 'dev-key-for-development-only'),
        IPFS_API_URL=os.getenv('IPFS_API_URL', 'http://localhost:5001/api/v0'),
        IPFS_GATEWAY_URL=os.getenv('IPFS_GATEWAY_URL', 'https://ipfs.io/ipfs'),
    )
    
    # Apply test config if provided
    if test_config:
        app.config.update(test_config)
    
    # Register blueprints
    # app.register_blueprint(auth_bp)
    app.register_blueprint(capsule_bp)
    
    # Register error handlers
    @app.errorhandler(404)
    def not_found(error):
        return {"error": "Resource not found"}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return {"error": "Internal server error"}, 500
    
    # Create temp directory for IPFS file operations if it doesn't exist
    os.makedirs('temp', exist_ok=True)
    
    return app


if __name__ == '__main__':
    capsule_app = create_app()
    capsule_app.run(debug=True, host='0.0.0.0', port=3000)

