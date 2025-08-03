const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: String,
  capacity: Number,
  location: String
});

module.exports = mongoose.model('Room', roomSchema);
