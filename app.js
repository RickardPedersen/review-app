require('dotenv').config()

let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let createAccountRouter = require('./routes/createAccount');
let loginRouter = require('./routes/login');
let restaurantsRouter = require('./routes/restaurants');
let usersRouter = require('./routes/users');
let apiRouter = require('./routes/api');

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

let app = express();

// MySQL stuff

const mysql = require('mysql');
const db = mysql.createConnection({
  host: 'localhost',
  port: '10003',
  user: 'root',
  password: 'root',
  database: 'review_app_db'
});
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to db!');
});

app.use(function (req, res, next) {
  req.db = db;
  next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/createAccount', createAccountRouter);
app.use('/login', loginRouter);
app.use('/restaurants', restaurantsRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
