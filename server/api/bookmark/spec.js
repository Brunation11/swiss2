var app = require('../../server'),
    request = require('supertest'),
    expect = require('chai').expect,
    UserModel = require('../user/model'),
    FolderModel = require('../folder/model'),
    BookmarkModel = require('./model');

describe('[BOOKMARKS]'.bold.green, function() {
  var token,
      userData = {
        username: 'username-test',
        password: 'password-test',
        email: 'email-test'
      },
      folder,
      folderData = {
        name: 'folder-test'
      },
      bookmark,
      bookmarkData = {
        url: 'http://www.brunozatta.com/'
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
    BookmarkModel.collection.drop();

    request(app)
      .post('/folders')
      .send(folderData)
      .set({Accept: 'application/json', Authorization: token})
      .end(function(err, res) {
        folder = res.body;
        request(app)
          .post('/folders/' + folder._id + '/bookmarks')
          .send(bookmarkData)
          .set({Accept: 'application/json', Authorization: token})
          .end(function(err, res) {
            bookmark = res.body;
            done();
          });
      });
  });

  describe('#get()'.cyan, function() {
    it('should get all bookmarks', function(done) {
      request(app)
        .get('/folders/' + folder._id + '/bookmarks')
        .set({Accept: 'application/json', Authorization: token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.have.property('url', bookmark.url);
          expect(res.body.length).to.eql(1);
          done();
        });
    });
  });

  // describe('#post()'.cyan, function() {
  //   it('should create a new bookmark', function(done) {
  //     request(app)
  //       .post('/folders/' + folder._id + '/bookmarks')
  //       .send(bookmarkData)
  //       .set({Accept: 'application/json', Authorization: token})
  //       .expect('Content-Type', /json/)
  //       .expect(200)
  //       .end(function(err, res) {
  //         console.log(res.body);
  //         expect(res.body).to.be.an('object');
  //         expect(res.body).to.have.property('url', bookmarkData.url);
  //         done();
  //       });
  //   });
  // });

  // describe('#getOne()'.cyan, function() {
  //   it('should get a single bookmark', function(done) {
  //     request(app)
  //       .get('/folders/' + folder._id + '/bookmarks/' + bookmark._id)
  //       .set({Accept: 'application/json', Authorization: token})
  //       .expect('Content-Type', /json/)
  //       .expect(200)
  //       .end(function(err, res) {
  //         expect(res.body).to.eql(bookmark);
  //         done();
  //       });
  //   });
  // });

  // describe('#put()'.cyan, function() {
  //   it('should update a specific bookmark', function(done) {
  //     var update = {
  //       url: 'https://www.google.com/'
  //     };
  //     request(app)
  //       .put('/folders/' + folder._id + '/bookmarks/' + bookmark._id)
  //       .send(update)
  //       .set({Accept: 'application/json', Authorization: token})
  //       .expect('Content-Type', /json/)
  //       .expect(200)
  //       .end(function(err, res) {
  //         expect(res.body).to.have.property('url', update.url);
  //         done();
  //       });
  //   });
  // });

  // describe('#delete()'.cyan, function() {
  //   it('should delete a specific bookmark', function(done) {
  //     request(app)
  //       .delete('/folders/' + folder._id + '/bookmarks/' + bookmark._id)
  //       .set({Accept: 'application/json', Authorization: token})
  //       .expect('Content-Type', /json/)
  //       .expect(200)
  //       .end(function(err, res) {
  //         expect(res.body).to.eql(bookmark);
  //         request(app)
  //           .get('/folders/' + folder._id + '/bookmarks')
  //           .set({Accept: 'application/json', Authorization: token})
  //           .end(function(err, res) {
  //             expect(res.body.length).to.eql(0);
  //             done();
  //           });
  //       });
  //   });
  // });
});