from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from app.services.geofencing_service import GeofencingService
from app.core.security import get_current_active_user, get_current_admin_user
from typing import Dict, Any, List

router = APIRouter()

class ParkingZone(BaseModel):
    name: str
    geometry: Dict[str, Any]
    properties: Dict[str, Any] = {}

@router.get("/validate")
async def validate_parking_location(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    result = await GeofencingService.validate_parking_location(lat, lng)
    return result

@router.get("/zones")
async def get_parking_zones(current_user: Dict[str, Any] = Depends(get_current_active_user)):
    zones = await GeofencingService.get_all_parking_zones()
    # Convert ObjectId to string
    for zone in zones:
        zone["_id"] = str(zone["_id"])
    return zones

@router.post("/zones")
async def create_parking_zone(
    zone_data: ParkingZone,
    current_user: Dict[str, Any] = Depends(get_current_admin_user)
):
    try:
        zone = await GeofencingService.create_zone(zone_data.dict())
        return zone
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
