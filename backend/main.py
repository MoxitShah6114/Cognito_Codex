import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi import status
import logging
import os
from datetime import datetime

from app.core.config import settings
from app.core.database import Database
from app.mqtt.client import MQTTClient
from app.mqtt.handlers import setup_mqtt_handlers

# Import API routers
from app.api.auth.router import router as auth_router
from app.api.digilocker.router import router as digilocker_router
from app.api.rides.router import router as rides_router
from app.api.payments.router import router as payments_router
from app.api.geofencing.router import router as geofencing_router
from app.api.camera.router import router as camera_router
from app.api.admin.router import router as admin_router

# Configure logging
os.makedirs("logs", exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler(f"logs/app_{datetime.now().strftime('%Y%m%d')}.log")
    ]
)

logger = logging.getLogger(__name__)

# Create FastAPI instance
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, set to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
os.makedirs("uploads/images", exist_ok=True)

# Mount static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Connect to the database on startup
@app.on_event("startup")
async def startup_db_client():
    await Database.connect_to_mongo()
    
    # Connect to MQTT broker
    mqtt_client = MQTTClient()
    mqtt_client.connect()
    
    # Set up MQTT handlers
    setup_mqtt_handlers()
    
    logger.info("Application startup complete")

# Close database connection on shutdown
@app.on_event("shutdown")
async def shutdown_db_client():
    await Database.close_mongo_connection()
    
    # Disconnect from MQTT broker
    mqtt_client = MQTTClient()
    mqtt_client.disconnect()
    
    logger.info("Application shutdown complete")

# Include API routers
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(digilocker_router, prefix="/api/digilocker", tags=["DigiLocker Integration"])
app.include_router(rides_router, prefix="/api/rides", tags=["Rides"])
app.include_router(payments_router, prefix="/api/payments", tags=["Payments"])
app.include_router(geofencing_router, prefix="/api/geofencing", tags=["Geofencing"])
app.include_router(camera_router, prefix="/api/camera", tags=["Camera"])
app.include_router(admin_router, prefix="/api/admin", tags=["Admin"])

@app.get("/")
def root():
    return {
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/api/docs"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


@app.get("/api/health")
def health_check():
    from datetime import datetime
    return {
        "status": "online",
        "timestamp": datetime.utcnow().isoformat(),
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION
    }

# Add these exception handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": str(exc)},
    )