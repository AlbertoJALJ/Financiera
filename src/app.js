var createError = require('http-errors');
var fs = require('fs');
var cors = require('cors')
var exphbs = require('express-handlebars')
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var publicRouter = require('./routes/index');
var clientRouter = require('./routes/Client');
var adminRouter = require('./routes/Admin');
var session = require('express-session');
var favicon = require('serve-favicon')
import {isAdmin, isUser} from './libs/auth'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import flash from 'connect-flash'
import User from './models/User'
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutDir: path.join(app.set('views'), 'layout'),
  partialDir: path.join(app.set('views'), 'partials'), 
  extname: '.hbs'
}));
var cors = require('cors')
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(favicon(__dirname + '/public/img/favicon.png'));
app.use(flash());

app.set('view engine', 'hbs');

//app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', publicRouter);
app.use('/admin', adminRouter)
app.use('/client', clientRouter)


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
  res.render('partials/error');
});

module.exports = app;
