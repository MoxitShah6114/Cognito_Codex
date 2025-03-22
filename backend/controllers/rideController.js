const Ride = require('../models/Ride');
const Bike = require('../models/Bike');
const User = require('../models/User');

// @desc    Get all rides for current user
// @route   GET /api/rides
// @access  Private
exports.getRides = async (req, res) => {
  try {
    const rides = await Ride.find({ user: req.user.id })
      .populate('bike', 'model bikeNumber imageUrl')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: rides.length,
      data: rides
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single ride
// @route   GET /api/rides/:id
// @access  Private
exports.getRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('bike', 'model bikeNumber imageUrl batteryLevel pricePerMinute pricePerKm')
      .populate('user', 'name email phone');

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: `Ride not found with id of ${req.params.id}`
      });
    }

    // Make sure user owns ride or is admin
    if (ride.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to access this ride`
      });
    }

    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new ride
// @route   POST /api/rides
// @access  Private
exports.createRide = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // Check if user is verified
    const user = await User.findById(req.user.id);
    if (!user.isDocumentVerified) {
      return res.status(403).json({
        success: false,
        message: 'User documents need to be verified before booking a ride'
      });
    }

    // Check if bike exists and is available
    const bike = await Bike.findById(req.body.bike);
    if (!bike) {
      return res.status(404).json({
        success: false,
        message: 'Bike not found'
      });
    }

    if (bike.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Bike is not available for booking'
      });
    }

    // Create ride
    const ride = await Ride.create(req.body);

    // Update bike status to in-use
    await Bike.findByIdAndUpdate(req.body.bike, { status: 'in-use' });

    res.status(201).json({
      success: true,
      data: ride
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Start ride
// @route   PUT /api/rides/:id/start
// @access  Private
exports.startRide = async (req, res) => {
  try {
    let ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: `Ride not found with id of ${req.params.id}`
      });
    }

    // Check if user owns the ride
    if (ride.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to start this ride`
      });
    }

    // Check if ride is in booked status
    if (ride.status !== 'booked') {
      return res.status(400).json({
        success: false,
        message: `Ride cannot be started as it is in ${ride.status} status`
      });
    }

    // Update ride status and start time
    ride = await Ride.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'active', 
        startTime: new Date(),
        startImage: req.body.startImage || null 
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    End ride
// @route   PUT /api/rides/:id/end
// @access  Private
exports.endRide = async (req, res) => {
  try {
    let ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: `Ride not found with id of ${req.params.id}`
      });
    }

    // Check if user owns the ride
    if (ride.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to end this ride`
      });
    }

    // Check if ride is in active status
    if (ride.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `Ride cannot be ended as it is in ${ride.status} status`
      });
    }

    // Get bike details for fare calculation
    const bike = await Bike.findById(ride.bike);
    
    // Calculate ride end time, duration and distance
    const endTime = new Date();
    const startTime = new Date(ride.startTime);
    const durationMs = endTime - startTime;
    const durationMinutes = Math.round(durationMs / (1000 * 60));
    
    // For distance, in a real app we would use GPS tracking data
    // Here we're simulating with a random distance based on duration
    const distance = parseFloat((durationMinutes * 0.3).toFixed(1)); // 0.3 km per minute

    // Calculate fare
    const baseFare = bike.baseFare;
    const distanceCharge = distance * bike.pricePerKm;
    const timeCharge = durationMinutes * bike.pricePerMinute;
    const taxes = (baseFare + distanceCharge + timeCharge) * 0.18; // 18% tax
    const totalFare = baseFare + distanceCharge + timeCharge + taxes;

    // Update ride with end details
    ride = await Ride.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'completed', 
        endTime,
        distance,
        duration: durationMinutes,
        'fare.baseFare': baseFare,
        'fare.distanceCharge': distanceCharge,
        'fare.timeCharge': timeCharge,
        'fare.taxes': taxes,
        'fare.totalFare': totalFare,
        endImage: req.body.endImage || null
      },
      { new: true, runValidators: true }
    );

    // Update bike status to available
    await Bike.findByIdAndUpdate(ride.bike, { 
      status: 'available',
      lastUsed: new Date(),
      // Reduce battery level based on distance
      batteryLevel: Math.max(0, bike.batteryLevel - (distance * 2)) // 2% battery per km
    });

    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Rate a ride
// @route   PUT /api/rides/:id/rate
// @access  Private
exports.rateRide = async (req, res) => {
  try {
    const { rating, review } = req.body;

    if (!rating) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a rating'
      });
    }

    let ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: `Ride not found with id of ${req.params.id}`
      });
    }

    // Check if user owns the ride
    if (ride.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to rate this ride`
      });
    }

    // Check if ride is completed
    if (ride.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: `Ride cannot be rated as it is in ${ride.status} status`
      });
    }

    // Update ride with rating
    ride = await Ride.findByIdAndUpdate(
      req.params.id,
      { rating, review },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};