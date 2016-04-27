var app = require('../../server'),
    request = require('supertest'),
    expect = require('chai').expect,
    UserModel = require('./model');

describe('[AUTHENTICATION]'.bold.green, function() {
  var userData = {
    username: 'test',
    email: 'test',
    password: 'test'
  };

  before(function(done) {
    UserModel.collection.drop();
    done();
  });

  describe('#register()'.cyan, function() {
    it('allows new users to register', function(done) {
      request(app)
        .post('/auth/register')
        .send(userData)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('token');
          done();
        });
    });
  });

  describe('#login()'.cyan, function() {
    it('allows existing users to log in', function(done) {
      request(app)
        .post('/auth/login')
        .send(userData)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('token');
          done();
        });
    });
  });
});