from bson import ObjectId
from datetime import datetime
from typing import Dict, Optional, List, Any
from app.core.database import Database
from app.models.ride import RideCreate, RideStatus
from app.services.geofencing_service import GeofencingService
from app.services.google_maps_service import GoogleMapsService
import logging

logger = logging.getLogger(__name__)

class RideService:
    @staticmethod
    async def get_ride(ride_id: str) -> Optional[Dict[str, Any]]:
        """Get a ride by ID"""
        ride = await Database.db["rides"].find_one({"_id": ObjectId(ride_id)})
        if ride:
            ride["_id"] = str(ride["_id"])
        return ride
    
    @staticmethod
    async def get_user_rides(user_id: str) -> List[Dict[str, Any]]:
        """Get all rides for a user"""
        cursor = Database.db["rides"].find({"user_id": user_id})
        rides = await cursor.to_list(length=None)
        
        # Convert ObjectId to string
        for ride in rides:
            ride["_id"] = str(ride["_id"])
            
        return rides
    
    @staticmethod
    async def create_ride(ride_data: RideCreate) -> Dict:
        """Create a new ride"""
        ride_dict = ride_data.dict()
        ride_dict["status"] = RideStatus.SCHEDULED
        ride_dict["created_at"] = datetime.utcnow()
        ride_dict["updated_at"] = datetime.utcnow()
        
        # Insert into database
        result = await Database.db["rides"].insert_one(ride_dict)
        
        # Get the created ride
        created_ride = await Database.db["rides"].find_one({"_id": result.inserted_id})
        # Convert ObjectId to string
        created_ride["_id"] = str(created_ride["_id"])
        
        return created_ride
    
    @staticmethod
    async def start_ride(ride_id: str, bike_id: str, source_image_url: str) -> Dict:
        """Start a ride"""
        # Update ride status to ACTIVE
        now = datetime.utcnow()
        result = await Database.db["rides"].update_one(
            {"_id": ObjectId(ride_id), "status": RideStatus.SCHEDULED},
            {
                "$set": {
                    "status": RideStatus.ACTIVE,
                    "bike_id": bike_id,
                    "start_time": now,
                    "source_image_url": source_image_url,
                    "updated_at": now
                }
            }
        )
        
        if result.modified_count == 0:
            raise ValueError("Ride not found or not in SCHEDULED status")
        
        # Get the updated ride
        ride = await RideService.get_ride(ride_id)
        return ride
    
    @staticmethod
    async def complete_ride(
        ride_id: str, 
        destination_coords: List[float],  # [lng, lat]
        destination_image_url: str
    ) -> Dict:
        """Complete a ride and calculate fare"""
        ride = await RideService.get_ride(ride_id)
        
        if not ride:
            raise ValueError("Ride not found")
        
        if ride["status"] != RideStatus.ACTIVE:
            raise ValueError("Ride is not active")
        
        # Validate if destination has been reached
        has_reached = await GoogleMapsService.verify_destination_reached(
            destination_coords, 
            ride["destination"]["coordinates"]
        )
        
        if not has_reached:
            raise ValueError("Destination has not been reached yet")
        
        # Validate parking location
        dest_lat, dest_lng = destination_coords[1], destination_coords[0]
        parking_validation = await GeofencingService.validate_parking_location(dest_lat, dest_lng)
        
        # Calculate ride details
        start_time = ride["start_time"]
        end_time = datetime.utcnow()
        duration_seconds = (end_time - datetime.fromisoformat(start_time.replace('Z', '+00:00'))).total_seconds()
        
        # Calculate distance using Google Maps API
        source_coords = ride["source"]["coordinates"]
        distance_km = await GoogleMapsService.calculate_distance(
            source_coords, destination_coords
        )
        
        # Calculate fare
        base_fare = 20.0  # Base fare in rupees
        per_minute_rate = 0.5  # Rate per minute
        per_km_rate = 5.0  # Rate per kilometer
        
        fare_amount = base_fare + (duration_seconds / 60 * per_minute_rate) + (distance_km * per_km_rate)
        
        # Update ride with completion details
        await Database.db["rides"].update_one(
            {"_id": ObjectId(ride_id)},
            {
                "$set": {
                    "status": RideStatus.COMPLETED,
                    "end_time": end_time,
                    "destination.coordinates": destination_coords,
                    "destination_image_url": destination_image_url,
                    "distance_km": distance_km,
                    "fare_amount": fare_amount,
                    "updated_at": end_time
                }
            }
        )
        
        # Get the updated ride
        updated_ride = await RideService.get_ride(ride_id)
        
        # Check for invalid parking and create penalty if needed
        if not parking_validation["is_valid_parking"]:
            from app.services.penalty_service import PenaltyService
            await PenaltyService.create_penalty(
                user_id=ride["user_id"],
                ride_id=ride_id,
                penalty_type="invalid_parking",
                amount=100.0,
                description="Bike parked outside designated area"
            )
        
        return updated_ride
    
    @staticmethod
    async def cancel_ride(ride_id: str) -> Dict:
        """Cancel a ride"""
        now = datetime.utcnow()
        result = await Database.db["rides"].update_one(
            {"_id": ObjectId(ride_id), "status": RideStatus.SCHEDULED},
            {
                "$set": {
                    "status": RideStatus.CANCELLED,
                    "updated_at": now
                }
            }
        )
        
        if result.modified_count == 0:
            raise ValueError("Ride not found or cannot be cancelled")
        
        # Get the updated ride
        ride = await RideService.get_ride(ride_id)
        return ride
