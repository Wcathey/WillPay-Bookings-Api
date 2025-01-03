// backend/utils/validation.js
const { validationResult } = require('express-validator');
const { check } = require('express-validator');
const { Sequelize } = require('../db/models');
// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

const validateSignup = [
  check('firstName')
    .exists({checkFalsy: true})
    .withMessage("First Name is required"),
  check('lastName')
    .exists({checkFalsy: true})
    .withMessage("Last Name is required"),
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

const validateSpot = [
  check("address")
    .exists({checkFalsy: true})
    .withMessage("Street address is required"),
  check("city")
    .exists({checkFalsy: true})
    .withMessage("City is required"),
  check("state")
    .exists({checkFalsy: true})
    .withMessage("State is required"),
  check('country')
    .exists({checkFalsy: true})
    .withMessage("Country is required"),
  check('lat')
    .optional(),
  check('lng')
    .optional(),
  check('name')
    .exists({checkFalsy: true})
    .isLength({max: 50})
    .withMessage("Name must be less than 50 characters"),
  check('description')
    .exists({checkFalsy: true})
    .isLength({min: 30})
    .withMessage("Description Must be at least 30 characters"),
  check('price')
    .exists({checkFalsy: true})
    .isFloat({min: 0})
    .withMessage("Price per day must be a positive number"),
  handleValidationErrors
]

const validateReview = [
    check("review")
    .exists({checkFalsy: true})
    .isLength({min: 10})
    .withMessage("Review must be at least 10 characters"),
  check("stars")
    .exists({checkFalsy: true})
    .isFloat({min: 1, max: 5})
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors
]

const validateSpotImage = [
  check("url")
    .exists({checkFalsy: true})
    .isURL()
    .withMessage("Url is required to add an image"),
  check("preview")
    .exists()
    .isBoolean()
    .withMessage("Preview must be set to true or false"),
  handleValidationErrors
]

const validateBooking = [
  check("startDate")
    .exists({checkFalsy: true})
    .isDate()
    .withMessage("startDate cannot be in the past"),
  check("endDate")
    .exists({checkFalsy: true})
    .isDate()
    .withMessage("endDate cannot be on or before startDate"),
  handleValidationErrors
]

const validateReviewImage = [
  check("url")
    .exists({checkFalsy: true})
    .withMessage("Url is required when adding an image to Review"),
    handleValidationErrors
]

const validateQueryParams = [
  check("page")
    .optional()
    .isInt({min: 1})
    .withMessage("Page must be greater than or equal to 1"),
  check("size")
    .optional()
    .isInt({min: 1, max: 20})
    .withMessage("Size must be between 1 and 20"),
  check("minLat")
    .optional()
    .isFloat({min: -90, max: 90})
    .withMessage("Minimum latitude is invalid"),
  check("maxLat")
    .optional()
    .isFloat({min: -90, max: 90})
    .withMessage("Maximum latitude is invalid"),
  check("minLng")
    .optional()
    .isFloat({min: -180, max: 180})
    .withMessage("Minimum longitude is invalid"),
  check("maxLng")
    .optional()
    .isFloat({min: -180, max: 180})
    .withMessage("Maximum longitude is invalid"),
  check("minPrice")
    .optional()
    .isFloat({min: 0})
    .withMessage("Minimum price must be greater than or equal to 0"),
  check("maxPrice")
    .optional()
    .isFloat({min: 0})
    .withMessage("Maximum price must be greater than or equal to 0"),
    handleValidationErrors
]
module.exports = {
  handleValidationErrors, validateSignup, validateSpot, validateReview, validateSpotImage, validateBooking, validateReviewImage,
  validateQueryParams
};
