// routes/bookings.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// POST /api/bookings
router.post('/', async (req, res) => {
  const { roomId, userName, date, startTime, endTime } = req.body;

  try {
    // Check for booking conflict
    const conflict = await Booking.findOne({
      room: roomId,
      date,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (conflict) {
      return res.status(409).json({ message: 'Time slot already booked' });
    }

    const booking = new Booking({
      room: roomId,
      userName,
      date,
      startTime,
      endTime,
    });

    await booking.save();
    res.status(201).json({ message: 'Booking successful' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
