from bson import ObjectId
from datetime import datetime
from typing import Dict, Optional, List, Any
from app.core.database import Database
from app.models.payment import PaymentCreate, PaymentStatus, PaymentMethod
import uuid
import logging

logger = logging.getLogger(__name__)

class PaymentService:
    @staticmethod
    async def get_payment(payment_id: str) -> Optional[Dict[str, Any]]:
        """Get a payment by ID"""
        payment = await Database.db["payments"].find_one({"_id": ObjectId(payment_id)})
        if payment:
            payment["_id"] = str(payment["_id"])
        return payment
    
    @staticmethod
    async def get_user_payments(user_id: str) -> List[Dict[str, Any]]:
        """Get all payments for a user"""
        cursor = Database.db["payments"].find({"user_id": user_id})
        payments = await cursor.to_list(length=None)
        
        # Convert ObjectId to string
        for payment in payments:
            payment["_id"] = str(payment["_id"])
            
        return payments
    
    @staticmethod
    async def create_payment(payment_data: PaymentCreate) -> Dict:
        """Create a new payment record"""
        payment_dict = payment_data.dict()
        payment_dict["status"] = PaymentStatus.PENDING
        payment_dict["created_at"] = datetime.utcnow()
        payment_dict["updated_at"] = datetime.utcnow()
        
        # Generate a transaction ID if it's an online payment
        if payment_dict["payment_method"] == PaymentMethod.ONLINE:
            payment_dict["transaction_id"] = f"TRANS-{uuid.uuid4().hex[:8].upper()}"
        
        # Insert into database
        result = await Database.db["payments"].insert_one(payment_dict)
        
        # Get the created payment
        created_payment = await Database.db["payments"].find_one({"_id": result.inserted_id})
        # Convert ObjectId to string
        created_payment["_id"] = str(created_payment["_id"])
        
        return created_payment
    
    @staticmethod
    async def process_online_payment(payment_id: str, payment_details: Dict) -> Dict:
        """Process an online payment"""
        # In a real implementation, this would integrate with a payment gateway
        
        payment = await PaymentService.get_payment(payment_id)
        
        if not payment:
            raise ValueError("Payment not found")
        
        if payment["status"] != PaymentStatus.PENDING:
            raise ValueError("Payment is not in PENDING status")
        
        if payment["payment_method"] != PaymentMethod.ONLINE:
            raise ValueError("Payment method is not ONLINE")
        
        # Update payment status
        now = datetime.utcnow()
        await Database.db["payments"].update_one(
            {"_id": ObjectId(payment_id)},
            {
                "$set": {
                    "status": PaymentStatus.COMPLETED,
                    "payment_time": now,
                    "payment_details": payment_details,
                    "updated_at": now
                }
            }
        )
        
        # Get the updated payment
        updated_payment = await PaymentService.get_payment(payment_id)
        return updated_payment
    
    @staticmethod
    async def complete_cash_payment(payment_id: str) -> Dict:
        """Mark a cash payment as completed"""
        payment = await PaymentService.get_payment(payment_id)
        
        if not payment:
            raise ValueError("Payment not found")
        
        if payment["status"] != PaymentStatus.PENDING:
            raise ValueError("Payment is not in PENDING status")
        
        if payment["payment_method"] != PaymentMethod.CASH:
            raise ValueError("Payment method is not CASH")
        
        # Update payment status
        now = datetime.utcnow()
        await Database.db["payments"].update_one(
            {"_id": ObjectId(payment_id)},
            {
                "$set": {
                    "status": PaymentStatus.COMPLETED,
                    "payment_time": now,
                    "updated_at": now
                }
            }
        )
        
        # Get the updated payment
        updated_payment = await PaymentService.get_payment(payment_id)
        return updated_payment
