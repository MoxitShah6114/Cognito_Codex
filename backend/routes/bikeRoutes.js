const express = require('express');
const { 
  getBikes, 
  getBike, 
  getAvailableBikes
} = require('../controllers/bikeController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/', getBikes);
router.get('/available', getAvailableBikes);
router.get('/:id', getBike);

module.exports = router;