from app.mqtt.client import MQTTClient
from app.core.database import Database
from bson import ObjectId
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

async def handle_bike_status(topic: str, payload: dict):
    """Handle bike status updates"""
    try:
        # Extract bike ID from topic
        # Assuming topic format: bikes/{bike_id}/status
        bike_id = topic.split('/')[1]
        
        # Update bike status in database
        if "location" in payload:
            # Update bike location
            await Database.db["bikes"].update_one(
                {"_id": ObjectId(bike_id)},
                {
                    "$set": {
                        "location": {
                            "type": "Point",
                            "coordinates": [
                                payload["location"]["longitude"],
                                payload["location"]["latitude"]
                            ]
                        },
                        "battery_level": payload.get("battery_level"),
                        "last_update": datetime.utcnow()
                    }
                },
                upsert=True
            )
            
        logger.info(f"Updated status for bike {bike_id}")
            
    except Exception as e:
        logger.error(f"Error handling bike status: {str(e)}")

async def handle_bike_alarm(topic: str, payload: dict):
    """Handle bike alarm events"""
    try:
        # Extract bike ID from topic
        bike_id = topic.split('/')[1]
        
        # Get ride information using bike ID
        ride = await Database.db["rides"].find_one(
            {"bike_id": bike_id, "status": "active"}
        )
        
        if ride:
            # Create an incident record
            await Database.db["incidents"].insert_one({
                "bike_id": bike_id,
                "ride_id": str(ride["_id"]),
                "user_id": ride["user_id"],
                "incident_type": payload.get("type", "unknown"),
                "description": payload.get("description", "Alarm triggered"),
                "location": {
                    "type": "Point",
                    "coordinates": [
                        payload.get("longitude", 0),
                        payload.get("latitude", 0)
                    ]
                },
                "created_at": datetime.utcnow()
            })
            
            logger.warning(f"Alarm triggered for bike {bike_id}")
            
    except Exception as e:
        logger.error(f"Error handling bike alarm: {str(e)}")

def setup_mqtt_handlers():
    """Set up MQTT topic handlers"""
    client = MQTTClient()
    
    # Subscribe to topics
    client.subscribe("bikes/+/status", handle_bike_status)
    client.subscribe("bikes/+/alarm", handle_bike_alarm)
