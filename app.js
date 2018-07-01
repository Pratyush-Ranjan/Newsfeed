var createError = require('http-errors');
var express = require('express');
var crypto= require('crypto');
var path = require('path');
var bodyParser =require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose= require('mongoose');
var indexRouter = require('./routes/index');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport =require('passport');
var LocalStrategy =require('passport-local').Strategy;
var flash = require('connect-flash');
var app = express();
var news= require('./models/new');
require('./models/user');
// connect MongoDB
mongoose.connect('mongodb://localhost/globalbaba', function(err,db){
    if (!err){
        console.log('Connected to /news!');
    } else{
        console.dir(err); //failed to connect
    }
});

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '')));

app.use('/', indexRouter);

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
