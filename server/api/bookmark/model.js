var fs = require('fs'),
    striptags = require('striptags'),
    request = require('request'),
    mongoosastic = require('mongoosastic'),
    findOrCreate = require('mongoose-findorcreate'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    UserModel = require('../user/model');

var BookmarkSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    // required: true,
    es_indexed: true
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag'
    }
  ]
});

BookmarkSchema.methods = {
  validateName: function(next) {
    if (this.name) {
      next();
    } else {
      this.name = this.url;
      next();
    }
  },
  getContent: function(req, res, body) {
    var instance = this;
    instance.setContent(body);
    instance.save(function(err, saved) {
      if (err) {
        next(err);
      } else {
        instance.on('es-indexed', function(err, response) {
          if (err) {
            next(err);
          }
        });
        UserModel.findById(req.payload._id)
          .exec(function(err, user) {
            if (err) {
              next(err);
            } else {
              user.bookmarks.push(saved);
              user.save(function(err, user) {
                if (err) {
                  next (err);
                } else {
                  res.json(saved);
                }
              });
            }
          });
      }
    });
  },
  setContent: function(body) {
    this.content = striptags(body).replace(/\s+/g, ' ');
  }
};

BookmarkSchema.pre('validate', function(next) {
  this.validateName(next);
});

BookmarkSchema.plugin(mongoosastic);
BookmarkSchema.plugin(findOrCreate);

module.exports = mongoose.model('Bookmark', BookmarkSchema);