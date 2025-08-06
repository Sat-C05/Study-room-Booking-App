const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes'); // This is the crucial part

// Use Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes); // Make sure this line is present and correct

// Connect to DB and Start Server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
    })
    .catch((err) => console.error("Could not connect to MongoDB:", err));