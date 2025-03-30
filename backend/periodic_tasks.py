from capsule import get_unlockable_capsules, update_capsule_attribute
from utils.email_utils import send_many_email, return_email_content
from dotenv import load_dotenv
import os

#verifier toutes les capsules pour éventuellement les envoyer par email
def periodic_task():
    load_dotenv()
    """Task to run every 24 hours"""
    capsules_to_send = get_unlockable_capsules()
    for caps in capsules_to_send:
        if caps.get("recipients") is None:
            continue
        caps["baseUrl"] = os.getenv("BASE_URL") + str(caps["_id"])
        send_many_email(return_email_content("email_type_content_ready.html",caps), caps.get("recipients"), "Tu peux enfin ouvrir ta capsule !")
        update_capsule_attribute(caps["_id"],"email_sent",True)