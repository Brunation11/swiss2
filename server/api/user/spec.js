var app = require('../../server'),
    request = require('supertest'),
    faker = require('faker'),
    expect = require('chai').expect,
    UserModel = require('./model');

describe('[USER]'.bold.green, function() {
  var userData = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  };

  describe('Model'.green, function() {
    before(function(done) {
      UserModel.collection.drop();
      done();
    });

    describe('#new()'.cyan,function() {
      it('should succesfully create a new user', function(done) {
        var sampleUser = new UserModel(userData);
        sampleUser.setPassword(userData.password);
        sampleUser.save(function(err, saved) {
          expect(saved).to.be.an.instanceof(UserModel);
          expect(saved).to.have.property('firstName', userData.firstName);
          expect(saved).to.have.property('lastName', userData.lastName);
          expect(saved).to.have.property('username', userData.username);
          expect(saved).to.have.property('email', userData.email);
          expect(saved).to.not.have.property('password');
          expect(saved.fullName()).to.eql(saved.firstName + " " + saved.lastName);
          UserModel.collection.drop();
          done();
        })
      });
    });
  });

  describe('Authentication'.green, function() {
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
});