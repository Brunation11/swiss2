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

  describe('#post()'.cyan, function() {
    it('should add a new folder', function(done) {
      request(app)
        .post('/folders')
        .send(folderData)
        .set({Accept: 'application/json', Authorization: token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('name', folderData.name);
          done();
        });
    });
  });

  describe('#getOne()'.cyan, function() {
    it('should get a specific folder', function(done) {
      request(app)
        .get('/folders/' + folder._id)
        .set({Accept: 'application/json', Authorization: token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.eql(folder);
          done();
        });
    });
  });


  describe('#put()'.cyan, function() {
    it('should update a specific folder', function(done) {
      var update = {
        name: 'updatedFolderName-test'
      };
      request(app)
        .put('/folders/' + folder._id)
        .send(update)
        .set({Accept: 'application/json', Authorization: token})
        .expect('Content-type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.not.eql(folder);
          expect(res.body).to.have.property('name', update.name);
          done();
        });
    });
  });

  describe('#delete()'.cyan, function() {
    it('should delete a specific folder', function(done) {
      request(app)
        .delete('/folders/' + folder._id)
        .set({Accept: 'application/json', Authorization: token})
        .expect('Content-type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.eql(folder);
          request(app)
            .get('/folders')
            .set({Accept: 'application/json', Authorization: token})
            .end(function(err, res) {
              expect(res.body.length).to.eql(0);
              done();
            });
        });
    });
  });
});