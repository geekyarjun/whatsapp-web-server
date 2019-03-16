const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const session =  require("express-session");
const MongoStore = require('connect-mongo')(session);

require('./passport/passport.config');
// const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./authRoutes');
const config = require('./config');

const app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
let origin;
app.use((req, res, next) => {
  // console.log('req.headers.origin', req.headers.origin);
  origin = req.headers.origin;
  next();
})

app.use((req, res, next) => {
  console.log('req.headers.origin', origin);
  next();
})

// app.use(cors({
//   credentials: true,
//   exposedHeaders: ['Cache-Control', 'Content-Language', 'Content-Type', 'Expires', 'Last-Modified', 'Pragma']
// }));

app.use(cors({origin: [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://192.168.100.169:3000'
], credentials: true}));

// passportConfig();

app.use(logger('dev'));
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(config.secretKey));
app.use(express.static(path.join(__dirname, 'public')));

// allow cross origin requests
app.use(function (req, res, next) {
  console.log("req.headers.origin", req.headers);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  // res.header('credentials', 'include');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    // console.log("in a middleware", res.header);
    next();
  }
});

// app.use(cookieSession({
//   name: 'session',
//   maxAge: 24*60*60*1000,
//   sameSite: true,
//   keys: [config.secretKey]
// })) 

// app.use(session({
//   secret: config.secretKey,
//   resave: true,
//   saveUninitialized: true,
//   maxAge: 24*60*60*1000,
// }))

mongoose.connect('mongodb://localhost:27017/whatsappWebDB', { useNewUrlParser: true, useCreateIndex: true });

app.use(session({
  name: 'session',
  secret: config.secretKey,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24*60*60*1000 }
}))

// app.use(session({
//   // name: 'session_arjun'
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   store: new MongoStore({
//     mongooseConnection: mongoose.connection
//   }),
//   cookie: {
//     maxAge: 30 * 24 * 60 * 60 * 1000
//   }
// }));

// app.use((req, res, next) => {
//   req.
//   next();
// });

// app.use(passport.initialize());
// app.use(passport.session());


// app.use('/', indexRouter);
app.use('/users', (req, res, next) => {
  console.log('req in users middleware', req.user, req.session, req.passport);
  next();
}, usersRouter);

app.use('/auth', (req, res, next) => { 
  console.log('req in auth middleware', req.user, req.session, req.passport);
  next();
}, authRouter);


// require('./socket/io')(server);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log("Err",err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
