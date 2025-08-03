const mongoose = require('mongoose');
const Room = require('../models/Room');

mongoose.connect('mongodb://localhost:27017/studyroom', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected.');

  const rooms = [
    { name: 'Room A', capacity: 4, location: 'First Floor' },
    { name: 'Room B', capacity: 6, location: 'Second Floor' },
  ];

  await Room.deleteMany(); // optional: clears existing rooms
  await Room.insertMany(rooms);

  console.log('Rooms seeded.');
  mongoose.disconnect();
})
.catch((err) => console.error('Connection failed:', err));
