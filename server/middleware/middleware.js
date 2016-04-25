var express = require('express');
    engines = require('consolidate');
    morgan = require('morgan');
    bodyParser = require('body-parser');
    cors = require('cors');
    override = require('method-override');

module.exports = function(app) {
  app.engine('html', engines.ejs);
  app.set('view engine', 'html');
  app.set('views', 'client/views');
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(cors());
  app.use(override());
  app.use(express.static('client'));
  app.use(require('connect-assets')({
    paths: [
      'client/assets/js',
      'client/assets/css',
      'bower_components',
      'client'
    ]
  }));
};