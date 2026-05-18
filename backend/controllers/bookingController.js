// Import the model correctly as 'Appointment'
const Appointment = require('../models/Appointment');

// @desc    Create a new appointment
// @route   POST /api/bookings
const createAppointment = async (req, res) => {
  try {
    const { service, date, timeSlot, totalPrice } = req.body;

    // 1. Check for Double Booking
    const slotTaken = await Appointment.findOne({ 
        date, 
        timeSlot, 
        status: { $ne: 'cancelled' } 
    });

    if (slotTaken) {
      return res.status(400).json({ message: 'This time slot is already booked.' });
    }

    // 2. Create the appointment if the slot is free
    const appointment = await Appointment.create({
      user: req.user._id, // Comes from auth middleware
      service,
      date,
      timeSlot,
      totalPrice
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get available time slots for a specific date
// @route   GET /api/bookings/available-slots
const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query; // e.g., "2026-05-17"
    if (!date) return res.status(400).json({ message: 'Please provide a date' });

    // Master list of shop hours
    const allBusinessSlots = [
      "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
      "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
      "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
      "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM"
    ];

    // --- FEATURE 1: PREVENT DOUBLE BOOKINGS (FIXED MODEL NAME HERE) ---
    const existingBookings = await Appointment.find({ date: date });

    // Extract just the time strings of bookings that are NOT cancelled
    const takenSlots = existingBookings
      .filter(b => b.status !== 'cancelled')
      .map(b => b.timeSlot);

    // Remove taken slots from our master list
    let availableSlots = allBusinessSlots.filter(slot => !takenSlots.includes(slot));

    // --- FEATURE 2: PREVENT TIME TRAVEL (PAST TIMES) ---
    const nowStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const currentDateIST = new Date(nowStr);

    const todayStringIST = currentDateIST.getFullYear() + '-' +
      String(currentDateIST.getMonth() + 1).padStart(2, '0') + '-' +
      String(currentDateIST.getDate()).padStart(2, '0');

    if (date === todayStringIST) {
      const currentHour = currentDateIST.getHours();
      const currentMinute = currentDateIST.getMinutes();

      availableSlots = availableSlots.filter(slot => {
        const [time, modifier] = slot.split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);

        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        if (hours < currentHour) return false;
        if (hours === currentHour && minutes <= currentMinute) return false;
        
        return true; 
      });
    }

    res.json(availableSlots);
    
  } catch (error) {
    console.error("Error in getAvailableSlots:", error);
    res.status(500).json({ message: 'Server Error fetching slots', error: error.message });
  }
};

// @desc    Get logged in user's appointments
// @route   GET /api/bookings/myappointments
const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
        .populate('service', 'name price duration') 
        .sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get ALL appointments (Admin only)
// @route   GET /api/bookings
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('user', 'username phone') 
      .populate('service', 'name price duration') 
      .sort({ date: 1, timeSlot: 1 }); 
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update appointment status (Admin only)
// @route   PUT /api/bookings/:id/status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    const updatedAppointment = await appointment.save();

    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// --- FEATURE 3: CUSTOMER SELF-CANCELLATION ---
// @desc    Cancel an appointment (Customer autonomy)
// @route   PUT /api/bookings/:id/cancel
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Security check: Make sure this appointment belongs to the logged-in customer
    if (appointment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to cancel this appointment' });
    }

    appointment.status = 'cancelled';
    const updatedAppointment = await appointment.save();

    res.json({ message: 'Appointment successfully cancelled', updatedAppointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { 
  createAppointment, 
  getAvailableSlots, 
  getUserAppointments,
  getAllAppointments,       
  updateAppointmentStatus,
  cancelAppointment // Export the new cancellation controller
};