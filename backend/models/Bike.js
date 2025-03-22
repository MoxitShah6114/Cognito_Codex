const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

const bikeSchema = mongoose.Schema({
  model: {
    type: String,
    required: [true, 'Please add a bike model'],
    trim: true
  },
  bikeNumber: {
    type: String,
    required: [true, 'Please add a bike number'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  batteryLevel: {
    type: Number,
    min: 0,
    max: 100,
    required: [true, 'Please add current battery level']
  },
  range: {
    type: Number,
    required: [true, 'Please add estimated range in km']
  },
  status: {
    type: String,
    enum: ['available', 'in-use', 'maintenance', 'charging', 'disabled'],
    default: 'available'
  },
  pricePerMinute: {
    type: Number,
    required: [true, 'Please add price per minute']
  },
  pricePerKm: {
    type: Number,
    required: [true, 'Please add price per km']
  },
  baseFare: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String,
    default: 'no-photo.jpg'
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    address: String,
    formattedAddress: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  lastUsed: {
    type: Date
  },
  lastMaintenance: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Geocode & create location field
bikeSchema.pre('save', async function(next) {
  if (this.isModified('location.address')) {
    const loc = await geocoder.geocode(this.location.address);
    
    this.location = {
      type: 'Point',
      coordinates: [loc[0].longitude, loc[0].latitude],
      formattedAddress: loc[0].formattedAddress,
      city: loc[0].city,
      state: loc[0].stateCode,
      zipcode: loc[0].zipcode,
      country: loc[0].countryCode
    };
  }
  next();
});

// Virtual for active status
bikeSchema.virtual('isActive').get(function() {
  return this.batteryLevel > 10 && ['available', 'charging'].includes(this.status);
});

module.exports = mongoose.model('Bike', bikeSchema);