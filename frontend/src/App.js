import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Container from '@mui/material/Container';

// --- Add these missing import statements ---
import Home from './pages/Home';
import BookRoom from './pages/BookRoom';
import BookingsList from './pages/BookingsList';
import RegisterUser from './pages/RegisterUser';
import Admin from './pages/Admin';
// -----------------------------------------

import './App.css';

function App() {
  return (
    <Router>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<BookRoom />} />
          <Route path="/bookings" element={<BookingsList />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;