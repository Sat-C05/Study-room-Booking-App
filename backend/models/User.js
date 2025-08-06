const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // The role can only be one of these two values
    default: 'user' // New users are always 'user' by default
  }
});

module.exports = mongoose.model('User', userSchema);