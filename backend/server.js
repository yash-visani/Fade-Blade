const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});