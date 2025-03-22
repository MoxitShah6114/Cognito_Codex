from fastapi import APIRouter, HTTPException, Depends
from app.models.document import DocumentVerifyRequest, DocumentVerifyResponse
from app.services.digilocker_service import DigiLockerService
from app.core.security import get_current_active_user
from typing import Dict, Any

router = APIRouter()

@router.post("/verify", response_model=DocumentVerifyResponse)
async def verify_document(
    request: DocumentVerifyRequest,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    # Ensure the user can only verify their own documents
    if request.user_id != current_user["_id"]:
        raise HTTPException(status_code=403, detail="Not authorized to verify documents for this user")
    
    result = await DigiLockerService.verify_document(
        request.user_id,
        request.doc_type,
        request.doc_data
    )
    
    return result

@router.post("/verify", response_model=DocumentVerifyResponse)
async def verify_document(
    request: DocumentVerifyRequest,
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    # Ensure the user can only verify their own documents
    if request.user_id != current_user["_id"]:
        raise HTTPException(status_code=403, detail="Not authorized to verify documents for this user")
    
    result = await DigiLockerService.verify_document(
        request.user_id,
        request.doc_type,
        request.doc_data
    )
    
    return result