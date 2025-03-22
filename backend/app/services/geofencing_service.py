from typing import Dict, List, Tuple, Any
from shapely.geometry import Point, Polygon
from app.core.database import Database
import logging

logger = logging.getLogger(__name__)

class GeofencingService:
    @staticmethod
    async def get_all_parking_zones():
        """Retrieve all parking zones from the database"""
        return await Database.db["parking_zones"].find().to_list(length=None)
    
    @staticmethod
    async def is_point_in_any_zone(lat: float, lng: float) -> Tuple[bool, Dict]:
        """
        Check if a point is within any parking zone
        Returns a tuple: (is_in_zone, zone_info)
        """
        point = Point(lng, lat)  # GeoJSON uses (lng, lat) order
        
        # Get all parking zones
        zones = await GeofencingService.get_all_parking_zones()
        
        for zone in zones:
            # Extract coordinates from GeoJSON polygon
            polygon_coords = zone["geometry"]["coordinates"][0]
            polygon = Polygon(polygon_coords)
            
            if polygon.contains(point):
                return True, zone
        
        return False, {}
    
    @staticmethod
    async def validate_parking_location(lat: float, lng: float) -> Dict:
        """
        Validate if a location is within allowed parking zones
        Returns validation result
        """
        is_valid, zone = await GeofencingService.is_point_in_any_zone(lat, lng)
        
        result = {
            "is_valid_parking": is_valid,
            "location": {
                "lat": lat,
                "lng": lng
            }
        }
        
        if is_valid:
            result["zone_name"] = zone.get("properties", {}).get("name", "Unknown Zone")
            result["zone_id"] = str(zone.get("_id", ""))
        
        return result
    
    @staticmethod
    async def create_zone(zone_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new parking zone"""
        result = await Database.db["parking_zones"].insert_one(zone_data)
        
        # Get the created zone
        created_zone = await Database.db["parking_zones"].find_one({"_id": result.inserted_id})
        # Convert ObjectId to string
        created_zone["_id"] = str(created_zone["_id"])
        
        return created_zone
