const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Booking = require('../models/Booking');

// GET /api/users - Fetches all users for the Admin Panel
router.get('/', async (req, res) => {
  // This route will be protected by admin middleware later
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users.' });
  }
});

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'User already exists.' });
    }
    user = new User({ username, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    
    // UPDATED PAYLOAD: We now include the role in the token
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role // Add the role here
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'a_default_secret_key',
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
  // This route will also be protected by admin middleware
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    await Booking.deleteMany({ user: req.params.id });
    res.json({ message: 'User and all associated bookings have been deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting user.' });
  }
});

module.exports = router;