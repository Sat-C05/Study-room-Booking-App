module.exports = function (req, res, next) {
  // This middleware should run AFTER the standard auth middleware
  // It checks the user object that the 'auth' middleware attached to the request
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  // If the user is an admin, proceed to the next function (the route handler)
  next();
};