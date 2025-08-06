const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking'); 
const auth = require('../middleware/auth');

// GET all bookings (public)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('room').populate('user', 'username');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// POST a new booking (protected)
router.post('/', auth, async (req, res) => {
  const { room, date, startTime, endTime } = req.body;
  try {
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
      user: userId,
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

// DELETE a booking by ID
router.delete('/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting booking.' });
  }
});

module.exports = router;