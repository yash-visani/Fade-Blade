// Import the model correctly as 'Appointment'
const Appointment = require('../models/Appointment');

// @desc    Create a new appointment
// @route   POST /api/bookings
const createAppointment = async (req, res) => {
  try {
    // --- FIXED: Now we accept preferredBarber from the frontend! ---
    const { service, date, timeSlot, preferredBarber, totalPrice } = req.body;

    // 1. Check for Double Booking using Smart Math
    // Find ALL active appointments at this exact date and time
    const existingAppointments = await Appointment.find({ 
        date, 
        timeSlot, 
        status: { $ne: 'cancelled' } 
    });

    // Rule 1: Are all 3 chairs full?
    if (existingAppointments.length >= 3) {
      return res.status(400).json({ message: 'This time slot is completely full.' });
    }

    // Rule 2: If they asked for a specific barber, is THAT barber already booked?
    if (preferredBarber && preferredBarber !== 'Any') {
      const isBarberBusy = existingAppointments.some(app => app.preferredBarber === preferredBarber);
      if (isBarberBusy) {
        return res.status(400).json({ message: `${preferredBarber} is already booked at this time.` });
      }
    }

    // 2. Create the appointment since chairs are open
    const appointment = await Appointment.create({
      user: req.user._id, // Comes from auth middleware
      service,
      date,
      timeSlot,
      preferredBarber: preferredBarber || 'Any', // --- FIXED: Save the requested barber! ---
      totalPrice
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get available slots based on date AND preferred barber
// Get available slots based on date AND preferred barber
const getAvailableSlots = async (req, res) => {
  try {
    const { date, barber } = req.query;
    
    // 1. UPDATED: 30-Minute Interval Slots
    const allSlots = [
      "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", 
      "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", 
      "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", 
      "06:00 PM", "06:30 PM", "07:00 PM"
    ];

    const appointments = await Appointment.find({ 
      date: date,
      status: { $ne: 'cancelled' } 
    });

    // --- NEW: TIME TRAVEL PREVENTION LOGIC ---
    // Get current date and time exactly in IST (India Standard Time)
    const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    
    const yyyy = nowIST.getFullYear();
    const mm = String(nowIST.getMonth() + 1).padStart(2, '0');
    const dd = String(nowIST.getDate()).padStart(2, '0');
    const todayString = `${yyyy}-${mm}-${dd}`; // Formats as YYYY-MM-DD
    
    const isToday = (date === todayString);
    const currentMinutes = nowIST.getHours() * 60 + nowIST.getMinutes();

    // Helper function to convert "02:30 PM" into total minutes (to compare time mathematically)
    const timeToMinutes = (timeStr) => {
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':');
      hours = parseInt(hours, 10);
      minutes = parseInt(minutes, 10);
      if (hours === 12 && modifier === 'AM') hours = 0;
      if (hours < 12 && modifier === 'PM') hours += 12;
      return hours * 60 + minutes;
    };
    // ------------------------------------------

    // Run the Smart Calendar Filter
    const availableSlots = allSlots.filter(slot => {
      
      // Rule 1: TIME TRAVEL FIX
      // If they are booking for today, hide any slots that have already passed!
      if (isToday) {
        const slotMinutes = timeToMinutes(slot);
        if (slotMinutes <= currentMinutes) {
          return false; // Hide this slot, it's in the past!
        }
      }

      const bookingsAtThisTime = appointments.filter(app => app.timeSlot === slot);

      // Rule 2: Is the entire shop completely full? (3 Barbers = Max 3 Bookings)
      if (bookingsAtThisTime.length >= 3) {
        return false; 
      }

      // Rule 3: Did the customer request a specific barber?
      if (barber && barber !== 'Any') {
        const isRequestedBarberBusy = bookingsAtThisTime.some(app => app.preferredBarber === barber);
        if (isRequestedBarberBusy) {
          return false; 
        }
      }

      return true;
    });

    res.status(200).json(availableSlots);
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({ message: 'Server Error fetching slots' });
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