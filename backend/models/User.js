const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true // This ensures no two people register with the same email
  },
  password: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String,
    required: false
  },
  role: { 
    type: String, 
    default: 'customer' 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);