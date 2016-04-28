var fs = require('fs'),
    striptags = require('striptags'),
    request = require('request'),
    mongoosastic = require('mongoosastic'),
    findOrCreate = require('mongoose-findorcreate'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BookmarkSchema = new Schema({
  url: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String
    // required: true
    // es_indexed: true
  }
});

BookmarkSchema.plugin(mongoosastic);
BookmarkSchema.plugin(findOrCreate);

BookmarkSchema.pre('save', function(next) {
  this.content = this.assignContent(this.url);
  next();
});

BookmarkSchema.methods = {
  assignContent: function(url) {
    request(url, function(err, res, body) {
      var tagless = striptags(body);
      var spaceless = tagless.replace(/\s+/g, ' ');
      return spaceless;
    });
  }
};

module.exports = mongoose.model('Bookmark', BookmarkSchema);