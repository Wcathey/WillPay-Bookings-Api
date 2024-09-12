const express = require('express');
require('dotenv').config(); // load enviornment variables from .env into process.env
require('express-async-errors'); // To catch async errors
const morgan = require('morgan'); // Logging middleware
const cors = require('cors'); // CORS for cross-origin requests
const csurf = require('csurf'); // CSRF protection middleware
const helmet = require('helmet'); // Security headers middleware
const cookieParser = require('cookie-parser'); // Parse cookies
const { ValidationError } = require('sequelize'); // Sequelize validation errors
const { environment } = require('./config');
const isProduction = environment === 'production';
const routes = require('./routes'); // Import routes

const app = express();

// Logging middleware
app.use(morgan('dev'));

// Security Middleware
if (!isProduction) {
  // Enable CORS only in development
  app.use(cors());
}

// Helmet for setting security headers
app.use(
  helmet.crossOriginResourcePolicy({
    policy: 'cross-origin',
  })
);

// Cookie parser and JSON body parser
app.use(cookieParser());
app.use(express.json()); // Parse JSON bodies

// CSRF Protection middleware
app.use(
  csurf({
    cookie: {
      secure: isProduction, // Use https only in production
      sameSite: isProduction ? 'Lax' : 'Strict', // Prevent CSRF attacks
      httpOnly: true, // Prevent JS access to the cookie
    },
  })
);

// Connect all routes
app.use(routes);

// 404 Error handler for unknown routes
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = 'Resource Not Found';
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

// Sequelize error handler
app.use((err, _req, _res, next) => {
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = 'Validation error';
    err.errors = errors;
  }
  next(err);
});

// General error handler
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack, // Only show stack trace in dev
  });
});

module.exports = app;