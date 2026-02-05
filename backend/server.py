from fastapi import FastAPI, APIRouter, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Contact form model
class ContactForm(BaseModel):
    name: str
    phone: str

class ContactFormResponse(BaseModel):
    id: str
    name: str
    phone: str
    timestamp: str
    email_sent: bool

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# Email sending function
def send_email_notification(name: str, phone: str):
    """Send email notification about new contact form submission"""
    try:
        # Email settings
        smtp_server = os.environ.get('SMTP_SERVER', 'smtp.mail.ru')
        smtp_port = int(os.environ.get('SMTP_PORT', 465))
        smtp_email = os.environ.get('SMTP_EMAIL', '')
        smtp_password = os.environ.get('SMTP_PASSWORD', '')
        recipient_email = 'stroyblagoaero@mail.ru'
        
        if not smtp_email or not smtp_password:
            logger.warning("SMTP credentials not configured, skipping email")
            return False
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = smtp_email
        msg['To'] = recipient_email
        msg['Subject'] = f'Новая заявка на расчёт штукатурных работ от {name}'
        
        body = f"""
Новая заявка с сайта БелВекторСтрой

Имя: {name}
Телефон: {phone}

Дата: {datetime.now().strftime('%d.%m.%Y %H:%M')}

---
Штукатурные работы в Москве и МО
        """
        
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        # Send email
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(smtp_email, smtp_password)
            server.send_message(msg)
        
        logger.info(f"Email sent successfully for contact: {name}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send email: {e}")
        return False


# Contact form endpoint
@api_router.post("/contact", response_model=ContactFormResponse)
async def submit_contact_form(form: ContactForm, background_tasks: BackgroundTasks):
    """Submit contact form and send email notification"""
    
    # Create document
    doc = {
        "id": str(uuid.uuid4()),
        "name": form.name,
        "phone": form.phone,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "email_sent": False,
        "source": "plaster_page"
    }
    
    # Save to database
    await db.contact_requests.insert_one(doc)
    logger.info(f"New contact request saved: {form.name}, {form.phone}")
    
    # Try to send email in background
    background_tasks.add_task(send_email_and_update, doc["id"], form.name, form.phone)
    
    return ContactFormResponse(
        id=doc["id"],
        name=doc["name"],
        phone=doc["phone"],
        timestamp=doc["timestamp"],
        email_sent=False  # Will be updated in background
    )


async def send_email_and_update(request_id: str, name: str, phone: str):
    """Send email and update database record"""
    email_sent = send_email_notification(name, phone)
    
    # Update database with email status
    await db.contact_requests.update_one(
        {"id": request_id},
        {"$set": {"email_sent": email_sent}}
    )


# Get all contact requests (admin endpoint)
@api_router.get("/contacts")
async def get_contact_requests():
    """Get all contact form submissions"""
    contacts = await db.contact_requests.find({}, {"_id": 0}).to_list(1000)
    return contacts

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()