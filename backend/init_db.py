# init_db.py
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from bson import ObjectId

async def initialize_database():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["ev-bike-rental"]  # Match your database name from MongoDB Compass
    
    # Create sample admin user
    admin_user = {
        "_id": ObjectId(),
        "email": "admin@example.com",
        "password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "password"
        "full_name": "Admin User",
        "phone": "9876543210",
        "is_active": True,
        "is_admin": True,
        "documents": [],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Create sample regular user
    regular_user = {
        "_id": ObjectId(),
        "email": "user@example.com",
        "password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "password"
        "full_name": "Regular User",
        "phone": "1234567890",
        "is_active": True,
        "is_admin": False,
        "documents": [],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Sample parking zones (using geospatial data)
    parking_zones = [
        {
            "name": "Central Park Zone",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [77.5945, 12.9715],
                    [77.5945, 12.9815],
                    [77.6045, 12.9815],
                    [77.6045, 12.9715],
                    [77.5945, 12.9715]
                ]]
            },
            "properties": {
                "capacity": 20,
                "address": "Central Park Area"
            }
        },
        {
            "name": "Station Zone",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [77.6145, 12.9715],
                    [77.6145, 12.9815],
                    [77.6245, 12.9815],
                    [77.6245, 12.9715],
                    [77.6145, 12.9715]
                ]]
            },
            "properties": {
                "capacity": 15,
                "address": "Near Train Station"
            }
        }
    ]
    
    # Sample bikes
    bikes = [
        {
            "_id": ObjectId(),
            "bike_number": "EV001",
            "model": "Eco Rider 2000",
            "battery_level": 95,
            "status": "available",
            "location": {
                "type": "Point",
                "coordinates": [77.5975, 12.9735]
            },
            "is_active": True
        },
        {
            "_id": ObjectId(),
            "bike_number": "EV002",
            "model": "Eco Rider 2000",
            "battery_level": 87,
            "status": "available",
            "location": {
                "type": "Point",
                "coordinates": [77.6175, 12.9735]
            },
            "is_active": True
        }
    ]
    
    # Insert data
    print("Creating collections and inserting sample data...")
    
    # Users collection
    await db.users.insert_many([admin_user, regular_user])
    print("✅ Users created")
    
    # Parking zones
    await db.parking_zones.insert_many(parking_zones)
    print("✅ Parking zones created")
    
    # Bikes
    await db.bikes.insert_many(bikes)
    print("✅ Bikes created")
    
    # Create necessary indexes
    await db.users.create_index("email", unique=True)
    await db.parking_zones.create_index([("geometry", "2dsphere")])
    await db.bikes.create_index([("location", "2dsphere")])
    
    print("✅ All indexes created")
    print("Database initialization complete!")
    
    # Close the connection
    client.close()

if __name__ == "__main__":
    asyncio.run(initialize_database())
