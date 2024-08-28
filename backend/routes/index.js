const express = require('express');
const router = express.Router();
// backend/routes/index.js
// ...
const apiRouter = require('./api');
// GET /api/set-token-cookie
const { setTokenCookie, restoreUser, requireAuth } = require('../utils/auth.js');
const { User } = require('../db/models');



// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
      'XSRF-Token': csrfToken
    });
  });
  // ...

router.use('/api', apiRouter);

module.exports = router;
