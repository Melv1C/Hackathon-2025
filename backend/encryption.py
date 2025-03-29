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
