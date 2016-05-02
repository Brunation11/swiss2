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
        var error = new Error('Folder not found');
        res.status(409).json({error: error});
        next(error);
      } else {
        req.folder = folder;
        next();
      }
    });
};

exports.get = function(req, res, next) {
  FolderModel.find({user: req.payload._id}, function(err, folders) {
    if (err) {
      next(err);
    } else if (!folders) {
      var error = new Error('No folders found');
      res.status(409).json({error: error});
      next(error);
    } else {
      res.json(folders);
      next();
    }
  });
};

exports.post = function(req, res, next) {
  var folder = new FolderModel(req.body);
  folder.user = req.payload._id;
  folder.save(function(err, savedFolder) {
    if (err) {
      res.status(400).json({error: 'Looks like there was a problem trying to save your folder'});
      next(err);
    } else {
      if (req.folder) {
        req.folder.folders.push(savedFolder._id);
        req.folder.save(function(err, savedParentFolder) {
          if (err) {
            next(err);
          }
        });
      } else {
        FolderModel.findById(req.payload.rootFolder, function(err, rootFolder) {
          rootFolder.folders.push(savedFolder._id);
          rootFolder.save(function(err, savedRootFolder) {
            if (err) {
              next(err);
            }
          });
        });
      }
      res.json(savedFolder);
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