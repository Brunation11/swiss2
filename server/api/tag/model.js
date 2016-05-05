var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    deepPopulate = require('mongoose-deep-populate')(mongoose);

var TagSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Tag', TagSchema);