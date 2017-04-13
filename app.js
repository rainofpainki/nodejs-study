var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
// 회원가입 추가 / 2017-04-03
var register = require('./routes/register');
// 로그인 추가 / 2017-04-12
var login = require('./routes/login');
// 로그아웃 추가 / 2017-04-12
var logout = require('./routes/logout');
// 회원정보수정 추가 / 2017-04-12
var modify = require('./routes/modify');

// 세션 추가 / 2017-04-12
var session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 세션 추가 / 2017-04-12
app.use(session({
 secret: 'yE1@lLo@8Z!n3$',
 resave: false,
 saveUninitialized: true
}));

app.use('/', index);
app.use('/users', users);
// 회원가입 추가 / 2017-04-03
app.use('/register', register);
// 로그인 추가 / 2017-04-12
app.use('/login', login);
// 로그아웃 추가 / 2017-04-12
app.use('/logout', logout);
// 회원정보 수정 추가 / 2017-04-12
app.use('/modify', modify);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
