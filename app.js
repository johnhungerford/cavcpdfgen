const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const mysqlLib = require('mysql');

const loginRouter = require('./routes/login');
const docRouter = require('./routes/doc');
const jwtAuthenticate = require('./routes/jwtauthenticate');

const app = express();

console.log(process.argv);

let configFn = process.argv.length > 2 ? process.argv[2] : null
if (configFn !== null) {
  configFn = configFn.slice(0,2) === './' || configFn.slice(0,1) === '/' ?
    configFn : './' + configFn;
}

console.log(configFn);

// Get MySQL connection from sql.config.json file
const config = configFn === null ? JSON.parse(process.env.CONFIG) : require(configFn);
process.env.CONFIG = '';

console.log(config);

// MySQL connection is needed to set up app; create a global pool for use by all routes
global.mysql = mysqlLib.createPool(config.mysql);

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
        app.use(session(JSON.parse(result[0].config)));
        app.use(express.static(path.join(__dirname, 'public')));

        app.use('/login', loginRouter);
        app.use('/doc', jwtAuthenticate, docRouter);

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
