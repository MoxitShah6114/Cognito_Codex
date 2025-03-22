from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum

class DocumentType(str, Enum):
    DRIVING_LICENSE = "driving_license"
    AADHAR_CARD = "aadhar_card"
    PAN_CARD = "pan_card"
    VOTER_ID = "voter_id"
    PASSPORT = "passport"
    OTHER = "other"

class DocumentVerifyRequest(BaseModel):
    user_id: str
    doc_type: DocumentType
    doc_id: str
    doc_data: Dict[str, Any]

class DocumentVerifyResponse(BaseModel):
    verified: bool
    doc_type: Optional[DocumentType] = None
    doc_id: Optional[str] = None
    verification_details: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
