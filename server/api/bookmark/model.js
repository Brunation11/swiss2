var striptags = require('striptags'),
    mongoosastic = require('mongoosastic'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('lodash'),
    UserModel = require('../user/model'),
    TagModel = require('../tag/model');

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
  tagString: String,
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag'
    }
  ]
});

BookmarkSchema.methods = {
  setTags: function(str) {
    var instance = this;
    var tagArray = str.split(", ");
    _(tagArray).forEach(function(tag) {
      TagModel.create({name: tag}, function(err, newTag) {
        if (err) {
          next(err);
        } else {
          instance.tags.push(newTag);
        }
      });
    });
  }
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

module.exports = mongoose.model('Bookmark', BookmarkSchema);