var express = require('express'),
    app = express(),
    config = require('./config/config'),
    logger = require('./util/logger'),
    passport = require('passport'),
    userRouter = require('./api/user/routes'),
    bookmarkRouter = require('./api/bookmark/routes');
    tagRouter = require('./api/tag/routes');

require('mongoose').connect(config.db.url);
require('./middleware/middleware')(app);
require('./api/user/auth');

app.use(passport.initialize());

app.get('/', function(req, res) {
  res.render('index');
});

app.use('/auth', userRouter);
app.use('/bookmarks', bookmarkRouter);
app.use('/tags', tagRouter);

app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(400).send('Invalid token');
  } else {
    logger.error(err.stack);
  }
});

module.exports = app;