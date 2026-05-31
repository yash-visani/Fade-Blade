const mongoose = require('mongoose');

const lookbookSchema = new mongoose.Schema({
  imageUrl: { 
    type: String, 
    required: true 
  },
  caption: { 
    type: String,
    default: 'Premium Cut'
  }
}, { timestamps: true });

module.exports = mongoose.model('Lookbook', lookbookSchema);