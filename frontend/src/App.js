import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Container from '@mui/material/Container';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import Landing from './pages/Landing';
import Home from './pages/Home';
import BookRoom from './pages/BookRoom';
import BookingsList from './pages/BookingsList';
import RegisterUser from './pages/RegisterUser';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Reports from './pages/Reports'; // The new import
import './App.css'; 

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 5 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterUser />} />

            {/* Protected User Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/book/:id" element={<ProtectedRoute><BookRoom /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><BookingsList /></ProtectedRoute>} />
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <AdminProtectedRoute>
                  <Admin />
                </AdminProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <AdminProtectedRoute>
                  <Reports />
                </AdminProtectedRoute>
              } 
            />
          </Routes>
        </Container>
      </AuthProvider>
    </Router>
  );
}

export default App;