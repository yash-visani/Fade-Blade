const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true }],
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // e.g., "10:30 AM"
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  totalPrice: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);