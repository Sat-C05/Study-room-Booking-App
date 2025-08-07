const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');
const moment = require('moment-timezone'); // Use moment-timezone

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
router.delete('/:id', async (req, res) => {
  // ... (code is unchanged)
});

// --- REVISED AI SUGGESTIONS ROUTE ---
router.post('/suggestions', auth, async (req, res) => {
  const { room, date, requestedStartTime } = req.body;
  const timezone = "America/New_York"; // Define a consistent timezone

  try {
    const existingBookings = await Booking.find({ room, date }).sort({ startTime: 'asc' });

    const dayStartHour = 9;
    const dayEndHour = 21;
    const bookingDurationMinutes = 60;

    const suggestions = [];
    // Start checking from the user's requested time, rounded to the next 30-min interval
    let checkTime = moment.tz(`${date}T${requestedStartTime}`, timezone);
    if (checkTime.minute() > 0 && checkTime.minute() <= 30) {
        checkTime.minute(30).second(0);
    } else if (checkTime.minute() > 30) {
        checkTime.add(1, 'hour').minute(0).second(0);
    }

    const dayEnd = moment.tz(date, timezone).hour(dayEndHour).minute(0);

    while (checkTime.isBefore(dayEnd) && suggestions.length < 3) {
      const potentialEndTime = moment(checkTime).add(bookingDurationMinutes, 'minutes');
      
      if (potentialEndTime.isAfter(dayEnd)) {
        break; // Don't suggest times that go past the end of the day
      }

      let isAvailable = true;
      for (const booking of existingBookings) {
        const bookingStart = moment.tz(`${date}T${booking.startTime}`, timezone);
        const bookingEnd = moment.tz(`${date}T${booking.endTime}`, timezone);
        
        // Check for overlap
        if (checkTime.isBefore(bookingEnd) && potentialEndTime.isAfter(bookingStart)) {
          isAvailable = false;
          // Jump checkTime to the end of the conflicting booking to be more efficient
          checkTime = bookingEnd;
          if (checkTime.minute() > 0 && checkTime.minute() <= 30) {
            checkTime.minute(30).second(0);
          } else if (checkTime.minute() > 30) {
            checkTime.add(1, 'hour').minute(0).second(0);
          }
          break;
        }
      }

      if (isAvailable) {
        suggestions.push({
          startTime: checkTime.format('HH:mm'),
          endTime: potentialEndTime.format('HH:mm'),
        });
        // Move to the next potential slot
        checkTime.add(bookingDurationMinutes, 'minutes');
      }
    }

    res.json(suggestions);
  } catch (error) {
    console.error("Suggestion Error:", error);
    res.status(500).json({ message: 'Could not generate suggestions.' });
  }
});


module.exports = router;