import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RegisterUser = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    
    axios.post('http://localhost:5000/api/users', { username })
      .then(res => {
        setMessage(res.data.message);
        setUsername(''); // Clear input after success
      })
      .catch(err => {
        setMessage(err.response?.data?.message || 'An error occurred.');
      });
  };

  return (
    <div>
      <h2>Create New User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter new username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit">Create User</button>
      </form>
      {message && <p>{message}</p>}
      <br />
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default RegisterUser;