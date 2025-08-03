import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const BookRoom = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    username: '', // Changed from 'name'
    date: '',
    startTime: '',
    endTime: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');

    axios.post('http://localhost:5000/api/bookings', { ...formData, room: id })
      .then(res => {
        setMessage(res.data.message);
      })
      .catch(err => {
        setMessage(err.response?.data?.message || 'An unexpected error occurred.');
      });
  };

  return (
    <div>
      <h2>Book This Room</h2>
      <form onSubmit={handleSubmit}>
        {/* Changed this input to ask for 'username' */}
        <input 
          type="text" 
          name="username" 
          placeholder="Your Username" 
          value={formData.username} 
          onChange={handleChange} 
          required 
        />
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        <input type="time" name="startTime" placeholder="Start Time" value={formData.startTime} onChange={handleChange} required />
        <input type="time" name="endTime" placeholder="End Time" value={formData.endTime} onChange={handleChange} required />
        <button type="submit">Confirm Booking</button>
      </form>

      {message && <p>{message}</p>}
      
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default BookRoom;