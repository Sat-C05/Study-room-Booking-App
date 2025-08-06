const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth'); // 1. Import the auth middleware

// GET all bookings (this route is public)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('room').populate('user', 'username');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// POST a new booking (this route is now protected)
// 2. Add the 'auth' middleware here
router.post('/', auth, async (req, res) => {
  // We no longer get 'username' from the body
  const { room, date, startTime, endTime } = req.body;

  try {
    // 3. We get the user's ID from the middleware instead
    const userId = req.user.id;

    const existingBooking = await Booking.findOne({
      room, date,
      $and: [{ startTime: { $lt: endTime } }, { endTime: { $gt: startTime } }]
    });

    if (existingBooking) {
      return res.status(409).json({ message: 'Time slot already booked.' });
    }

    const newBooking = new Booking({
      room,
      user: userId, // 4. Use the logged-in user's ID
      date,
      startTime,
      endTime
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking successful!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error during booking.' });
  }
});

// DELETE a booking by ID (this route is public for now, but could be protected)
router.delete('/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting booking.' });
  }
});

module.exports = router;