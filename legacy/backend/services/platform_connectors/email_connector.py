import aiosmtplib
import imaplib2
from email.message import EmailMessage
from ...config import settings
from loguru import logger

class EmailConnector:
    async def send_email(self, to_email: str, subject: str, content: str):
        message = EmailMessage()
        message["From"] = settings.EMAIL_ADDRESS
        message["To"] = to_email
        message["Subject"] = subject
        message.set_content(content)

        try:
            await aiosmtplib.send(
                message,
                hostname=settings.SMTP_HOST,
                port=settings.SMTP_PORT,
                username=settings.EMAIL_ADDRESS,
                password=settings.EMAIL_PASSWORD,
                use_tls=True,
            )
            return True
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            return False

    def fetch_emails(self):
        # Synchronous fetching as imaplib is blocking (can be wrapped in async)
        try:
            mail = imaplib2.IMAP4_SSL(settings.IMAP_HOST, settings.IMAP_PORT)
            mail.login(settings.EMAIL_ADDRESS, settings.EMAIL_PASSWORD)
            mail.select("inbox")
            # Logic to search and fetch unseen messages
            return [] 
        except Exception as e:
            logger.error(f"Email fetch error: {e}")
            return []

email_connector = EmailConnector()
