var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//--> ROUTES
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
//--> //ROUTES

var app = express();

//----------------------------------------------------------------------------------------------
var bodyParser = require('body-parser');
const querystring = require('querystring');
const mysql = require('mysql');
const session = require('express-session');
const fileUpload = require('express-fileupload');
app.use(fileUpload());
//----------------------------------------------------------------------------------------------

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//--> ROUTES Set
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/users', usersRouter);
//--> //ROUTES Set

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
