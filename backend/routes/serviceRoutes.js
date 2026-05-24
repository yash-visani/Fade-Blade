const express = require('express');
const router = express.Router();

const { 
  getServices, 
  createService, 
  updateService, 
  deleteService 
} = require('../controllers/serviceController');

const { protect, admin } = require('../middleware/authMiddleware');

// === PUBLIC ROUTE ===
// Anyone can view the menu on the booking page
router.get('/', getServices);

// === ADMIN ROUTES ===
// Only the Admin can add, edit, or delete items
router.post('/', protect, admin, createService);
router.put('/:id', protect, admin, updateService);
router.delete('/:id', protect, admin, deleteService);

module.exports = router;