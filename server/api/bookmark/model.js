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

BookmarkSchema.methods = {
  // setContent: function(req, res, body, next) {
  //   var tagless = striptags(body),
  //       spaceless = tagless.replace(/\s+/g, ' ');
  //   this.content = spaceless;
  //   this.save(function(err, saved) {
  //     if (err) {
  //       next(err);
  //     } else {
  //       res.json(saved);
  //     }
  //   });

    // var tagless = striptags(body),
    //     spaceless = tagless.replace(/\s+/g, ' ');
    // this.content = spaceless;
    // this.save(function(err, saved) {
    //   if (err) {
    //     next(err);
    //   }
    // });
  // }
};

BookmarkSchema.plugin(mongoosastic);
BookmarkSchema.plugin(findOrCreate);

module.exports = mongoose.model('Bookmark', BookmarkSchema);