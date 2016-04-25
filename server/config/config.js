var _ = require('lodash');

var config = {
  dev: 'development',
  test: 'testing',
  prod: 'production',
  port: process.env.PORT || 3000,
  secrets: {
    jwt: process.env.JWT || 'SECRET'
  }
};

var today = new Date(),
    exp = new Date(today);
exp.setDate(today.getDate() + 60);
config.exp = parseInt(exp.getTime() / 1000);

process.env.NODE_ENV = process.env.NODE_ENV || config.dev;
config.env = process.env.NODE_ENV;

var envConfig;

try {
  envConfig = require('./' + config.env);
  envConfig = envConfig || {};
} catch(err) {
  console.log(err);
  envConfig = {};
}

module.exports = _.merge(config, envConfig);