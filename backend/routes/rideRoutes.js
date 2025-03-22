const express = require('express');
const { 
  getRides, 
  getRide, 
  createRide, 
  startRide, 
  endRide, 
  rateRide 
} = require('../controllers/rideController');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

router.get('/', protect, getRides);
router.get('/:id', protect, getRide);
router.post('/', protect, createRide);
router.put('/:id/start', protect, startRide);
router.put('/:id/end', protect, endRide);
router.put('/:id/rate', protect, rateRide);

// Upload route for ride images
router.post('/:id/image', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const filePath = req.file.path.replace(/\\/g, '/'); // Normalize path for windows

    res.status(200).json({
      success: true,
      data: {
        filePath,
        fileName: req.file.filename
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during file upload'
    });
  }
});

module.exports = router;