import smtplib

from email.message import EmailMessage
import ssl

def send_email(message:str, adress:str, subject = ""):
    send_many_email(message, [adress], subject)

def send_many_email(message:str, multiple_adress, subject = ""):
    senderemail = "capsuletemporelle2025@gmail.com"
    port = 465
    password = "ncfp ahry kumi xiwv"  # Faudrais pas mettre le mdp mais vsy
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
        server.login(senderemail, password)
        for adress in multiple_adress:
            # Create a text/plain message
            msg = EmailMessage()
            msg.set_content(message)
            # me == the sender's email address
            # you == the recipient's email address
            msg['Subject'] = subject
            msg['From'] = senderemail
            msg['To'] = adress
            server.sendmail(senderemail, adress, msg.as_string())