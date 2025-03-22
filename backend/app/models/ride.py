from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from enum import Enum

class RideStatus(str, Enum):
    SCHEDULED = "scheduled"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Location(BaseModel):
    type: str = "Point"
    coordinates: List[float] = Field(..., description="[longitude, latitude]")
    address: Optional[str] = None

class RideBase(BaseModel):
    source: Location
    destination: Location
    
class RideCreate(RideBase):
    user_id: str
    
class RideStart(BaseModel):
    bike_id: str
    source_image_url: str

class RideComplete(BaseModel):
    destination_coordinates: List[float]
    destination_image_url: str

class Ride(RideBase):
    id: str = Field(..., alias="_id")
    user_id: str
    bike_id: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    status: RideStatus = RideStatus.SCHEDULED
    distance_km: Optional[float] = None
    fare_amount: Optional[float] = None
    source_image_url: Optional[str] = None
    destination_image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
