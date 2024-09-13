const express = require('express');
const router = express.Router();
// backend/routes/index.js
const spotsRouter = require('./api/spots');
const bookingsRouter = require('./api/bookings'); 
const sessionRouter = require('./api/session');
const usersRouter = require('./api/users');
// GET /api/set-token-cookie
const { setTokenCookie, restoreUser, requireAuth } = require('../utils/auth.js');
const { User } = require('../db/models');



// CSRF Token route
router.get('/api/csrf/restore', (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie('XSRF-TOKEN', csrfToken);  // Set the token in the cookie
  res.status(200).json({ 'XSRF-Token': csrfToken });  // Return token in response
});
  // ...

// Mounted the API routers directly under /api. Spots and bookings routes are now directly available under /api prefix. Simplified and fixed bookingsRouter reference error
router.use('/api/spots', spotsRouter);
router.use('/api/bookings', bookingsRouter);
router.use('/api/session', sessionRouter);
router.use('/api/users', usersRouter);


module.exports = router;
