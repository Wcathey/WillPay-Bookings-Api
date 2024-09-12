const express = require('express');
const router = express.Router();
// backend/routes/index.js
// ...
const apiRouter = require('./api');
const spotsRouter = require('./api/spots');
const bookingsRouter = require('./api/bookings'); 

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

router.use('/api', apiRouter);

router.use('/spots', spotsRouter);
router.use('/bookings', bookingsRouter);


module.exports = router;
