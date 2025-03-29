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
        