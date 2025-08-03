const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Fetch users, exclude passwords
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: 'Server error while fetching users.' });
  }
});

// POST /api/users - Create a new user (this route already exists)
router.post('/', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: 'Username is required.' });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already taken.' });
    }
    const newUser = new User({ username });
    await newUser.save();
    res.status(201).json({ message: `User '${username}' created successfully.` });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: 'Server error while creating user.' });
  }
});

// DELETE a user by ID
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    // Optional: Also delete bookings made by this user
    // await Booking.deleteMany({ user: req.params.id });
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: 'Server error while deleting user.' });
  }
});

module.exports = router;