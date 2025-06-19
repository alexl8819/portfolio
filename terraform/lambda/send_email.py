import os
import re
import json
import urllib.parse
import urllib.request
import boto3

ses = boto3.client("ses")

SENDER = os.environ["SENDER_EMAIL"]
RECIPIENT = os.environ["RECIPIENT_EMAIL"]
CAPTCHA_SECRET = os.environ["CAPTCHA_SECRET"]
EMAIL_VALIDATION_APIKEY = os.environ["EMAIL_VALIDATION_APIKEY"]

VALID_NAME_SEQUENCE = r'^(?!\s*$)(?!^(.)\1+$)[A-Za-z]+(?: [A-Za-z]+)+$'
VALID_MESSAGE_SEQUENCE = r'^(?!\s*$)(?!^(.)\1+$)( {0,2}[A-Za-z0-9,!$#@%&-()]+(?: [A-Za-z0-9,!$#@%&-()]+)* {0,2})$'

def validate_email(email):
    url = f"https://emailvalidation.abstractapi.com/v1/?api_key={EMAIL_VALIDATION_APIKEY}&email={email}"

    try:
        with urllib.request.urlopen(url, timeout=10) as response:
            data = json.loads(response.read().decode())
    except Exception as e:
        print("Error:", e)
        return False
    
    is_disposable = data.get('is_disposable_email', {})
    
    return data.get('deliverability') == 'DELIVERABLE' and not is_disposable.get('value')

def verify_captcha(token, remoteIp):
    url = "https://api.hcaptcha.com/siteverify"
    data = urllib.parse.urlencode({
        "secret": CAPTCHA_SECRET,
        "remoteip": remoteIp,
        "response": token
    }).encode()

    req = urllib.request.Request(url, data=data, method='POST')
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read().decode())
        return result.get("success", False)

def handler(event, context):
    try:
        body = json.loads(event.get("body", "{}"))

        name = body.get("name")

        if not name or name and not re.fullmatch(VALID_NAME_SEQUENCE, name):
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Name must be included", "field": "name"})
            }

        message = body.get("message")

        if not message or message and len(message) < 25 and not re.fullmatch(VALID_MESSAGE_SEQUENCE, message):
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Message must be included", "field": "message"})
            }

        sender_email = body.get("email")

        if not sender_email or sender_email and len(sender_email) <= 6:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Email must be included", "field": "email"})
            }
        
        if not validate_email(sender_email):
            return {
                "statusCode": 401,
                "body": json.dumps({"error": "Email provided is invalid", "field": "email"})
            }    
        
        sourceIp = event["requestContext"]["http"]["sourceIp"]

        token = body.get("captchaToken")

        if not token or not verify_captcha(token, sourceIp):
            return {
                "statusCode": 403,
                "body": json.dumps({"error": "CAPTCHA verification failed", "field": "captchaToken"})
            }

        response = ses.send_email(
            Source=SENDER,
            Destination={"ToAddresses": [RECIPIENT]},
            Message={
                "Subject": {"Data": f"New Message from {name}"},
                "Body": {
                    "Text": {
                        "Data": f"From: {sender_email}\n\n{message}"
                    }
                },
            }
        )

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Email sent successfully."})
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }