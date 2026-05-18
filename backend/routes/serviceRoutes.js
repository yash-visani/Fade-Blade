const express = require('express');
const router = express.Router();
const { getServices, createService, deleteService } = require('../controllers/serviceController');
const { protect, admin } = require('../middleware/authMiddleware');

// Anyone can view services (GET)
// Only Admins can add services (POST)
router.route('/')
  .get(getServices)
  .post(protect, admin, createService);

// Only Admins can delete a specific service (DELETE)
router.route('/:id')
  .delete(protect, admin, deleteService);

module.exports = router;