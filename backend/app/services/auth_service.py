from bson import ObjectId
from app.core.database import Database
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.user import UserCreate, User, UserLogin
from datetime import timedelta
from app.core.config import settings
from typing import Optional, Dict, Any

class AuthService:
    @staticmethod
    async def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
        return await Database.db["users"].find_one({"email": email})
    
    @staticmethod
    async def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
        return await Database.db["users"].find_one({"_id": ObjectId(user_id)})
    
    @staticmethod
    async def create_user(user_data: UserCreate) -> Dict[str, Any]:
        # Check if user already exists
        existing_user = await AuthService.get_user_by_email(user_data.email)
        if existing_user:
            raise ValueError("User with this email already exists")
            
        user_dict = user_data.dict()
        # Hash the password
        user_dict["password"] = get_password_hash(user_dict["password"])
        # Remove agreed_to_terms from database storage
        agreed = user_dict.pop("agreed_to_terms")
        
        if not agreed:
            raise ValueError("User must agree to terms and conditions")
        
        # Add empty documents list
        user_dict["documents"] = []
        user_dict["is_active"] = True
        user_dict["is_admin"] = False
        user_dict["created_at"] = user_dict["updated_at"] = user_dict.get("created_at", None) or user_dict.get("updated_at", None) or user_dict.get(datetime.utcnow())
        
        # Insert into database
        result = await Database.db["users"].insert_one(user_dict)
        
        # Get the created user
        created_user = await Database.db["users"].find_one({"_id": result.inserted_id})
        # Convert ObjectId to string for the response
        created_user["_id"] = str(created_user["_id"])
        
        return created_user
    
    @staticmethod
    async def authenticate_user(email: str, password: str) -> Optional[Dict[str, Any]]:
        user = await AuthService.get_user_by_email(email)
        if not user:
            return None
        if not verify_password(password, user["password"]):
            return None
        # Convert ObjectId to string
        user["_id"] = str(user["_id"])
        return user
    
    @staticmethod
    async def login(user_data: UserLogin) -> Optional[Dict[str, Any]]:
        user = await AuthService.authenticate_user(user_data.email, user_data.password)
        if not user:
            return None
            
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["_id"]}, expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }

    @staticmethod
    async def create_user(user_data: UserCreate):
        user_dict = user_data.dict()
        # Hash the password
        user_dict["password"] = get_password_hash(user_dict["password"])
        # Remove agreed_to_terms from database storage
        agreed = user_dict.pop("agreed_to_terms")
        
        # Rename 'name' to 'full_name' for database consistency
        if "name" in user_dict:
            user_dict["full_name"] = user_dict.pop("name")
        
        # Add empty documents list
        user_dict["documents"] = []
        user_dict["is_active"] = True
        user_dict["is_admin"] = False
        user_dict["created_at"] = datetime.utcnow()
        user_dict["updated_at"] = datetime.utcnow()
        
        # Insert into database
        result = await Database.db["users"].insert_one(user_dict)
        
        # Get the created user
        created_user = await Database.db["users"].find_one({"_id": result.inserted_id})
        # Convert ObjectId to string for the response
        created_user["_id"] = str(created_user["_id"])
        
        return created_user