import os
import uuid
from datetime import datetime
from fastapi import UploadFile
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

class CameraService:
    UPLOAD_DIR = "uploads/images"
    
    @staticmethod
    async def save_image(image: UploadFile, ride_id: str, location_type: str) -> Dict[str, Any]:
        """
        Save an uploaded image file
        Returns the saved image information
        """
        try:
            # Create upload directory if it doesn't exist
            os.makedirs(CameraService.UPLOAD_DIR, exist_ok=True)
            
            # Generate a unique filename
            extension = os.path.splitext(image.filename)[1]
            filename = f"{location_type}_{ride_id}_{uuid.uuid4().hex}{extension}"
            file_path = os.path.join(CameraService.UPLOAD_DIR, filename)
            
            # Save the file
            contents = await image.read()
            with open(file_path, "wb") as f:
                f.write(contents)
            
            # Return the saved image information
            return {
                "image_url": f"/uploads/images/{filename}",
                "filename": filename,
                "ride_id": ride_id,
                "location_type": location_type,
                "upload_time": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error saving image: {str(e)}")
            raise
