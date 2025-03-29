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

        
db = MongoDBConnection(
    host=os.getenv('MONGODB_HOST', 'localhost'),
    port=int(os.getenv('MONGODB_PORT', 27017)),
    db_name=os.getenv('MONGODB_DB_NAME', 'hackathon_db'),
    username=os.getenv('MONGODB_USERNAME', 'root'),
    password=os.getenv('MONGODB_PASSWORD', 'example')
)
db.connect()