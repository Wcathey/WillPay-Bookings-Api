const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { environment } = require('./config');
const isProduction = environment === 'production';

const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());


// 404 not found middleware
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.statusCode = 404;
  next(err);
});

// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
  }

  // helmet helps set a variety of headers to better secure your app
  app.use(
    helmet.crossOriginResourcePolicy({
      policy: "cross-origin"
    })
  );

  // Set the _csrf token and create req.csrfToken method
  app.use(
    csurf({
      cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax",
        httpOnly: true
      }
    })
  );


  const routes = require('./routes');
  app.use(routes);
  
  // 404 middleware 
  app.use((req, res, next) => {
      const err = new Error('Not Found');
      err.statusCode = 404;
      next(err);
  });
  
  // global error handling
  app.use((err, req, res, next) => {
      const statusCode = err.statusCode || 500;
      const message = err.message || 'Internal Server Error';
  
      if (process.env.NODE_ENV !== 'production') {
          console.error(err.stack);
      }
  
      res.status(statusCode).json({
          error: {
              message: message,
              stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
          },
      });
  });

  const routes = require('./routes');

  app.use(routes);

  module.exports = app;
