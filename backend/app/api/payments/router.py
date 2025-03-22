from fastapi import APIRouter, HTTPException, Depends
from app.models.payment import PaymentCreate, Payment, PaymentProcess
from app.services.payment_service import PaymentService
from app.core.security import get_current_active_user
from typing import Dict, Any, List

router = APIRouter()

@router.post("", response_model=Payment)
async def create_payment(
    payment_data: PaymentCreate,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    # Ensure the user can only create payments for themselves
    if payment_data.user_id != current_user["_id"]:
        raise HTTPException(status_code=403, detail="Not authorized to create payments for other users")
    
    try:
        payment = await PaymentService.create_payment(payment_data)
        return payment
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("", response_model=List[Payment])
async def get_user_payments(current_user: Dict[str, Any] = Depends(get_current_active_user)):
    payments = await PaymentService.get_user_payments(current_user["_id"])
    return payments

@router.get("/{payment_id}", response_model=Payment)
async def get_payment(
    payment_id: str,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    payment = await PaymentService.get_payment(payment_id)
    
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    # Ensure the user can only view their own payments
    if payment["user_id"] != current_user["_id"] and not current_user.get("is_admin", False):
        raise HTTPException(status_code=403, detail="Not authorized to view this payment")
    
    return payment

@router.post("/{payment_id}/process-online", response_model=Payment)
async def process_online_payment(
    payment_id: str,
    data: PaymentProcess,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    payment = await PaymentService.get_payment(payment_id)
    
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    # Ensure the user can only process their own payments
    if payment["user_id"] != current_user["_id"]:
        raise HTTPException(status_code=403, detail="Not authorized to process this payment")
    
    try:
        updated_payment = await PaymentService.process_online_payment(
            payment_id,
            data.payment_details or {}
        )
        return updated_payment
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{payment_id}/complete-cash", response_model=Payment)
async def complete_cash_payment(
    payment_id: str,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    payment = await PaymentService.get_payment(payment_id)
    
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    # Only admins can mark cash payments as completed
    if not current_user.get("is_admin", False):
        raise HTTPException(status_code=403, detail="Not authorized to complete cash payments")
    
    try:
        updated_payment = await PaymentService.complete_cash_payment(payment_id)
        return updated_payment
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
