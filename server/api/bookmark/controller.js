var BookmarkModel = require('./model'),
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
  res.json(req.folder.bookmarks);
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
            // bookmark.setContent(body, next);
            var tagless = striptags(body),
                spaceless = tagless.replace(/\s+/g, ' ');
            bookmark.content = spaceless;
            bookmark.save(function(err, saved) {
              if (err) {
                next(err);
              } else {
                var folder = req.folder;
                folder.bookmarks.push(saved._id);
                folder.save(function(err, folder) {
                  if (err) {
                    next(err);
                  } else {
                    res.json(saved);
                  }
                });
              }
            });
          }
        });
      } else {
        var folder = req.folder;
        folder.bookmarks.push(bookmark._id);
        folder.save(function(err, folder) {
          if (err) {
            next(err);
          } else {
            res.json(bookmark);
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