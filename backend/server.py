"""
HILLIA Backend - Governance Backend (not Growth Backend)
========================================================
Purpose: Store, observe, and interpret alignment signals
NOT: Automate sales, accelerate conversion, or optimise funnels
"""

from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import secrets
import hashlib
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(
    title="HILLIA Governance Backend",
    description="Observe, store, and interpret alignment signals",
    version="0.1.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Basic auth for admin endpoints
security = HTTPBasic()

# Admin credentials (in production, set via environment variables - NO DEFAULTS)
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME')
ADMIN_PASSWORD_HASH = os.environ.get('ADMIN_PASSWORD_HASH')

# Rate limiting for admin auth (simple in-memory, resets on server restart)
failed_attempts = {}
MAX_FAILED_ATTEMPTS = 5
LOCKOUT_DURATION = 300  # 5 minutes in seconds

def verify_admin(credentials: HTTPBasicCredentials = Depends(security)):
    """Verify admin credentials with rate limiting"""
    # Reject if admin credentials not configured
    if not ADMIN_USERNAME or not ADMIN_PASSWORD_HASH:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Admin not configured",
        )
    
    client_key = credentials.username
    current_time = datetime.now(timezone.utc).timestamp()
    
    # Check if locked out
    if client_key in failed_attempts:
        attempts, lockout_time = failed_attempts[client_key]
        if attempts >= MAX_FAILED_ATTEMPTS:
            if current_time - lockout_time < LOCKOUT_DURATION:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many failed attempts. Try again later.",
                )
            else:
                # Reset after lockout period
                del failed_attempts[client_key]
    
    password_hash = hashlib.sha256(credentials.password.encode()).hexdigest()
    is_correct_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    is_correct_password = secrets.compare_digest(password_hash, ADMIN_PASSWORD_HASH)
    
    if not (is_correct_username and is_correct_password):
        # Track failed attempt
        if client_key in failed_attempts:
            attempts, _ = failed_attempts[client_key]
            failed_attempts[client_key] = (attempts + 1, current_time)
        else:
            failed_attempts[client_key] = (1, current_time)
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    
    # Clear failed attempts on successful login
    if client_key in failed_attempts:
        del failed_attempts[client_key]
    
    return credentials.username

# ============================================
# ENUMS
# ============================================

class ResponseStatus(str, Enum):
    UNREVIEWED = "unreviewed"
    REVIEWED = "reviewed"
    ARCHIVED = "archived"

class ContactStatus(str, Enum):
    NEW = "new"
    REVIEWED = "reviewed"
    ARCHIVED = "archived"

class AdminRole(str, Enum):
    REVIEWER = "reviewer"
    OWNER = "owner"

# ============================================
# DATA MODELS
# ============================================

class InternalScore(BaseModel):
    """Internal scoring - NEVER exposed to frontend or users"""
    community_fit: Optional[str] = None  # Low / Medium / High
    lifestyle_alignment: Optional[str] = None
    decision_maturity: Optional[str] = None

class QuestionnaireResponseCreate(BaseModel):
    """Questionnaire submission from frontend"""
    session_id: str
    consent: bool = True
    sections: Dict[str, Any] = {}
    free_text: Dict[str, str] = {}
    contact_info: Optional[Dict[str, str]] = None
    wants_contact: bool = False

class QuestionnaireResponse(BaseModel):
    """Full questionnaire response model"""
    model_config = ConfigDict(extra="ignore")
    
    response_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    session_id: str
    consent: bool = True
    sections: Dict[str, Any] = {}
    free_text: Dict[str, str] = {}
    contact_info: Optional[Dict[str, str]] = None
    wants_contact: bool = False
    # Internal only - never exposed to users
    internal_score: InternalScore = Field(default_factory=InternalScore)
    internal_notes: str = ""
    status: ResponseStatus = ResponseStatus.UNREVIEWED
    watched: bool = False  # Watch list feature

class ContactSubmissionCreate(BaseModel):
    """Contact form submission from frontend"""
    name: str
    reason: str
    city: Optional[str] = None  # Optional now
    preferred_contact: Optional[str] = None  # '', 'email', 'phone'
    email: Optional[str] = None
    phone: Optional[str] = None
    consent: bool = True

class ContactSubmission(BaseModel):
    """Full contact submission model"""
    model_config = ConfigDict(extra="ignore")
    
    submission_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    name: str
    reason: str
    city: Optional[str] = None
    preferred_contact: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    consent: bool = True
    status: ContactStatus = ContactStatus.NEW
    internal_notes: str = ""
    watched: bool = False  # Watch list feature

class AnalyticsEvent(BaseModel):
    """Analytics event (consent-based)"""
    model_config = ConfigDict(extra="ignore")
    
    event_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    session_id: str
    event_type: str  # homepage_entry, invitation_opened, questionnaire_started, questionnaire_completed, dropoff
    event_data: Dict[str, Any] = {}
    consent: bool = True

# Response models for public endpoints (no internal data)
class QuestionnaireResponsePublic(BaseModel):
    """Public response - no internal scores"""
    response_id: str
    timestamp: datetime
    status: str

class ContactSubmissionPublic(BaseModel):
    """Public response - confirmation only"""
    submission_id: str
    timestamp: datetime

# ============================================
# PUBLIC ENDPOINTS (Frontend-facing)
# ============================================

@api_router.get("/")
async def root():
    return {"message": "HILLIA Governance Backend", "version": "0.1.0"}

@api_router.post("/questionnaire", response_model=QuestionnaireResponsePublic)
async def submit_questionnaire(data: QuestionnaireResponseCreate):
    """Submit questionnaire response"""
    if not data.consent:
        raise HTTPException(status_code=400, detail="Consent required for data persistence")
    
    response = QuestionnaireResponse(
        session_id=hashlib.sha256(data.session_id.encode()).hexdigest()[:16],  # Hash session ID
        consent=data.consent,
        sections=data.sections,
        free_text=data.free_text,
        contact_info=data.contact_info if data.wants_contact else None,
        wants_contact=data.wants_contact
    )
    
    doc = response.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    await db.questionnaire_responses.insert_one(doc)
    
    logger.info(f"Questionnaire submitted: {response.response_id}")
    
    return QuestionnaireResponsePublic(
        response_id=response.response_id,
        timestamp=response.timestamp,
        status="received"
    )

@api_router.post("/contact", response_model=ContactSubmissionPublic)
async def submit_contact(data: ContactSubmissionCreate):
    """Submit contact form"""
    if not data.consent:
        raise HTTPException(status_code=400, detail="Consent required for data persistence")
    
    submission = ContactSubmission(
        name=data.name,
        reason=data.reason,
        city=data.city,
        preferred_contact=data.preferred_contact,
        email=data.email,
        phone=data.phone,
        consent=data.consent
    )
    
    doc = submission.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    await db.contact_submissions.insert_one(doc)
    
    logger.info(f"Contact submitted: {submission.submission_id}")
    
    return ContactSubmissionPublic(
        submission_id=submission.submission_id,
        timestamp=submission.timestamp
    )

@api_router.post("/analytics/event")
async def track_event(event_type: str, session_id: str, event_data: Dict[str, Any] = {}, consent: bool = True):
    """Track analytics event (consent-based)"""
    if not consent:
        return {"status": "skipped", "reason": "no consent"}
    
    event = AnalyticsEvent(
        session_id=hashlib.sha256(session_id.encode()).hexdigest()[:16],
        event_type=event_type,
        event_data=event_data,
        consent=consent
    )
    
    doc = event.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    await db.analytics_events.insert_one(doc)
    
    return {"status": "recorded", "event_id": event.event_id}

# ============================================
# ADMIN ENDPOINTS (Internal only)
# ============================================

@api_router.get("/admin/questionnaire", response_model=List[QuestionnaireResponse])
async def get_questionnaire_responses(
    status: Optional[ResponseStatus] = None,
    watched: Optional[bool] = None,
    limit: int = 50,
    skip: int = 0,
    admin: str = Depends(verify_admin)
):
    """Admin: List questionnaire responses"""
    query = {}
    if status:
        query['status'] = status.value
    if watched is not None:
        query['watched'] = watched
    
    responses = await db.questionnaire_responses.find(query, {"_id": 0}).sort("timestamp", -1).skip(skip).limit(limit).to_list(limit)
    
    for resp in responses:
        if isinstance(resp.get('timestamp'), str):
            resp['timestamp'] = datetime.fromisoformat(resp['timestamp'])
    
    return responses

@api_router.get("/admin/questionnaire/{response_id}", response_model=QuestionnaireResponse)
async def get_questionnaire_response(response_id: str, admin: str = Depends(verify_admin)):
    """Admin: Get single questionnaire response"""
    response = await db.questionnaire_responses.find_one({"response_id": response_id}, {"_id": 0})
    
    if not response:
        raise HTTPException(status_code=404, detail="Response not found")
    
    if isinstance(response.get('timestamp'), str):
        response['timestamp'] = datetime.fromisoformat(response['timestamp'])
    
    return response

@api_router.patch("/admin/questionnaire/{response_id}")
async def update_questionnaire_response(
    response_id: str,
    status: Optional[ResponseStatus] = None,
    internal_notes: Optional[str] = None,
    internal_score: Optional[InternalScore] = None,
    watched: Optional[bool] = None,
    admin: str = Depends(verify_admin)
):
    """Admin: Update questionnaire response (notes, status, score, watched)"""
    update_data = {}
    
    if status:
        update_data['status'] = status.value
    if internal_notes is not None:
        update_data['internal_notes'] = internal_notes
    if internal_score:
        update_data['internal_score'] = internal_score.model_dump()
    if watched is not None:
        update_data['watched'] = watched
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await db.questionnaire_responses.update_one(
        {"response_id": response_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Response not found")
    
    logger.info(f"Admin {admin} updated questionnaire {response_id}")
    
    return {"status": "updated", "response_id": response_id}

@api_router.delete("/admin/questionnaire/{response_id}")
async def delete_questionnaire_response(response_id: str, admin: str = Depends(verify_admin)):
    """Admin: Hard delete questionnaire response (GDPR compliance)"""
    result = await db.questionnaire_responses.delete_one({"response_id": response_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Response not found")
    
    logger.info(f"Admin {admin} deleted questionnaire {response_id}")
    
    return {"status": "deleted", "response_id": response_id}

@api_router.get("/admin/contact", response_model=List[ContactSubmission])
async def get_contact_submissions(
    status: Optional[ContactStatus] = None,
    watched: Optional[bool] = None,
    limit: int = 50,
    skip: int = 0,
    admin: str = Depends(verify_admin)
):
    """Admin: List contact submissions"""
    query = {}
    if status:
        query['status'] = status.value
    if watched is not None:
        query['watched'] = watched
    
    submissions = await db.contact_submissions.find(query, {"_id": 0}).sort("timestamp", -1).skip(skip).limit(limit).to_list(limit)
    
    for sub in submissions:
        if isinstance(sub.get('timestamp'), str):
            sub['timestamp'] = datetime.fromisoformat(sub['timestamp'])
    
    return submissions

@api_router.patch("/admin/contact/{submission_id}")
async def update_contact_submission(
    submission_id: str,
    status: Optional[ContactStatus] = None,
    internal_notes: Optional[str] = None,
    watched: Optional[bool] = None,
    admin: str = Depends(verify_admin)
):
    """Admin: Update contact submission"""
    update_data = {}
    
    if status:
        update_data['status'] = status.value
    if internal_notes is not None:
        update_data['internal_notes'] = internal_notes
    if watched is not None:
        update_data['watched'] = watched
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await db.contact_submissions.update_one(
        {"submission_id": submission_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    return {"status": "updated", "submission_id": submission_id}

@api_router.delete("/admin/contact/{submission_id}")
async def delete_contact_submission(submission_id: str, admin: str = Depends(verify_admin)):
    """Admin: Hard delete contact submission (GDPR compliance)"""
    result = await db.contact_submissions.delete_one({"submission_id": submission_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    logger.info(f"Admin {admin} deleted contact {submission_id}")
    
    return {"status": "deleted", "submission_id": submission_id}

@api_router.get("/admin/contact/{submission_id}", response_model=ContactSubmission)
async def get_contact_submission(submission_id: str, admin: str = Depends(verify_admin)):
    """Admin: Get single contact submission"""
    submission = await db.contact_submissions.find_one({"submission_id": submission_id}, {"_id": 0})
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    if isinstance(submission.get('timestamp'), str):
        submission['timestamp'] = datetime.fromisoformat(submission['timestamp'])
    
    return submission

@api_router.get("/admin/stats")
async def get_admin_stats(admin: str = Depends(verify_admin)):
    """Admin: Get aggregated statistics (counts and percentages only)"""
    # Questionnaire counts by status
    questionnaire_total = await db.questionnaire_responses.count_documents({})
    questionnaire_unreviewed = await db.questionnaire_responses.count_documents({"status": "unreviewed"})
    questionnaire_reviewed = await db.questionnaire_responses.count_documents({"status": "reviewed"})
    questionnaire_archived = await db.questionnaire_responses.count_documents({"status": "archived"})
    questionnaire_watched = await db.questionnaire_responses.count_documents({"watched": True})
    
    # Contact submission counts by status
    contact_total = await db.contact_submissions.count_documents({})
    contact_new = await db.contact_submissions.count_documents({"status": "new"})
    contact_reviewed = await db.contact_submissions.count_documents({"status": "reviewed"})
    contact_archived = await db.contact_submissions.count_documents({"status": "archived"})
    contact_watched = await db.contact_submissions.count_documents({"watched": True})
    
    # Questionnaire responses wanting contact
    wants_contact_yes = await db.questionnaire_responses.count_documents({"wants_contact": True})
    wants_contact_no = await db.questionnaire_responses.count_documents({"wants_contact": False})
    
    def pct(part, total):
        return round((part / total * 100), 1) if total > 0 else 0
    
    return {
        "questionnaire": {
            "total": questionnaire_total,
            "by_status": {
                "unreviewed": {"count": questionnaire_unreviewed, "percentage": pct(questionnaire_unreviewed, questionnaire_total)},
                "reviewed": {"count": questionnaire_reviewed, "percentage": pct(questionnaire_reviewed, questionnaire_total)},
                "archived": {"count": questionnaire_archived, "percentage": pct(questionnaire_archived, questionnaire_total)},
            },
            "watched": {"count": questionnaire_watched, "percentage": pct(questionnaire_watched, questionnaire_total)},
            "contact_consent": {
                "yes": {"count": wants_contact_yes, "percentage": pct(wants_contact_yes, questionnaire_total)},
                "no": {"count": wants_contact_no, "percentage": pct(wants_contact_no, questionnaire_total)},
            }
        },
        "contact": {
            "total": contact_total,
            "by_status": {
                "new": {"count": contact_new, "percentage": pct(contact_new, contact_total)},
                "reviewed": {"count": contact_reviewed, "percentage": pct(contact_reviewed, contact_total)},
                "archived": {"count": contact_archived, "percentage": pct(contact_archived, contact_total)},
            },
            "watched": {"count": contact_watched, "percentage": pct(contact_watched, contact_total)},
        }
    }

@api_router.post("/admin/auth/verify")
async def verify_admin_auth(admin: str = Depends(verify_admin)):
    """Admin: Verify credentials are valid"""
    return {"status": "authenticated", "username": admin}

# Include the router in the main app
app.include_router(api_router)

# Health check endpoint for Kubernetes liveness/readiness probes
@app.get("/health")
async def health_check():
    """Health check endpoint for Kubernetes"""
    return {"status": "healthy"}

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
