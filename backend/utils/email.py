import smtplib

from email.message import EmailMessage
import ssl

def send_email(message:str, adress:str, subject = ""):
    # Create a text/plain message
    msg = EmailMessage()
    msg.set_content(message)
    senderemail = "capsuletemporelle2025@gmail.com"

    # me == the sender's email address
    # you == the recipient's email address
    msg['Subject'] = subject
    msg['From'] = senderemail
    msg['To'] = adress

    port = 465
    password = "ncfp ahry kumi xiwv" #Faudrais pas mettre le mdp mais vsy
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
        server.login(senderemail, password)
        server.sendmail(senderemail, adress, msg.as_string())

def send_many_email(message:str, multiple_adress, subject = ""):
    # Create a text/plain message
    msg = EmailMessage()
    msg.set_content(message)
    senderemail = "capsuletemporelle2025@gmail.com"

    # me == the sender's email address
    # you == the recipient's email address
    msg['Subject'] = subject
    msg['From'] = senderemail

    port = 465
    password = "ncfp ahry kumi xiwv"  # Faudrais pas mettre le mdp mais vsy
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
        server.login(senderemail, password)
        for adress in multiple_adress:
            msg['To'] = adress
            server.sendmail(senderemail, adress, msg.as_string())