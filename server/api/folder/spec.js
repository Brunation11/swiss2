var app = require('../../server'),
    request = require('supertest'),
    expect = require('chai').expect,
    faker = require('faker'),
    UserModel = require('../user/model'),
    FolderModel = require('./model');

describe('[FOLDERS]'.bold.green, function() {
  var token,
      userData = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      },
      folder,
      folderData = {
        name: faker.lorem.word()
      };

  before(function(done) {
    UserModel.collection.drop();
    FolderModel.collection.drop();
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
            request(app)
              .post('/folders')
              .send(folderData)
              .set({Accept: 'application/json', Authorization: token})
              .end(function(err, res) {
                folder = res.body;
                done();
              });
          });
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
          expect(res.body).to.have.length.above(1);
          expect(res.body[1]).to.eql(folder);
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
          expect(res.body).to.have.property('_id', folder._id);
          expect(res.body).to.have.property('name', folder.name);
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
          expect(res.body).to.have.property('_id', folder._id);
          done();
        });
    });
  });
});