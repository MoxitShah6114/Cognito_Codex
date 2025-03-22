from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    client = None
    db = None

    @classmethod
    async def connect_to_mongo(cls):
        try:
            cls.client = AsyncIOMotorClient(settings.MONGODB_URL)
            cls.db = cls.client[settings.MONGODB_DB_NAME]
            # Verify connection
            await cls.client.admin.command('ping')
            logger.info("Connected to MongoDB successfully")
        except ConnectionFailure:
            logger.error("Failed to connect to MongoDB")
            raise

    @classmethod
    async def close_mongo_connection(cls):
        if cls.client:
            cls.client.close()
            logger.info("MongoDB connection closed")
