var UserModel = require('../user/model'),
    BookmarkModel = require('./model'),
    _ = require('lodash'),
    request = require('request');

exports.params = function(req, res, next, id) {
  BookmarkModel.findById(id)
    .populate('tags')
    .exec(function(err, bookmark) {
      if (err) {
        next(err);
      } else if (!bookmark) {
        var error = new Error('Bookmark not found');
        res.json(error);
        next(error);
      } else {
        req.bookmark = bookmark;
        next();
      }
    });
};

exports.get = function(req, res, next) {
  UserModel.findById(req.payload._id)
    .deepPopulate('bookmarks')
    .exec(function(err, user) {
      if (err) {
        next(err);
      } else {
        res.json(user.bookmarks);
      }
    });
};

exports.post = function(req, res, next) {
  var bookmark = new BookmarkModel(req.body);
  request(bookmark.url, function(err, response, body) {
    if (err) {
      next(err);
    } else {
      bookmark.getContent(req, res, body);
    }
  });
};

exports.getOne = function(req, res) {
  res.json(req.bookmark);
};

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