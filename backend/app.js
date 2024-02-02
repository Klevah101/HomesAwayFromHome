const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { ValidationError } = require('sequelize');
const routes = require('./routes');

const { environment } = require('./config');
const isProduction = environment === 'production'

const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());


if (!isProduction) {
  app.use(cors());
}

app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
);

app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);

app.use(routes);

app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

app.use((err, _req, _res, next) => {
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
      // console.log(error.path)
    }

    // console.log(errors)
    err.title = 'Validation error';
    err.errors = errors;
  }
  next(err);
});

app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  let message

  switch (err.message) {
    case 'User with that email already exists':
      message = 'User already exists'
      break;
    case 'User with that username already exists':
      message = 'User already exists'
      break;
    default:
      message = err.message;
      break;
  }

  res.json({
    message: message,
    errors: err.errors,
    // stack: isProduction ? null : err.stack
  });
});



module.exports = app;
