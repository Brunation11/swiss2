var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    deepPopulate = require('mongoose-deep-populate')(mongoose);

var FolderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  folders: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Folder'
    }
  ],
  bookmarks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Bookmark'
    }
  ]
});

FolderSchema.plugin(deepPopulate, {
  populate: {
    'folders.bookmarks': {
      select: 'name url'
    },
    'bookmarks': {
      select: 'name url'
    },
    'user': {
      select: 'username'
    }
  }
});

module.exports = mongoose.model('Folder', FolderSchema);