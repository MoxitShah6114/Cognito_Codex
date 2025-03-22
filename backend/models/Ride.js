const mongoose = require('mongoose');

const rideSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bike: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bike',
    required: true
  },
  source: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: {
      type: String,
      required: [true, 'Please add a source address']
    }
  },
  destination: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: {
      type: String,
      required: [true, 'Please add a destination address']
    }
  },
  startTime: {
    type: Date,
    default: null
  },
  endTime: {
    type: Date,
    default: null
  },
  distance: {
    type: Number,  // in km
    default: 0
  },
  duration: {
    type: Number,  // in minutes
    default: 0
  },
  status: {
    type: String,
    enum: ['booked', 'active', 'completed', 'cancelled'],
    default: 'booked'
  },
  fare: {
    baseFare: {
      type: Number,
      default: 0
    },
    distanceCharge: {
      type: Number,
      default: 0
    },
    timeCharge: {
      type: Number,
      default: 0
    },
    taxes: {
      type: Number,
      default: 0
    },
    totalFare: {
      type: Number,
      default: 0
    }
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['card', 'upi', 'cash', 'wallet'],
      default: 'card'
    },
    transactionId: {
      type: String,
      default: null
    }
  },
  startImage: {
    type: String,
    default: null
  },
  endImage: {
    type: String,
    default: null
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  review: {
    type: String,
    default: null
  },
  hasPenalty: {
    type: Boolean,
    default: false
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

// Virtual field for ride date in formatted form
rideSchema.virtual('date').get(function() {
  return this.startTime ? new Date(this.startTime).toISOString().split('T')[0] : 
         this.createdAt.toISOString().split('T')[0];
});

// Virtual field for ride time in formatted form
rideSchema.virtual('time').get(function() {
  return this.startTime ? 
         new Date(this.startTime).toLocaleTimeString('en-US', { 
           hour: '2-digit', 
           minute: '2-digit' 
         }) : '';
});

// Virtual field for duration in minutes
rideSchema.virtual('durationMinutes').get(function() {
  if (!this.startTime || !this.endTime) return 0;
  
  const durationMs = new Date(this.endTime) - new Date(this.startTime);
  return Math.round(durationMs / (1000 * 60));
});

module.exports = mongoose.model('Ride', rideSchema);