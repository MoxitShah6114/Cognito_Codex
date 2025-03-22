import os
from pydantic import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Application
    APP_NAME: str = os.getenv("APP_NAME", "EV Bike Rental System")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    
    # MongoDB
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "ev_bike_rental")
    
    # External APIs
    GOOGLE_MAPS_API_KEY: str = os.getenv("GOOGLE_MAPS_API_KEY", "")
    DIGILOCKER_API_KEY: str = os.getenv("DIGILOCKER_API_KEY", "")
    
    # MQTT Settings
    MQTT_BROKER: str = os.getenv("MQTT_BROKER", "mqtt.example.com")
    MQTT_PORT: int = int(os.getenv("MQTT_PORT", "1883"))
    MQTT_USER: str = os.getenv("MQTT_USER", "")
    MQTT_PASSWORD: str = os.getenv("MQTT_PASSWORD", "")

settings = Settings()
