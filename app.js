var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser =require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose= require('mongoose');
var indexRouter = require('./routes/index');
var session = require('express-session');
var app = express();
var news= require('./models/new');
require('./models/user');
// connect MongoDB
mongoose.connect('mongodb://admin:Pratyush@1999@ds259111.mlab.com:59111/global-baba-new', function(err,db){
    if (!err){
        console.log('Connected to /news!');
    } else{
        console.dir(err); //failed to connect
    }
});

//Passport
var passport = require('passport');
require('./config/pass')(passport); // pass passport for configuration
// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '')));

app.use(cookieParser());
// express session
app.use(session({
    secret:'secret',
    saveUninitialized : true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());


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
