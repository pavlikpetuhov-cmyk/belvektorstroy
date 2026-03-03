from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import hashlib
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Secret
JWT_SECRET = os.environ.get('JWT_SECRET', 'belvektorstroy-secret-key-2024')

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Security
security = HTTPBearer()

# ==================== MODELS ====================

class UserRegister(BaseModel):
    phone: str
    password: str
    name: str
    role: str = "client"  # client or manager

class UserLogin(BaseModel):
    phone: str
    password: str

class UserResponse(BaseModel):
    id: str
    phone: str
    name: str
    role: str

class WallModel(BaseModel):
    name: str
    length: float  # в метрах
    height: float  # в метрах
    area: float    # площадь стены

class OpeningModel(BaseModel):
    wall_name: str
    width: float   # в метрах
    height: float  # в метрах
    area: float    # площадь проёма

class MeasurementCreate(BaseModel):
    client_phone: str
    client_name: str
    address: str
    walls: List[WallModel]
    openings: List[OpeningModel]
    total_wall_area: float
    total_opening_area: float
    net_area: float
    notes: Optional[str] = ""

class MeasurementResponse(BaseModel):
    id: str
    client_phone: str
    client_name: str
    address: str
    walls: List[dict]
    openings: List[dict]
    total_wall_area: float
    total_opening_area: float
    net_area: float
    notes: str
    status: str
    created_at: str
    created_by: str
    proposal_id: Optional[str] = None

class ProposalCreate(BaseModel):
    measurement_id: str
    price_per_sqm: float
    additional_works: Optional[List[dict]] = []
    discount_percent: float = 0
    notes: Optional[str] = ""

class ProposalResponse(BaseModel):
    id: str
    measurement_id: str
    client_name: str
    client_phone: str
    address: str
    net_area: float
    price_per_sqm: float
    base_cost: float
    additional_works: List[dict]
    additional_cost: float
    discount_percent: float
    discount_amount: float
    total_cost: float
    notes: str
    status: str
    created_at: str

class StatusUpdate(BaseModel):
    status: str

# ==================== AUTH HELPERS ====================

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def create_token(user_id: str, phone: str, role: str) -> str:
    payload = {
        "user_id": user_id,
        "phone": phone,
        "role": role,
        "exp": datetime.now(timezone.utc).timestamp() + 86400 * 7  # 7 days
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ==================== AUTH ENDPOINTS ====================

@api_router.post("/auth/register")
async def register(user: UserRegister):
    # Check if phone exists
    existing = await db.users.find_one({"phone": user.phone})
    if existing:
        raise HTTPException(status_code=400, detail="Телефон уже зарегистрирован")
    
    user_doc = {
        "id": str(uuid.uuid4()),
        "phone": user.phone,
        "password": hash_password(user.password),
        "name": user.name,
        "role": user.role,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    token = create_token(user_doc["id"], user_doc["phone"], user_doc["role"])
    
    return {
        "token": token,
        "user": {
            "id": user_doc["id"],
            "phone": user_doc["phone"],
            "name": user_doc["name"],
            "role": user_doc["role"]
        }
    }

@api_router.post("/auth/login")
async def login(user: UserLogin):
    db_user = await db.users.find_one({"phone": user.phone})
    if not db_user:
        raise HTTPException(status_code=401, detail="Неверный телефон или пароль")
    
    if db_user["password"] != hash_password(user.password):
        raise HTTPException(status_code=401, detail="Неверный телефон или пароль")
    
    token = create_token(db_user["id"], db_user["phone"], db_user["role"])
    
    return {
        "token": token,
        "user": {
            "id": db_user["id"],
            "phone": db_user["phone"],
            "name": db_user["name"],
            "role": db_user["role"]
        }
    }

@api_router.get("/auth/me")
async def get_me(payload: dict = Depends(verify_token)):
    user = await db.users.find_one({"id": payload["user_id"]}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# ==================== MEASUREMENTS ENDPOINTS ====================

@api_router.post("/measurements", response_model=MeasurementResponse)
async def create_measurement(data: MeasurementCreate, payload: dict = Depends(verify_token)):
    if payload["role"] != "manager":
        raise HTTPException(status_code=403, detail="Только для менеджеров")
    
    # Check if client exists, if not create
    client = await db.users.find_one({"phone": data.client_phone})
    if not client:
        client_doc = {
            "id": str(uuid.uuid4()),
            "phone": data.client_phone,
            "password": hash_password(data.client_phone[-4:]),  # last 4 digits as password
            "name": data.client_name,
            "role": "client",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(client_doc)
    
    measurement = {
        "id": str(uuid.uuid4()),
        "client_phone": data.client_phone,
        "client_name": data.client_name,
        "address": data.address,
        "walls": [w.dict() for w in data.walls],
        "openings": [o.dict() for o in data.openings],
        "total_wall_area": data.total_wall_area,
        "total_opening_area": data.total_opening_area,
        "net_area": data.net_area,
        "notes": data.notes or "",
        "status": "Замер выполнен",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "created_by": payload["user_id"],
        "proposal_id": None
    }
    
    await db.measurements.insert_one(measurement)
    return measurement

@api_router.get("/measurements")
async def get_measurements(payload: dict = Depends(verify_token)):
    if payload["role"] == "manager":
        measurements = await db.measurements.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    else:
        measurements = await db.measurements.find(
            {"client_phone": payload["phone"]}, {"_id": 0}
        ).sort("created_at", -1).to_list(1000)
    return measurements

@api_router.get("/measurements/{measurement_id}")
async def get_measurement(measurement_id: str, payload: dict = Depends(verify_token)):
    measurement = await db.measurements.find_one({"id": measurement_id}, {"_id": 0})
    if not measurement:
        raise HTTPException(status_code=404, detail="Замер не найден")
    
    if payload["role"] != "manager" and measurement["client_phone"] != payload["phone"]:
        raise HTTPException(status_code=403, detail="Доступ запрещён")
    
    return measurement

@api_router.patch("/measurements/{measurement_id}/status")
async def update_measurement_status(measurement_id: str, data: StatusUpdate, payload: dict = Depends(verify_token)):
    if payload["role"] != "manager":
        raise HTTPException(status_code=403, detail="Только для менеджеров")
    
    result = await db.measurements.update_one(
        {"id": measurement_id},
        {"$set": {"status": data.status}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Замер не найден")
    
    return {"success": True}

# ==================== PROPOSALS (КП) ENDPOINTS ====================

@api_router.post("/proposals", response_model=ProposalResponse)
async def create_proposal(data: ProposalCreate, payload: dict = Depends(verify_token)):
    if payload["role"] != "manager":
        raise HTTPException(status_code=403, detail="Только для менеджеров")
    
    measurement = await db.measurements.find_one({"id": data.measurement_id}, {"_id": 0})
    if not measurement:
        raise HTTPException(status_code=404, detail="Замер не найден")
    
    base_cost = measurement["net_area"] * data.price_per_sqm
    additional_cost = sum(w.get("cost", 0) for w in (data.additional_works or []))
    subtotal = base_cost + additional_cost
    discount_amount = subtotal * (data.discount_percent / 100)
    total_cost = subtotal - discount_amount
    
    proposal = {
        "id": str(uuid.uuid4()),
        "measurement_id": data.measurement_id,
        "client_name": measurement["client_name"],
        "client_phone": measurement["client_phone"],
        "address": measurement["address"],
        "net_area": measurement["net_area"],
        "price_per_sqm": data.price_per_sqm,
        "base_cost": round(base_cost, 2),
        "additional_works": data.additional_works or [],
        "additional_cost": round(additional_cost, 2),
        "discount_percent": data.discount_percent,
        "discount_amount": round(discount_amount, 2),
        "total_cost": round(total_cost, 2),
        "notes": data.notes or "",
        "status": "Создано",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.proposals.insert_one(proposal)
    
    # Update measurement with proposal id
    await db.measurements.update_one(
        {"id": data.measurement_id},
        {"$set": {"proposal_id": proposal["id"], "status": "КП сформировано"}}
    )
    
    return proposal

@api_router.get("/proposals")
async def get_proposals(payload: dict = Depends(verify_token)):
    if payload["role"] == "manager":
        proposals = await db.proposals.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    else:
        proposals = await db.proposals.find(
            {"client_phone": payload["phone"]}, {"_id": 0}
        ).sort("created_at", -1).to_list(1000)
    return proposals

@api_router.get("/proposals/{proposal_id}")
async def get_proposal(proposal_id: str, payload: dict = Depends(verify_token)):
    proposal = await db.proposals.find_one({"id": proposal_id}, {"_id": 0})
    if not proposal:
        raise HTTPException(status_code=404, detail="КП не найдено")
    
    if payload["role"] != "manager" and proposal["client_phone"] != payload["phone"]:
        raise HTTPException(status_code=403, detail="Доступ запрещён")
    
    return proposal

@api_router.patch("/proposals/{proposal_id}/status")
async def update_proposal_status(proposal_id: str, data: StatusUpdate, payload: dict = Depends(verify_token)):
    if payload["role"] != "manager":
        raise HTTPException(status_code=403, detail="Только для менеджеров")
    
    result = await db.proposals.update_one(
        {"id": proposal_id},
        {"$set": {"status": data.status}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="КП не найдено")
    
    return {"success": True}

# ==================== CLIENTS ENDPOINTS ====================

@api_router.get("/clients")
async def get_clients(payload: dict = Depends(verify_token)):
    if payload["role"] != "manager":
        raise HTTPException(status_code=403, detail="Только для менеджеров")
    
    clients = await db.users.find({"role": "client"}, {"_id": 0, "password": 0}).to_list(1000)
    return clients

# ==================== SETUP ====================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.on_event("startup")
async def startup_db_client():
    logger.info("Connected to MongoDB")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
