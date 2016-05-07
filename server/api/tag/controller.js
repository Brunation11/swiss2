var UserModel = require('../user/model'),
    TagModel = require('./model'),
    _ = require('lodash');

exports.params = function(req, res, next, id) {
  TagModel.findById(id, function(err, tag) {
    if (err) {
      next(err);
    } else if (!tag) {
        var error = new Error('Tag not found');
        res.status(409).json({error: error});
        next(error);
      } else {
        req.tag = tag;
        next();
      }
    });
};

exports.get = function(req, res, next) {
  TagModel.find({}, function(err, tags) {
    if (err) {
      next(err);
    } else if (!tags) {
      var error = new Error('No tags found');
      res.status(409).json({error: error});
      next(error);
    } else {
      res.json(tags);
    }
  });
};

exports.post = function(req, res, next) {
  var tag = new TagModel(req.body);
  tag.save(function(err, saved) {
    if (err) {
      res.status(400).json({error: 'Looks like there was a problem trying to save your tag'});
      next(err);
    } else {
      res.json(saved);
    }
  });
};

exports.getOne = function(req, res) {
  res.json(req.tag);
};

exports.put = function(req, res, next) {
  var tag = req.tag;
  var update = req.body;
  _.merge(tag, update);
  tag.save(function(err, saved) {
    if (err) {
      next(err);
    } else {
      res.json(saved);
    }
  });
};

exports.delete = function(req, res, next) {
  req.tag.remove(function(err, tag) {
    if (err) {
      next(err);
    } else {
      res.json(tag);
    }
  });
};