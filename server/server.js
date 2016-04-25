var express = require('express'),
    app = express(),
    config = require('./config/config'),
    logger = require('./util/logger'),
    passport = require('passport'),
    userRouter = require('./api/user/routes');

require('mongoose').connect(config.db.url);
require('./middleware/middleware')(app);
require('./api/user/auth');

app.use(passport.initialize());

app.get('/', function(req, res) {
  res.render('index');
});

app.user('/auth', userRouter);

app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(400).send('Invalid token');
  } else {
    logger.error(err.stack);
  }
});

module.exports = app;