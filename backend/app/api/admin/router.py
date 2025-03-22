from fastapi import APIRouter, HTTPException, Depends, Query
from app.core.security import get_current_admin_user
from app.services.ride_service import RideService
from app.services.payment_service import PaymentService
from app.services.auth_service import AuthService
from typing import Dict, Any, List, Optional

router = APIRouter()

@router.get("/users")
async def get_all_users(
    current_user: Dict[str, Any] = Depends(get_current_admin_user),
    skip: int = 0,
    limit: int = 100
):
    users = await Auth.db["users"].find().skip(skip).limit(limit).to_list(length=None)
    
    # Convert ObjectId to string
    for user in users:
        user["_id"] = str(user["_id"])
        # Remove password hash
        if "password" in user:
            del user["password"]
    
    return users

@router.get("/rides")
async def get_all_rides(
    current_user: Dict[str, Any] = Depends(get_current_admin_user),
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None
):
    # Build query
    query = {}
    if status:
        query["status"] = status
    
    rides = await Database.db["rides"].find(query).skip(skip).limit(limit).to_list(length=None)
    
    # Convert ObjectId to string
    for ride in rides:
        ride["_id"] = str(ride["_id"])
    
    return rides

@router.get("/payments")
async def get_all_payments(
    current_user: Dict[str, Any] = Depends(get_current_admin_user),
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None
):
    # Build query
    query = {}
    if status:
        query["status"] = status
    
    payments = await Database.db["payments"].find(query).skip(skip).limit(limit).to_list(length=None)
    
    # Convert ObjectId to string
    for payment in payments:
        payment["_id"] = str(payment["_id"])
    
    return payments

@router.get("/penalties")
async def get_all_penalties(
    current_user: Dict[str, Any] = Depends(get_current_admin_user),
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None
):
    # Build query
    query = {}
    if status:
        query["status"] = status
    
    penalties = await Database.db["penalties"].find(query).skip(skip).limit(limit).to_list(length=None)
    
    # Convert ObjectId to string
    for penalty in penalties:
        penalty["_id"] = str(penalty["_id"])
    
    return penalties

@router.get("/dashboard")
async def get_dashboard_stats(current_user: Dict[str, Any] = Depends(get_current_admin_user)):
    # Get counts
    user_count = await Database.db["users"].count_documents({})
    active_rides = await Database.db["rides"].count_documents({"status": "active"})
    completed_rides = await Database.db["rides"].count_documents({"status": "completed"})
    total_revenue = await Database.db["payments"].aggregate([
        {"$match": {"status": "completed"}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]).to_list(length=1)
    
    # Calculate revenue
    revenue = 0
    if total_revenue:
        revenue = total_revenue[0].get("total", 0)
    
    return {
        "user_count": user_count,
        "active_rides": active_rides,
        "completed_rides": completed_rides,
        "total_revenue": revenue
    }
