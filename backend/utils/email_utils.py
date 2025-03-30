import smtplib
from email.message import EmailMessage
import ssl


def send_email(message:str, adress:str, subject = ""):
    send_many_email(message, [adress], subject)

def send_many_email(message: str, multiple_addresses, subject=""):
    sender_email = "capsuletemporelle2025@gmail.com"
    port = 465
    password = "ncfp ahry kumi xiwv"  # Faudrais pas mettre le mdp mais vsy
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
        server.login(sender_email, password)
        for address in multiple_addresses:
            # Create an email message
            msg = EmailMessage()
            # Set email headers
            msg['Subject'] = subject
            msg['From'] = sender_email
            msg['To'] = address

            # Check if the message is HTML or plain text
            if "<html>" in message:
                msg.add_alternative(message, subtype="html")
            else:
                msg.set_content(message)

            server.sendmail(sender_email, address, msg.as_string())

def return_email_content(file_path="email_content.html"):
    """
    Reads the content of the email from a file.
    Supports both plain text and HTML content.
    """
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    return content