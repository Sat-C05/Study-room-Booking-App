const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const nodemailer = require('nodemailer');
const moment = require('moment-timezone');

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// GET all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('room').populate('user', 'username');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// POST a new booking
router.post('/', auth, async (req, res) => {
  const { room, date, startTime, endTime } = req.body;
  
  try {
    const userId = req.user.id;
    const existingBooking = await Booking.findOne({
      room, date,
      $and: [{ startTime: { $lt: endTime } }, { endTime: { $gt: startTime } }]
    });

    if (existingBooking) {
      return res.status(409).json({ message: 'This time slot is already booked.' });
    }

    const newBooking = new Booking({ room, user: userId, date, startTime, endTime });
    await newBooking.save();
    
    try {
      const bookingDetails = await newBooking.populate(['room', 'user']);
      await transporter.sendMail({
        from: `"Study Room Booking" <${process.env.EMAIL_USER}>`,
        to: bookingDetails.user.email,
        subject: "Booking Confirmation",
        html: `<h1>Your Booking is Confirmed!</h1><p>Details...</p>`,
      });
    } catch (emailError) {
      console.error("FAILED TO SEND EMAIL:", emailError);
    }

    res.status(201).json({ message: 'Booking successful! A confirmation email has been sent.' });

  } catch (bookingError) {
    console.error("Booking Error:", bookingError);
    res.status(500).json({ message: 'Server error during booking.' });
  }
});

// DELETE a booking by ID
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    res.json({ message: 'Booking deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting booking.' });
  }
});

// --- REVISED AI SUGGESTIONS ROUTE ---
router.post('/suggestions', auth, async (req, res) => {
  const { room, date, requestedStartTime } = req.body;
  const timezone = "America/New_York"; // Using a consistent timezone is crucial

  try {
    const existingBookings = await Booking.find({ room, date }).sort({ startTime: 'asc' });

    const dayStartHour = 9;  // 9 AM
    const dayEndHour = 21; // 9 PM
    const bookingDurationMinutes = 60; // Suggest 1-hour slots

    const suggestions = [];
    // Start checking from the user's requested time
    let checkTime = moment.tz(`${date}T${requestedStartTime}`, timezone);
    const dayEnd = moment.tz(date, timezone).hour(dayEndHour).minute(0);

    // Loop until we find 3 suggestions or run out of time in the day
    while (checkTime.isBefore(dayEnd) && suggestions.length < 3) {
      const potentialEndTime = moment(checkTime).add(bookingDurationMinutes, 'minutes');

      if (potentialEndTime.isAfter(dayEnd)) {
        break; // Stop if the potential booking would end after the day is over
      }

      let isAvailable = true;
      // Check this potential slot against all existing bookings
      for (const booking of existingBookings) {
        const bookingStart = moment.tz(`${date}T${booking.startTime}`, timezone);
        const bookingEnd = moment.tz(`${date}T${booking.endTime}`, timezone);
        
        // If our potential slot overlaps with an existing booking, it's not available
        if (checkTime.isBefore(bookingEnd) && potentialEndTime.isAfter(bookingStart)) {
          isAvailable = false;
          // To be efficient, jump our check to the end of the conflicting booking
          checkTime = bookingEnd; 
          break;
        }
      }

      if (isAvailable) {
        // If the slot was free, add it to our suggestions list
        suggestions.push({
          startTime: checkTime.format('HH:mm'),
          endTime: potentialEndTime.format('HH:mm'),
        });
        // And move our check to the end of the slot we just found
        checkTime = potentialEndTime;
      }
    }

    res.json(suggestions);
  } catch (error) {
    console.error("Suggestion Error:", error);
    res.status(500).json({ message: 'Could not generate suggestions.' });
  }
});

module.exports = router;
