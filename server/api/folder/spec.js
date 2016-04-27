var app = require('../../server'),
    request = require('supertest'),
    expect = require('chai').expect,
    UserModel = require('../user/model'),
    FolderModel = require('./model');

describe('[FOLDERS]'.bold.green, function() {
  var token,
      userData = {
        username: 'username-test',
        password: 'password-test',
        email: 'email-test'
      },
      folder,
      folderData = {
        name: 'folderName-test'
      };

  before(function(done) {
    UserModel.collection.drop();
    request(app)
      .post('/auth/register')
      .send(userData)
      .set('Accept', 'application/json')
      .end(function() {
        request(app)
          .post('/auth/login')
          .send(userData)
          .set('Accept', 'application/json')
          .end(function(err, res) {
            token = res.body.token;
            done();
          });
      });
  });

  beforeEach(function(done) {
    FolderModel.collection.drop();
    request(app)
      .post('/folders')
      .send(folderData)
      .set({Accept: 'application/json', Authorization: token})
      .end(function(err, res) {
        folder = res.body;
        done();
      });
  });

  describe('#get()'.cyan, function() {
    it('should get all of a users folders', function(done) {
      request(app)
        .get('/folders')
        .set({Accept: 'application/json', Authorization: token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.eql(1);
          expect(res.body[0]).to.eql(folder);
          done();
        });
    });
  });
});