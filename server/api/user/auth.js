var config = require('../../config/config'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    UserModel = require('./model'),
    jwt = require('jsonwebtoken');

passport.use(new LocalStrategy(function(username, password, done) {
  UserModel.findOne({username: username}, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user || !user.validatePassword(password)) {
      return done(null, false, 'Incorrect Username or Password');
    }
    return done(null, user);
  });
}));

exports.auth = function() {
  return function(req, res, next) {
    var token;
    if (req.headers.authorization) {
      token = req.headers.authorization;
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }
    jwt.verify(token, config.secrets.jwt, function(err, decoded) {
      if (err) {
        next(err);
      } else {
        req.payload = decoded;
        next();
      }
    });
  };
};