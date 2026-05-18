const express = require('express');
const router = express.Router();
const { 
    createAppointment, 
    getAvailableSlots, 
    getUserAppointments,
    getAllAppointments,     // <-- Imported
    updateAppointmentStatus,
    cancelAppointment // <-- Imported
} = require('../controllers/bookingController');

// Import the new admin guard
const { protect, admin } = require('../middleware/authMiddleware');

// Public route
router.get('/available-slots', getAvailableSlots);

// Protected Customer routes
router.post('/', protect, createAppointment);
router.get('/myappointments', protect, getUserAppointments);

// NEW: Protected ADMIN routes
router.get('/', protect, admin, getAllAppointments); 
router.put('/:id/status', protect, admin, updateAppointmentStatus);

// Route for customer cancellation
router.put('/:id/cancel', protect, cancelAppointment);

module.exports = router;