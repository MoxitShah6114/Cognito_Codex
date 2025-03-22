import requests
from typing import List, Dict, Any
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class GoogleMapsService:
    API_BASE_URL = "https://maps.googleapis.com/maps/api"
    
    @staticmethod
    async def calculate_distance(source_coords: List[float], dest_coords: List[float]) -> float:
        """
        Calculate distance between two points using Google Maps Distance Matrix API
        Returns distance in kilometers
        """
        try:
            # Format coordinates for API request (lat,lng format)
            origin = f"{source_coords[1]},{source_coords[0]}"  # lat,lng
            destination = f"{dest_coords[1]},{dest_coords[0]}"  # lat,lng
            
            # Make API request
            response = requests.get(
                f"{GoogleMapsService.API_BASE_URL}/distancematrix/json",
                params={
                    "origins": origin,
                    "destinations": destination,
                    "mode": "driving",
                    "key": settings.GOOGLE_MAPS_API_KEY
                }
            )
            
            data = response.json()
            
            # Extract distance value
            if data["status"] == "OK":
                distance_meters = data["rows"][0]["elements"][0]["distance"]["value"]
                return distance_meters / 1000  # Convert to kilometers
            else:
                logger.error(f"Distance Matrix API error: {data.get('status', 'Unknown error')}")
                # Return an approximate distance as fallback (could use haversine formula)
                return 3.0  # Default placeholder distance
                
        except Exception as e:
            logger.error(f"Error calculating distance: {str(e)}")
            return 3.0  # Default placeholder distance
    
    @staticmethod
    async def verify_destination_reached(current_coords: List[float], dest_coords: List[float], threshold_meters: int = 100) -> bool:
        """
        Verify if the current location is close enough to the destination
        Returns True if within threshold, False otherwise
        """
        try:
            # Format coordinates (lat,lng format)
            current = f"{current_coords[1]},{current_coords[0]}"  # lat,lng
            destination = f"{dest_coords[1]},{dest_coords[0]}"  # lat,lng
            
            # Make API request to get distance between points
            response = requests.get(
                f"{GoogleMapsService.API_BASE_URL}/distancematrix/json",
                params={
                    "origins": current,
                    "destinations": destination,
                    "mode": "walking",  # Walking mode for more precise local distance
                    "key": settings.GOOGLE_MAPS_API_KEY
                }
            )
            
            data = response.json()
            
            # Check if user has reached destination
            if data["status"] == "OK":
                distance_meters = data["rows"][0]["elements"][0]["distance"]["value"]
                return distance_meters <= threshold_meters
            else:
                logger.error(f"Distance Matrix API error: {data.get('status', 'Unknown error')}")
                return False
                
        except Exception as e:
            logger.error(f"Error verifying destination: {str(e)}")
            return False
