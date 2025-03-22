const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bike = require('../models/Bike');
const User = require('../models/User');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample bikes
const bikes = [
  {
    model: 'EV Sport 2000',
    bikeNumber: 'EVB-001',
    description: 'High-performance electric bike with extended range',
    batteryLevel: 85,
    range: 120,
    status: 'available',
    pricePerMinute: 2,
    pricePerKm: 8,
    baseFare: 20,
    imageUrl: 'https://via.placeholder.com/300x140?text=EV+Sport',
    location: {
      type: 'Point',
      coordinates: [77.2090, 28.6139], // Delhi
      address: 'Connaught Place, New Delhi',
      formattedAddress: 'Connaught Place, New Delhi, 110001',
      city: 'New Delhi',
      state: 'Delhi',
      zipcode: '110001',
      country: 'IN'
    }
  },
  {
    model: 'EV City Cruiser',
    bikeNumber: 'EVB-002',
    description: 'Comfortable electric bike for city commuting',
    batteryLevel: 92,
    range: 150,
    status: 'available',
    pricePerMinute: 1.5,
    pricePerKm: 7,
    baseFare: 15,
    imageUrl: 'https://via.placeholder.com/300x140?text=EV+Cruiser',
    location: {
      type: 'Point',
      coordinates: [77.2200, 28.6330], // Delhi
      address: 'Lajpat Nagar, New Delhi',
      formattedAddress: 'Lajpat Nagar, New Delhi, 110024',
      city: 'New Delhi',
      state: 'Delhi',
      zipcode: '110024',
      country: 'IN'
    }
  },
  {
    model: 'EV Commuter Pro',
    bikeNumber: 'EVB-003',
    description: 'Efficient electric bike for daily commuters',
    batteryLevel: 78,
    range: 100,
    status: 'available',
    pricePerMinute: 1.8,
    pricePerKm: 7.5,
    baseFare: 18,
    imageUrl: 'https://via.placeholder.com/300x140?text=EV+Commuter',
    location: {
      type: 'Point',
      coordinates: [77.1982, 28.6381], // Delhi
      address: 'Karol Bagh, New Delhi',
      formattedAddress: 'Karol Bagh, New Delhi, 110005',
      city: 'New Delhi',
      state: 'Delhi',
      zipcode: '110005',
      country: 'IN'
    }
  }
];

// Sample admin user
const admin = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'password123',
  phone: '1234567890',
  role: 'admin',
  isDocumentVerified: true
};

// Import data into DB
const importData = async () => {
  try {
    await Bike.deleteMany();
    await Bike.insertMany(bikes);
    
    // Create admin user
    const existingAdmin = await User.findOne({ email: admin.email });
    if (!existingAdmin) {
      await User.create(admin);
      console.log('Admin user created');
    }
    
    console.log('Data Imported!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete all data
const deleteData = async () => {
  try {
    await Bike.deleteMany();
    
    console.log('Data Destroyed!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}