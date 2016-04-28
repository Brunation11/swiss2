var UserModel = require('../user/model'),
    FolderModel = require('./model'),
    _ = require('lodash');

exports.params = function(req, res, next, id) {
  FolderModel.findById(id)
    .deepPopulate('user folders.bookmarks bookmarks')
    .exec(function(err, folder) {
      if (err) {
        next(err);
      } else if (!folder) {
        next(new Error('Folder not found'));
      } else {
        req.folder = folder;
        next();
      }
    });
};

exports.get = function(req, res, next) {
  FolderModel.find({user: req.payload._id})
    .deepPopulate('user bookmarks folder.bookmarks')
    .exec(function(err, folders) {
      if (err) {
        next(err);
      } else {
        res.json(folders);
      }
    });
};

exports.post = function(req, res, next) {
  var folder = new FolderModel(req.body);
  folder.user = req.payload._id;
  folder.save(function(err, folder) {
    if (err) {
      res.status(400).json({error: 'Looks like there was a problem trying to save your folder'});
      next(err);
    } else {
      folder.deepPopulate('user bookmarks folder.bookmarks', function(err, folder) {
        if (err) {
          next(err);
        } else {
          res.json(folder);
        }
      });
    }
  });
};

exports.getOne = function(req, res) {
  res.json(req.folder);
};

exports.put = function(req, res, next) {
  var folder = req.folder;
  var update = req.body;
  _.merge(folder, update);
  folder.save(function(err, folder) {
    if (err) {
      next(err);
    } else {
      res.json(folder);
    }
  });
};

exports.delete = function(req, res, next) {
  req.folder.remove(function(err, folder) {
    if (err) {
      next(err);
    } else {
      res.json(folder);
    }
  });
};