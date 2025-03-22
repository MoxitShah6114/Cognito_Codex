from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from app.services.camera_service import CameraService
from app.core.security import get_current_active_user
from typing import Dict, Any

router = APIRouter()

@router.post("/upload")
async def upload_image(
    image: UploadFile = File(...),
    ride_id: str = Form(...),
    location_type: str = Form(...),
    current_user: Dict[str, Any] = Depends(get_current_active_user)
):
    try:
        # Check if location_type is valid
        if location_type not in ["source", "destination"]:
            raise HTTPException(status_code=400, detail="Invalid location_type. Must be 'source' or 'destination'")
        
        # Save the image
        result = await CameraService.save_image(image, ride_id, location_type)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
