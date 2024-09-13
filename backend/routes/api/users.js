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
      check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('First name is required.'),
    check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Last name is required.'),
    handleValidationErrors
  ];


  router.post(
    '/signup',
    validateSignup, // Validation middleware
    async (req, res, next) => { // Route handler function
        console.log("signup route hit")
      try {
        const { email, password, username, firstName, lastName } = req.body;
        const hashedPassword = bcrypt.hashSync(password);
        const user = await User.create({ email, username, firstName, lastName, hashedPassword });
  
        const safeUser = {
        
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        };
  
        await setTokenCookie(res, safeUser);
  
        return res.status(201).json({ user: safeUser });
      } catch (err) {
        return next(err); // Pass errors to the next middleware
      }
    }
  );
  

module.exports = router;
