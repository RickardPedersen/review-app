require('dotenv').config()

let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let apiRouter = require('./routes/api');

let app = express();

// MySQL stuff
/*
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  port: '10003',
  user: 'root',
  password: 'root',
  database: 'review_app_db'
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to db!');
});

connection.query('SELECT * FROM users', (err,rows) => {
  if(err) throw err;

  console.log('Data received from Db:\n');
  console.log(rows);
});
*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
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
