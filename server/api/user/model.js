var config = require('../../config/config'),
    crypto = require('crypto'),
    jwt = require('jsonwebtoken'),
    validator = require('validator'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    deepPopulate = require('mongoose-deep-populate')(mongoose);

var UserSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  bookmarks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Bookmark'
    }
  ],
  hash: String,
  salt: String
});

UserSchema.methods = {
  fullName: function() {
    return this.firstName + " " + this.lastName;
  },
  validateEmail: function(next) {
    if (validator.isEmail(this.email)) {
      next();
    } else {
      var error = new Error("invalid email");
      res.status(409).json({error: error});
      next(error);
    }
  },
  setPassword: function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  },
  validatePassword: function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
  },
  generateJWT: function() {
    return jwt.sign({
      _id: this._id,
      username: this.username,
      rootFolder: this.rootFolder,
      exp: config.exp
    }, config.secrets.jwt);
  }
};

UserSchema.plugin(deepPopulate);

UserSchema.pre('save', function(next) {
  this.validateEmail(next);
});

module.exports = mongoose.model('User', UserSchema);