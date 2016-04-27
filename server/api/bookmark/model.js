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
    type: String,
    required: true,
    es_indexed: true
  }
});

BookmarkSchema.plugin(mongoosastic);
BookmarkSchema.plugin(findOrCreate);


BookmarkSchema.pre('save', function(next) {
  request(self.url, function(err, res, body) {
    if (err) {
      console.log(err);
    }
    tagless = striptags(body);
    spaceless = tagless.replace(/\s+/g, ' ');
    self.content = spaceless;
  });
  next();
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);