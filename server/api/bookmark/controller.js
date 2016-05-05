var UserModel = require('../user/model'),
    BookmarkModel = require('./model'),
    _ = require('lodash'),
    request = require('request'),
    striptags = require('striptags');

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

exports.get = function(req, res, next) {
  UserModel.findById(req.payload._id)
    .populate('bookmarks')
    .exec(function(err, user) {
      if (err) {
        next(err);
      } else {
        res.json(user.bookmarks);
      }
    });
};

exports.post = function(req, res, next) {
  BookmarkModel.findOrCreate(req.body, function(err, bookmark, created) {
    if (err) {
      next(err);
    } else {
      if (created) {
        request(bookmark.url, function(err, response, body) {
          if (err) {
            next(err);
          } else {
            bookmark.getContent(req, res, body);
          }
        });
      } else {
        UserModel.findById(req.payload._id)
          .exec(function(err, user) {
            if (err) {
              next(err);
            } else {
              user.bookmarks.push(bookmark._id);
              user.save(function(err, user) {
                if (err) {
                  next(err);
                } else {
                  res.json(bookmark);
                }
              });
            }
          });
      }
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