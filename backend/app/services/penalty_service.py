from bson import ObjectId
from datetime import datetime
from typing import Dict, Optional, List, Any
from app.core.database import Database
from app.models.penalty import PenaltyCreate, PenaltyStatus, PenaltyType
import logging

logger = logging.getLogger(__name__)

class PenaltyService:
    @staticmethod
    async def get_penalty(penalty_id: str) -> Optional[Dict[str, Any]]:
        """Get a penalty by ID"""
        penalty = await Database.db["penalties"].find_one({"_id": ObjectId(penalty_id)})
        if penalty:
            penalty["_id"] = str(penalty["_id"])
        return penalty
    
    @staticmethod
    async def get_user_penalties(user_id: str) -> List[Dict[str, Any]]:
        """Get all penalties for a user"""
        cursor = Database.db["penalties"].find({"user_id": user_id})
        penalties = await cursor.to_list(length=None)
        
        # Convert ObjectId to string
        for penalty in penalties:
            penalty["_id"] = str(penalty["_id"])
            
        return penalties
    
    @staticmethod
    async def create_penalty(
        user_id: str,
        ride_id: str,
        penalty_type: str,
        amount: float,
        description: str
    ) -> Dict[str, Any]:
        """Create a new penalty"""
        penalty_data = {
            "user_id": user_id,
            "ride_id": ride_id,
            "penalty_type": penalty_type,
            "amount": amount,
            "description": description,
            "status": PenaltyStatus.PENDING,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert into database
        result = await Database.db["penalties"].insert_one(penalty_data)
        
        # Get the created penalty
        created_penalty = await Database.db["penalties"].find_one({"_id": result.inserted_id})
        # Convert ObjectId to string
        created_penalty["_id"] = str(created_penalty["_id"])
        
        return created_penalty
    
    @staticmethod
    async def pay_penalty(penalty_id: str, payment_id: str) -> Dict[str, Any]:
        """Mark a penalty as paid"""
        now = datetime.utcnow()
        result = await Database.db["penalties"].update_one(
            {"_id": ObjectId(penalty_id), "status": PenaltyStatus.PENDING},
            {
                "$set": {
                    "status": PenaltyStatus.PAID,
                    "payment_id": payment_id,
                    "updated_at": now
                }
            }
        )
        
        if result.modified_count == 0:
            raise ValueError("Penalty not found or not in PENDING status")
        
        # Get the updated penalty
        penalty = await PenaltyService.get_penalty(penalty_id)
        return penalty
    
    @staticmethod
    async def dispute_penalty(penalty_id: str, dispute_reason: str) -> Dict[str, Any]:
        """Mark a penalty as disputed"""
        now = datetime.utcnow()
        result = await Database.db["penalties"].update_one(
            {"_id": ObjectId(penalty_id), "status": PenaltyStatus.PENDING},
            {
                "$set": {
                    "status": PenaltyStatus.DISPUTED,
                    "dispute_reason": dispute_reason,
                    "updated_at": now
                }
            }
        )
        
        if result.modified_count == 0:
            raise ValueError("Penalty not found or not in PENDING status")
        
        # Get the updated penalty
        penalty = await PenaltyService.get_penalty(penalty_id)
        return penalty
