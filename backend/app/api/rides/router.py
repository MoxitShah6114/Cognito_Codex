from fastapi import APIRouter, HTTPException, Depends
from app.models.ride import RideCreate, Ride, RideStart, RideComplete
from app.services.ride_service import RideService
from app.core.security import get_current_active_user
from typing import Dict, Any, List

router = APIRouter()

@router.post("", response_model=Ride)
async def create_ride(
    ride_data: RideCreate,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    # Ensure the user can only create rides for themselves
    if ride_data.user_id != current_user["_id"]:
        raise HTTPException(status_code=403, detail="Not authorized to create rides for other users")
    
    try:
        ride = await RideService.create_ride(ride_data)
        return ride
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("", response_model=List[Ride])
async def get_user_rides(current_user: Dict[str, Any] = Depends(get_current_active_user)):
    rides = await RideService.get_user_rides(current_user["_id"])
    return rides

@router.get("/{ride_id}", response_model=Ride)
async def get_ride(
    ride_id: str,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    ride = await RideService.get_ride(ride_id)
    
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    
    # Ensure the user can only view their own rides
    if ride["user_id"] != current_user["_id"] and not current_user.get("is_admin", False):
        raise HTTPException(status_code=403, detail="Not authorized to view this ride")
    
    return ride

@router.post("/{ride_id}/start", response_model=Ride)
async def start_ride(
    ride_id: str,
    data: RideStart,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    ride = await RideService.get_ride(ride_id)
    
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    
    # Ensure the user can only start their own rides
    if ride["user_id"] != current_user["_id"]:
        raise HTTPException(status_code=403, detail="Not authorized to start this ride")
    
    try:
        updated_ride = await RideService.start_ride(
            ride_id,
            data.bike_id,
            data.source_image_url
        )
        return updated_ride
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{ride_id}/complete", response_model=Ride)
async def complete_ride(
    ride_id: str,
    data: RideComplete,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    ride = await RideService.get_ride(ride_id)
    
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    
    # Ensure the user can only complete their own rides
    if ride["user_id"] != current_user["_id"]:
        raise HTTPException(status_code=403, detail="Not authorized to complete this ride")
    
    try:
        updated_ride = await RideService.complete_ride(
            ride_id,
            data.destination_coordinates,
            data.destination_image_url
        )
        return updated_ride
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{ride_id}/cancel", response_model=Ride)
async def cancel_ride(
    ride_id: str,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    ride = await RideService.get_ride(ride_id)
    
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    
    # Ensure the user can only cancel their own rides
    if ride["user_id"] != current_user["_id"]:
        raise HTTPException(status_code=403, detail="Not authorized to cancel this ride")
    
    try:
        updated_ride = await RideService.cancel_ride(ride_id)
        return updated_ride
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
