const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const User = require('../models/User');

// GET all bookings
router.get('/', async (req, res) => {
  try {
    // This is the updated line. We are populating both room and user.
    const bookings = await Booking.find().populate('room').populate('user', 'username');
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// POST a new booking
router.post('/', async (req, res) => {
  const { room, username, date, startTime, endTime } = req.body;

  if (startTime >= endTime) {
    return res.status(400).json({ message: 'End time must be after start time.' });
  }

  try {
    const foundUser = await User.findOne({ username: username });
    if (!foundUser) {
      return res.status(404).json({ message: 'User not found. Please create a user first.' });
    }

    const existingBooking = await Booking.findOne({
      room: room,
      date: date,
      $and: [
        { startTime: { $lt: endTime } },
        { endTime: { $gt: startTime } }
      ]
    });

    if (existingBooking) {
      return res.status(409).json({ message: 'Conflict: This time slot is already booked.' });
    }

    const newBooking = new Booking({
      room,
      user: foundUser._id,
      date,
      startTime,
      endTime
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking successful!' });

  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: 'Server error while creating booking.' });
  }
});

// DELETE a booking by ID
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    res.json({ message: 'Booking deleted successfully.' });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: 'Server error while deleting booking.' });
  }
});

module.exports = router;