const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get the token from the request header
  const token = req.header('x-auth-token');

  // If there's no token, deny access
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }

  // If there is a token, verify it
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'a_default_secret_key');
    req.user = decoded.user; // Add the user's ID to the request
    next(); // Move on to the next step (the booking logic)
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid.' });
  }
};