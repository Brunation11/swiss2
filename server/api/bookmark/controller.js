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
  res.json(req.folder.bookmarks);
};


exports.post = function(req, res, next) {
  // BookmarkModel.findOrCreate(req.body, function(err, bookmark, created) {
  BookmarkModel.findOne(req.body, function(err, bookmark) {
    if (err) {
      next(err);
    } else if (!bookmark) {
      var newBookmark = new BookmarkModel(req.body);
      newBookmark.save(function(err, savedBookmark) {
        console.log(savedBookmark);
        if (err) {
          next(err);
        } else {
          var folder = req.folder;
          folder.bookmarks.push(savedBookmark._id);
          folder.save(function(err, folder) {
            if (err) {
              next(err);
            } else {
              res.json(savedBookmark);
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
          res.json(savedBookmark);
        }
      });
    }
  });
};


// // check for existance of bookmark before creating
// exports.post = function(req, res, next) {
//   BookmarkModel.findOrCreate(req.body, function(err, bookmark, created) {
//     if (err) {
//       next(err);
//     } else {
//       if (created) {
//         bookmark.setContent(function(err, bookmark) {
//           if (err) {
//             next(err);
//           } else {
//             var folder = req.folder;
//             folder.bookmarks.push(bookmark._id);
//             folder.save(function(err, folder) {
//               if (err) {
//                 next(err);
//               } else {
//                 res.json(bookmark);
//               }
//             });
//           }
//         });
//       }
//     }
//   });
// };

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