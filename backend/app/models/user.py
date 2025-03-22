from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr

class UserDocument(BaseModel):
    doc_type: str
    doc_id: str
    verified: bool = False
    verification_date: Optional[datetime] = None

class UserBase(BaseModel):
    email: EmailStr
    phone: str
    full_name: str
    
class UserCreate(UserBase):
    password: str
    agreed_to_terms: bool = Field(..., description="User must agree to terms and conditions")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: str = Field(..., alias="_id")
    documents: List[UserDocument] = []
    is_active: bool = True
    is_admin: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: User

class UserCreate(UserBase):
    name: str  # Changed from full_name to match frontend
    email: EmailStr
    phone: str
    password: str
    agreed_to_terms: bool = Field(..., description="User must agree to terms and conditions")