# EV Bike Rental System

A full-stack application for electric bike rentals with user authentication, document verification, geofencing, and IoT integration.

## Problem Statement
Current urban transportation systems face several challenges:

- Rising pollution from gas-powered vehicles
- Traffic congestion in city centers
- Limited last-mile connectivity options
- High cost of vehicle ownership
- Lack of secure and validated user onboarding for shared vehicles

Our EV Bike Rental system addresses these challenges by providing a clean, cost-effective rental service with streamlined user verification and geofencing capabilities.

## Solution Overview
We've developed a complete rental platform with:

- **User Authentication & Document Verification:** Secure sign-up with DigiLocker API integration to verify user documents.
- **Ride Management:** Source to destination ride tracking with photo verification.
- **Geofencing:** Designated parking zones enforced through geospatial technology.
- **Payment Integration:** Online and cash payment options.
- **Penalty Management:** Automated system for handling violations (invalid parking, damage, late returns).
- **Admin Dashboard:** For monitoring fleet, rides, and user activity.

## Technical Architecture

### Frontend (React)
- User interface built with React and Material-UI
- Google Maps integration for location services
- Camera integration for bike condition photos
- Responsive design for mobile and desktop

### Backend (Python/FastAPI)
- RESTful API with FastAPI framework
- MongoDB database for data storage
- JWT-based authentication
- Geospatial queries for geofencing
- DigiLocker API integration for document verification
- MQTT support for IoT device communication

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- MongoDB
- Git

### Backend Setup
Clone the repository:
```sh
git clone https://github.com/yourusername/ev-bike-rental.git
cd ev-bike-rental
```
Set up Python virtual environment:
```sh
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```
Install dependencies:
```sh
pip install -r requirements.txt
```
Configure environment variables:
Create a `.env` file in the backend directory with:
```sh
# Application
APP_NAME="EV Bike Rental System"
APP_VERSION="1.0.0"
SECRET_KEY="your-secret-key-here"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=60

# MongoDB
MONGODB_URL="mongodb://localhost:27017"
MONGODB_DB_NAME="ev_bike_rental"

# External APIs
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
DIGILOCKER_API_KEY="your-digilocker-api-key"
```
Initialize the database:
```sh
python init_db.py
```
Start the backend server:
```sh
python main.py
```
The server will run on `http://localhost:8000`

### Frontend Setup
Navigate to the frontend directory:
```sh
cd ../frontend
```
Install dependencies:
```sh
npm install
```
Start the development server:
```sh
npm start
```
The frontend will run on `http://localhost:3000`

## Key Features

### 1. User Authentication
- Secure signup and login
- Document verification via DigiLocker API
- JWT-based authentication

### 2. Ride Management
- Source and destination selection
- Real-time ride tracking
- Start and end ride with photo verification
- Fare calculation based on distance and time

### 3. Geofencing
- Designated parking zones
- Invalid parking detection
- Penalties for violations

### 4. Payment System
- Online payment integration
- Cash payment option
- Payment history

### 5. Admin Dashboard
- User management
- Ride monitoring
- Bike fleet management
- Penalty administration

## API Documentation
The API documentation is available at:

- **Swagger UI:** [http://localhost:8000/api/docs](http://localhost:8000/api/docs)
- **ReDoc:** [http://localhost:8000/api/redoc](http://localhost:8000/api/redoc)

### Key API endpoints:
#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

#### Document Verification
- `POST /api/digilocker/verify` - Verify user documents

#### Rides
- `POST /api/rides` - Create a new ride
- `GET /api/rides` - Get user rides
- `POST /api/rides/{ride_id}/start` - Start a ride
- `POST /api/rides/{ride_id}/complete` - Complete a ride

#### Payments
- `POST /api/payments` - Create payment
- `POST /api/payments/{payment_id}/process-online` - Process online payment

#### Geofencing
- `GET /api/geofencing/validate` - Validate parking location
- `GET /api/geofencing/zones` - Get all parking zones

## Technologies Used

### Frontend
- React.js
- Material-UI
- React Router
- Formik & Yup
- Axios
- Google Maps API
- WebRTC (for camera)

### Backend
- Python
- FastAPI
- Motor (async MongoDB driver)
- PyJWT
- Shapely (for geospatial)
- Paho-MQTT (for IoT)
- Google Maps Distance Matrix API

### Database
- MongoDB

## Contributors
- Moxit Shah
- Vatsal Chihla
- Rishi Patel
- Vivek Muliya
- Sharik Chahuan
