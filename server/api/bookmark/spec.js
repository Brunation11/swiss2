var app = require('../../server'),
    supertest = require('supertest'),
    expect = require('chai').expect,
    faker = require('faker'),
    UserModel = require('../user/model'),
    BookmarkModel = require('./model');

describe('[BOOKMARKS]'.bold.green, function() {
  var token,
      userData = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      },
      bookmark,
      bookmarkData = {
        url: 'http://brunozatta.com'
      };

  before(function(done) {
    UserModel.collection.drop();
    BookmarkModel.collection.drop();
    supertest(app)
      .post('/auth/register')
      .send(userData)
      .set('Accept', 'application/json')
      .end(function() {
        supertest(app)
          .post('/auth/login')
          .send(userData)
          .set('Accept', 'application/json')
          .end(function(err, res) {
            token = res.body.token;
            supertest(app)
              .post('/bookmarks')
              .send(bookmarkData)
              .set({Accept: 'application/json', Authorization: token})
              .end(function(err, res) {
                bookmark = res.body;
                done();
              });
          });
      });
  });

  describe('#get()'.cyan, function() {
    it('should get all bookmarks', function(done) {
      supertest(app)
        .get('/bookmarks')
        .set({Accept: 'application/json', Authorization: token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.have.property('name', bookmark.url);
          expect(res.body[0]).to.have.property('url', bookmark.url);
          expect(res.body.length).to.eql(1);
          done();
        });
    });
  });

  describe('#post()'.cyan, function() {
    it('should create a new bookmark', function(done) {
      supertest(app)
        .post('/bookmarks')
        .send(bookmarkData)
        .set({Accept: 'application/json', Authorization: token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('url', bookmarkData.url);
          expect(res.body).to.have.property('name', bookmarkData.url);
          expect(res.body).to.have.property('content');
          done();
        });
    });
  });

  describe('#getOne()'.cyan, function() {
    it('should get a single bookmark', function(done) {
      supertest(app)
        .get('/bookmarks/' + bookmark._id)
        .set({Accept: 'application/json', Authorization: token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.eql(bookmark);
          done();
        });
    });
  });

  describe('#put()'.cyan, function() {
    it('should update a specific bookmark', function(done) {
      var update = {
        name: 'portfolio',
        url: 'https://www.google.com/'
      };
      supertest(app)
        .put('/bookmarks/' + bookmark._id)
        .send(update)
        .set({Accept: 'application/json', Authorization: token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          bookmark = res.body;
          expect(res.body).to.have.property('name', update.name);
          expect(res.body).to.have.property('url', update.url);
          done();
        });
    });
  });

  describe('#delete()'.cyan, function() {
    it('should delete a specific bookmark', function(done) {
      supertest(app)
        .delete('/bookmarks/' + bookmark._id)
        .set({Accept: 'application/json', Authorization: token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.eql(bookmark);
          done();
        });
    });
  });
});
