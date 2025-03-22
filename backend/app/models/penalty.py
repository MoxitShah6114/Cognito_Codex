from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from enum import Enum

class PenaltyType(str, Enum):
    INVALID_PARKING = "invalid_parking"
    DAMAGE = "damage"
    LATE_RETURN = "late_return"
    ACCIDENT = "accident"
    OTHER = "other"

class PenaltyStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    DISPUTED = "disputed"
    WAIVED = "waived"

class PenaltyBase(BaseModel):
    user_id: str
    ride_id: str
    penalty_type: PenaltyType
    amount: float
    description: str

class PenaltyCreate(PenaltyBase):
    pass

class Penalty(PenaltyBase):
    id: str = Field(..., alias="_id")
    status: PenaltyStatus = PenaltyStatus.PENDING
    payment_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
