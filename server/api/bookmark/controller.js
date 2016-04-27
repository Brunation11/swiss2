var BookmarkModel = require('./model'),
    _ = require('lodash');

exports.params = function(req, res, next, id) {
  BookmarkModel.findById(id)
    .exec(function(err, bookmark) {
      if (err) {
        next(err);
      } else if (!bookmark) {
        next(new Error('Bookmark not found'));
      } else {
        req.bookmark = bookmark;
        next();
      }
    });
};

// will never be used since bookmarks will be populated by the respective folder
exports.get = function(req, res, next) {
  BookmarkModel.find({})
    .exec(function(err, bookmarks) {
      if (err) {
        next(err);
      } else {
        res.json(bookmarks);
      }
    });
};

// check for existance of bookmark before creating
exports.post = function(req, res, next) {
  BookmarkModel.findOrCreate({url: req.url}, function(err, bookmark, created) {
    if (err) {
      next(err);
    } else {
      res.json(bookmark);
      next();
    }
  });
};

// get a specified bookmark
exports.getOne = function(req, res) {
  res.json(req.bookmark);
};

// updated a specified bookmark
exports.put = function(req, res, next) {
  var bookmark = req.bookmark,
      update = req.body;
  _.merge(bookmark, update);
  bookmark.save(function(err, bookmark) {
    if (err) {
      next(err);
    } else {
      res.json(bookmark);
    }
  });
};

// delete a specified bookmark, currently deletes record, will need to be reworked to only remove association
exports.delete = function(req, res, next) {
  req.bookmark.remove(function(err, bookmark) {
    if (err) {
      next(err);
    } else {
      req.bookmark.on('es-removed', function(err, res) {
        if (err) {
          next(err);
        }
      });
      res.json(bookmark);
    }
  });
};