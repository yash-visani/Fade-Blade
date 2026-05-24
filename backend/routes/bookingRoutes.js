const express = require('express');
const router = express.Router();

const { 
  createAppointment, 
  getAvailableSlots, 
  getUserAppointments,
  cancelAppointment,
  getAllAppointments,
  updateAppointmentStatus
} = require('../controllers/bookingController');

const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/available-slots', getAvailableSlots);

// Protected Customer routes
router.post('/', protect, createAppointment);
router.get('/myappointments', protect, getUserAppointments);
router.put('/:id/cancel', protect, cancelAppointment);

// Protected Admin routes
router.get('/all', protect, admin, getAllAppointments); 
router.put('/:id/status', protect, admin, updateAppointmentStatus);

console.log("🔥 THE NEW ADMIN ROUTES ARE OFFICIALLY LOADED! 🔥");

module.exports = router;