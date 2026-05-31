const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const cron = require('node-cron'); // <-- Added Cron here
const Appointment = require('./models/Appointment'); // <-- Added Appointment model here

// Load environment variables config
dotenv.config();

// Initialize Express app
const app = express();

// Connect to the database
connectDB();

// Middleware to parse JSON and allow cross-origin requests (frontend to backend)
app.use(express.json());
app.use(cors());

// A simple test route to make sure the server is running
app.get('/', (req, res) => {
  res.send('Barber Shop API is running...');
});

// We will add your API routes here later!
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/lookbook', require('./routes/lookbookRoutes'));

// ==========================================
// BACKGROUND WORKER: AUTO-CANCEL EXPIRED APPOINTMENTS
// ==========================================
// This Cron Job runs automatically every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  console.log('Running background check for expired pending appointments...');
  
  try {
    // Get current IST time
    const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const yyyy = nowIST.getFullYear();
    const mm = String(nowIST.getMonth() + 1).padStart(2, '0');
    const dd = String(nowIST.getDate()).padStart(2, '0');
    const todayString = `${yyyy}-${mm}-${dd}`;
    
    const currentMinutes = nowIST.getHours() * 60 + nowIST.getMinutes();

    // Helper to convert "05:00 PM" to minutes
    const timeToMinutes = (timeStr) => {
      if (!timeStr) return 0;
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':');
      hours = parseInt(hours, 10);
      minutes = parseInt(minutes, 10);
      if (hours === 12 && modifier === 'AM') hours = 0;
      if (hours < 12 && modifier === 'PM') hours += 12;
      return hours * 60 + minutes;
    };

    // Find all pending appointments
    const pendingAppointments = await Appointment.find({ status: 'pending' });

    for (let app of pendingAppointments) {
      const appMinutes = timeToMinutes(app.timeSlot);
      
      // If the appointment was for a day in the past OR it is today but the time has already passed
      if (app.date < todayString || (app.date === todayString && appMinutes <= currentMinutes)) {
        app.status = 'cancelled';
        await app.save();
        console.log(`Auto-cancelled expired appointment: ${app._id}`);
      }
    }
  } catch (error) {
    console.error('Error running auto-cancel cron job:', error);
  }
});
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});