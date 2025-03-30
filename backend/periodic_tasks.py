from capsule import get_unlockable_capsules, update_capsule_attribute
from utils.email_utils import send_many_email

#verifier toutes les capsules pour éventuellement les envoyer par email
def periodic_task():
    """Task to run every 24 hours"""
    capsules_to_send = get_unlockable_capsules()
    for caps in capsules_to_send:
        if caps.get("recipients") == None:
            continue
        send_many_email("bien  joudsnjknvx", caps.get("recipients"), "sujet du mail")
        update_capsule_attribute(caps["_id"],"email_sent",True)