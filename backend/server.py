import os
import logging  # Import logging module
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from capsule_routes import capsule_bp
from auth_routes import auth_bp
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

    aiClient = createClient()

    return app

if __name__ == '__main__':
    capsule_app = create_app()
    capsule_app.run(debug=True, host='0.0.0.0', port=3000)

