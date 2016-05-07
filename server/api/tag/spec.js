var app = require('../../server'),
    request = require('supertest'),
    expect = require('chai').expect,
    faker = require('faker'),
    UserModel = require('../user/model'),
    TagModel = require('./model');

describe('[TAGS]'.bold.green, function() {
  var token,
      user,
      userData = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      },
      tag,
      tagData = {
        name: faker.lorem.word()
      };

  before(function(done) {
    UserModel.collection.drop();
    TagModel.collection.drop();
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
              .post('/tags')
              .send(tagData)
              .set({Accept: 'application/json', Authorization: token})
              .end(function(err, res) {
                tag = res.body;
                done();
              });
          });
      });
  });

  describe('Model'.green, function() {
    describe('#new()'.cyan,function() {
      it('should succesfully create a new tag', function(done) {
        var sampleTag = new TagModel(tagData);
        sampleTag.save(function(err, saved) {
          expect(saved).to.be.an.instanceof(TagModel);
          expect(saved).to.have.property('name', tagData.name);
          done();
        });
      });
    });
  });

  describe('Controller'.green, function() {
    describe('#get()'.cyan, function() {
      it('should get all of a users tags', function(done) {
        request(app)
          .get('/tags')
          .set({Accept: 'application/json', Authorization: token})
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length.above(1);
            expect(res.body[0]).to.eql(tag);
            done();
          });
      });
    });

    describe('#post()'.cyan, function() {
      it('should add a new tag', function(done) {
        request(app)
          .post('/tags')
          .send(tagData)
          .set({Accept: 'application/json', Authorization: token})
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('name', tagData.name);
            done();
          });
      });
    });

    describe('#getOne()'.cyan, function() {
      it('should get a specific tag', function(done) {
        request(app)
          .get('/tags/' + tag._id)
          .set({Accept: 'application/json', Authorization: token})
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            expect(res.body).to.have.property('_id', tag._id);
            expect(res.body).to.have.property('name', tag.name);
            done();
          });
      });
    });


    describe('#put()'.cyan, function() {
      it('should update a specific tag', function(done) {
        var update = {
          name: 'updatedTagName-test'
        };
        request(app)
          .put('/tags/' + tag._id)
          .send(update)
          .set({Accept: 'application/json', Authorization: token})
          .expect('Content-type', /json/)
          .expect(200)
          .end(function(err, res) {
            expect(res.body).to.not.eql(tag);
            expect(res.body).to.have.property('name', update.name);
            done();
          });
      });
    });

    describe('#delete()'.cyan, function() {
      it('should delete a specific tag', function(done) {
        request(app)
          .delete('/tags/' + tag._id)
          .set({Accept: 'application/json', Authorization: token})
          .expect('Content-type', /json/)
          .expect(200)
          .end(function(err, res) {
            expect(res.body).to.have.property('_id', tag._id);
            done();
          });
      });
    });
  });
});