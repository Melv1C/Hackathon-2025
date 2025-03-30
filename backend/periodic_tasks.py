from capsule import get_unlockable_capsules
from utils.email import send_email

#verifier toutes les capsules pour éventuellement les envoyer par email
def periodic_task():
    """Task to run every 24 hours"""
    capsules_to_send = get_unlockable_capsules()
    for caps in capsules_to_send:
        if caps.get("recipients") == None:
            continue
        for email in caps.get("recipients"):
            send_email("bien  joudsnjknvx", email, "sujet du mail")
    