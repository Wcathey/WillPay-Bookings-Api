const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation'); // Import the function

const router = express.Router();



const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];


  router.post(
    '/signup',
    validateSignup, // Validation middleware
    async (req, res, next) => { // Route handler function
      try {
        const { email, password, username } = req.body;
        const hashedPassword = bcrypt.hashSync(password);
        const user = await User.create({ email, username, hashedPassword });
  
        const safeUser = {
        firstName,
        lastName,
        id: user.id,
        email: user.email,
        username: user.username,
        };
  
        await setTokenCookie(res, safeUser);
  
        return res.json({ user: safeUser });
      } catch (err) {
        return next(err); // Pass errors to the next middleware
      }
    }
  );
  

module.exports = router;
