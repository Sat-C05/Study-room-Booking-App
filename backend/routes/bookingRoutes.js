const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Create a "transporter" - the object that sends emails
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// GET all bookings (unchanged)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('room').populate('user', 'username');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// POST a new booking (with improved error logging)
// Inside backend/routes/bookingRoutes.js

router.post('/', auth, async (req, res) => {
  const { room, date, startTime, endTime } = req.body;
  
  try {
    // --- ADD THIS LOGGING BLOCK ---
    console.log("--- CHECKING EMAIL CREDENTIALS ---");
    console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS is set:", !!process.env.EMAIL_PASS); // Check if password exists
    console.log("------------------------------------");
    // -----------------------------

    const userId = req.user.id;
    // ... (rest of the booking logic is the same) ...
    const newBooking = new Booking({ room, user: userId, date, startTime, endTime });
    await newBooking.save();
    
    // Email sending logic...
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, 
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const bookingDetails = await newBooking.populate(['room', 'user']);
      await transporter.sendMail({
        from: `"Study Room Booking" <${process.env.EMAIL_USER}>`,
        to: bookingDetails.user.email,
        subject: "Booking Confirmation",
        html: `<h1>Your Booking is Confirmed!</h1><p>Details...</p>`,
      });
    } catch (emailError) {
      console.error("!!! FAILED TO SEND EMAIL !!!", emailError);
    }

    res.status(201).json({ message: 'Booking successful! A confirmation email has been sent.' });

  } catch (bookingError) {
    console.error("!!! FAILED TO CREATE BOOKING !!!", bookingError);
    res.status(500).json({ message: 'Server error during booking.' });
  }
});

// DELETE a booking by ID (unchanged)
router.delete('/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting booking.' });
  }
});

module.exports = router;