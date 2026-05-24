const Appointment = require('../models/Appointment');

// @desc    Create a new appointment
// @route   POST /api/bookings
const createAppointment = async (req, res) => {
  try {
    const { service, date, timeSlot, preferredBarber, totalPrice } = req.body;

    const existingAppointments = await Appointment.find({ 
        date, 
        timeSlot, 
        status: { $ne: 'cancelled' } 
    });

    if (existingAppointments.length >= 3) {
      return res.status(400).json({ message: 'This time slot is completely full.' });
    }

    if (preferredBarber && preferredBarber !== 'Any') {
      const isBarberBusy = existingAppointments.some(app => app.preferredBarber === preferredBarber);
      if (isBarberBusy) {
        return res.status(400).json({ message: `${preferredBarber} is already booked at this time.` });
      }
    }

    const appointment = await Appointment.create({
      user: req.user._id, 
      service,
      date,
      timeSlot,
      preferredBarber: preferredBarber || 'Any', 
      totalPrice
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get available slots
// @route   GET /api/bookings/available-slots
const getAvailableSlots = async (req, res) => {
  try {
    const { date, barber } = req.query;
    
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

    const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const yyyy = nowIST.getFullYear();
    const mm = String(nowIST.getMonth() + 1).padStart(2, '0');
    const dd = String(nowIST.getDate()).padStart(2, '0');
    const todayString = `${yyyy}-${mm}-${dd}`; 
    
    const isToday = (date === todayString);
    const currentMinutes = nowIST.getHours() * 60 + nowIST.getMinutes();

    const timeToMinutes = (timeStr) => {
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':');
      hours = parseInt(hours, 10);
      minutes = parseInt(minutes, 10);
      if (hours === 12 && modifier === 'AM') hours = 0;
      if (hours < 12 && modifier === 'PM') hours += 12;
      return hours * 60 + minutes;
    };

    const availableSlots = allSlots.filter(slot => {
      if (isToday) {
        const slotMinutes = timeToMinutes(slot);
        if (slotMinutes <= currentMinutes) return false; 
      }

      const bookingsAtThisTime = appointments.filter(app => app.timeSlot === slot);

      if (bookingsAtThisTime.length >= 3) return false; 

      if (barber && barber !== 'Any') {
        const isRequestedBarberBusy = bookingsAtThisTime.some(app => app.preferredBarber === barber);
        if (isRequestedBarberBusy) return false; 
      }

      return true;
    });

    res.status(200).json(availableSlots);
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({ message: 'Server Error fetching slots' });
  }
};

// @desc    Get user's appointments
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

// @desc    Cancel an appointment
// @route   PUT /api/bookings/:id/cancel
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

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

// @desc    Get ALL appointments for the Command Center
// @route   GET /api/bookings/all
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('service')
      .sort({ date: 1, timeSlot: 1 }); 
      
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all appointments', error: error.message });
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

module.exports = { 
  createAppointment, 
  getAvailableSlots, 
  getUserAppointments,
  cancelAppointment,
  getAllAppointments,       
  updateAppointmentStatus   
};