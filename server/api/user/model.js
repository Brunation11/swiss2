var config = require('../../config/config'),
    crypto = require('crypto'),
    jwt = require('jsonwebtoken'),
    validator = require('validator'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    FolderModel = require('../folder/model');

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
  rootFolder: {
    type: Schema.Types.ObjectId,
    ref: 'Folder',
    required: true

  },
  hash: String,
  salt: String
});

UserSchema.methods = {
  fullName: function() {
    return this.firstName + " " + this.lastName;
  },
  getRootFolder: function() {
    var user = this,
        folder = new FolderModel({name: user.username, user: user._id})
    folder.save();
    return folder;
  },
  setRootFolder: function(next) {
    this.rootFolder = this.getRootFolder()._id;
    next();
  },
  validateEmail: function(next) {
    if (validator.isEmail(this.email)) {
      next();
    } else {
      next(new Error("invalid email"));
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
      exp: config.exp
    }, config.secrets.jwt);
  }
};

UserSchema.pre('validate', function(next) {
  this.setRootFolder(next);
});

UserSchema.pre('save', function(next) {
  this.validateEmail(next);
});

module.exports = mongoose.model('User', UserSchema);