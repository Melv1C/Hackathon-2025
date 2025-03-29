from flask import Flask, request, jsonify
from dotenv import load_dotenv
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from base64 import b64encode, b64decode
import ipfs_api
import os
import json
import uuid
from capsule import Capsule
from error import Error
from flask_cors import CORS

load_dotenv()


# Modification de la ligne d'initialisation de la clé
SERVER_CRYPTAGE_KEY = os.getenv('secret_key').encode('utf-8')


def decrypt_message(iv, ciphertext, key):
    cipher = Cipher(
        algorithms.AES(key),
        modes.CBC(iv),
        backend=default_backend()
    )
    ciphertext = b64decode(ciphertext)
    iv = b64decode(iv)

    decryptor = cipher.decryptor()
    plaintext_padded = decryptor.update(ciphertext) + decryptor.finalize()
    
    # Retirer le padding
    padding_length = plaintext_padded[-1]
    plaintext = plaintext_padded[:-padding_length]
    
    return plaintext.decode('utf-8')

def encrypt_message(message, key):
    # Générer un IV aléatoire (unique pour chaque message)
    # à stocker dans la base au même titre que le contenu chiffré
    iv = os.urandom(16)
    
    # Créer le cipher (algo de chiffrage)
    cipher = Cipher(
        algorithms.AES(key),
        modes.CBC(iv),
        backend=default_backend()
    )
    
    encryptor = cipher.encryptor()
    
    # Ajouter le padding (on ajoute les bites manquant pour que le message soit un multiple de 16)
    padding_length = 16 - (len(message) % 16)
    message += bytes([padding_length]) * padding_length
    
    # Chiffrer le message
    ciphertext = encryptor.update(message) + encryptor.finalize()
    
    return iv, ciphertext


def send_data(content):
    
    myuuid = str(uuid.uuid4())
    print(myuuid)
    path = "temp/" + myuuid
    content_file = open(path, "wb+")
    content_file.write(content)
    content_file.close()
    cid = ipfs_api.publish(path)
    ipfs_api.pin(cid)
    os.remove(path)
    return cid



app = Flask(__name__)

# Enable CORS for the Flask app
CORS(app)

@app.route("/", methods=["GET"])
def test():
    print("test")
    ipfs_api.download("QmQmHwC5og57WKLEex2rhCK8qyNWxAwjoJ8Ch62eh7fKu3", "test.txt")
    print("test")
    return jsonify({"message": "test"})

@app.route("/capsules", methods=["POST"])
def analyse_file():
    try:
        #on recoit un dico
        data = request.get_json()
        # Convertir tout le dictionnaire data en chaîne JSON puis en bytes
        json_data = json.dumps(data["content"]).encode('utf-8')

        print(json_data)
        
        # Chiffrer l'ensemble des données
        iv, encrypted_content = encrypt_message(json_data, SERVER_CRYPTAGE_KEY)

        print(str(iv))

        dic = {
            "iv": str(iv),
            "content": str(encrypted_content)
        }

        json_final_content = json.dumps(dic)
        bytes_final_content = json_final_content.encode('utf-8')
        
        
        # Publier le contenu chiffré et l'IV sur IPFS
        cid = send_data(bytes_final_content)

        capsule = Capsule()
        response = capsule.create(
            title=data["title"],
            content=cid,
            unlock_date=data["unlockDate"],
            is_private=data["isPrivate"],
            owner_id="123",
            description=data["description"],
            recipients=data["recipients"]
        )
        if type(response) == Error:
            return jsonify({
                "error": str(response)
            }), 400
        return jsonify({
            "id": response,
            "message": "Capsule created successfully",
        })
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 400

@app.route("/capsule", methods=["POST"])
def decrypt():
    try:
        pass
    except:
        pass

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)