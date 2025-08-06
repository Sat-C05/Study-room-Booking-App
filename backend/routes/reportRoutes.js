const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin'); // Import the admin middleware

// GET /api/reports/room-usage - Protected for Admins Only
router.get('/room-usage', [auth, admin], async (req, res) => {
  try {
    const roomUsage = await Booking.aggregate([
      {
        $group: {
          _id: '$room',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'rooms',
          localField: '_id',
          foreignField: '_id',
          as: 'roomDetails'
        }
      },
      {
        $project: {
          _id: 0,
          roomName: { $arrayElemAt: ['$roomDetails.name', 0] },
          count: 1
        }
      },
      {
        $sort: {
            count: -1 // Sort by most bookings
        }
      }
    ]);
    
    res.json(roomUsage);
  } catch (error) {
    console.error("Report generation error:", error);
    res.status(500).json({ message: 'Server error generating report.' });
  }
});

module.exports = router;