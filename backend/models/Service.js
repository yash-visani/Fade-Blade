const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true }, // e.g., 'Haircut', 'Beard Grooming', 'Combos'
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // Duration in minutes to help with scheduling
  imageUrl: { type: String } // Optional: link to a photo of the style
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
