var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Get MySQL connection from sql.config.json file
const config = require('./config.json');

// MySQL connection is needed to set up app; create a global pool for use by all routes
global.mysql = mysqlLib.createPool(config.mysql);

var app = express();

global.mysql.query(
  "SELECT config FROM configs WHERE id='session'", 
  (err, result) => {
    if (err) throw err;
    global.mysql.query(
      "SELECT config FROM configs WHERE id='jwt'", 
      (err2, result2) => {
        if (err2) throw err2;
        global.jwtSecret = JSON.parse(result2[0].config).secret;

        // view engine setup
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'jade');

        app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(express.static(path.join(__dirname, 'public')));

        app.use('/', indexRouter);
        app.use('/users', usersRouter);

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
      }
    );
  }
);

module.exports = app;
