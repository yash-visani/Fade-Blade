const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "Summer Special"
  description: { type: String },
  discountPercentage: { type: Number, required: true }, // e.g., 15 for 15% off
  validUntil: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);