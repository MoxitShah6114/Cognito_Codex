from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum

class PaymentMethod(str, Enum):
    CASH = "cash"
    ONLINE = "online"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class PaymentBase(BaseModel):
    ride_id: str
    user_id: str
    amount: float
    payment_method: PaymentMethod
    description: Optional[str] = None

class PaymentCreate(PaymentBase):
    pass

class PaymentProcess(BaseModel):
    transaction_id: Optional[str] = None
    payment_gateway: Optional[str] = None
    payment_details: Optional[Dict[str, Any]] = None

class Payment(PaymentBase):
    id: str = Field(..., alias="_id")
    status: PaymentStatus = PaymentStatus.PENDING
    transaction_id: Optional[str] = None
    payment_time: Optional[datetime] = None
    payment_details: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
