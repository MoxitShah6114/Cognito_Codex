from fastapi import APIRouter, HTTPException, Depends, status
from app.models.user import UserCreate, UserLogin, TokenResponse, User
from app.services.auth_service import AuthService
from app.core.security import get_current_active_user
from typing import Dict, Any

router = APIRouter()

@router.post("/register", response_model=User)
async def register(user_data: UserCreate):
    try:
        user = await AuthService.create_user(user_data)
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=TokenResponse)
async def login(user_data: UserLogin):
    result = await AuthService.login(user_data)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return result

@router.get("/me", response_model=User)
async def get_current_user(current_user: Dict[str, Any] = Depends(get_current_active_user)):
    return current_user

@router.post("/register", response_model=User)
async def register(user_data: UserCreate):
    try:
        # Validate terms acceptance
        if not user_data.agreed_to_terms:
            raise HTTPException(status_code=400, detail="Terms and conditions must be accepted")
            
        user = await AuthService.create_user(user_data)
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))