import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import User from "../../../../api/users/userModel";
import users from "../../../../seedData/users";
import api from "../../../../index";
const sinon = require('sinon');

const expect = chai.expect;
let db;
let user1Id;


describe("Users endpoint", () => {
  before(() => {
    mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = mongoose.connection;
  });

  after(async () => {
    try {
      await User.deleteMany();
    } catch (error) {
      console.log(error);
    }
  });
  beforeEach(async () => {
    try {
      await User.deleteMany();
      // Register two users
      await request(api).post("/api/users?action=register").send({
        username: "user1",
        password: "test1",
      });
      await request(api).post("/api/users?action=register").send({
        username: "user2",
        password: "test2",
      });
      await request(api).post("/api/users/user1/favourites").send({
        id: 411
      });
      const response = await request(api)
        .get('/api/users')
        .set('Accept', 'application/json');
      user1Id = response.body.find(user => user.username === 'user1')?._id;
    } catch (err) {
      console.error(`failed to Load user test Data: ${err}`);
    }
  });
  afterEach(() => {
    api.close();
  });

  describe("PUT /api/users/update/:id", () => {
    it("should update a user and return 200 status", (done) => {
      const requestData = { username: "user3", password: "test3" };
      request(api)
        .put(`/api/users/update/${user1Id}`)
        .send(requestData)
        .set("Accept", "application/json")
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({
              code: 200,
              msg: "User Updated Successfully",
            });
            done();
          }
        });
    });

    it("should return 404 for non-existing user", () => {
      return request(api)
        .put("/api/users/update/aaa")
        .send({ username: "user3", password: "test3" })
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(404)
        .then((res) => {
          expect(res.body).to.deep.equal({
            code: 404,
            msg: "User not found",
          });
        });
    });
  });

  describe("POST /api/users/:userName/favourites", () => {
    describe("for valid user name", () => {
      describe("when the movie is not in favourites", () => {
        it("should return a status 200 and message", () => {
          return request(api)
            .post(`/api/users/${users[0].username}/favourites`)
            .send({
              id: 77660
            })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .expect({ message: 'Favourite movie added successfully' })
        });
      });
      describe("when the movie is in favourites", () => {
        it("return error message and a status 404", (done) => {  // <-- 添加 done 参数
          const findOneAndUpdateStub = sinon.stub(User, 'findOneAndUpdate');
          findOneAndUpdateStub.throws(new Error('Simulated database error'));

          request(api)
            .post('/user1/favourites')
            .send({ movieId: '1' })
            .expect(404)
            .end((err, res) => {
              if (err) return done(err);
              findOneAndUpdateStub.restore();
              done();
            });
        });
      });
    });
  });
  describe("GET /api/users/:userName/favourites", () => {
    it("should return the favourites list and status 200", () => {
      return request(api)
        .get(`/api/users/${users[0].username}/favourites`)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.a("array");
        });
    });
  });
  describe("DELETE /api/users/:userName/favourites", () => {
    describe("for valid user name", () => {
      describe("when the movie is in favourites", () => {
        it("should return user message and a status 201", () => {
          return request(api)
            .delete(`/api/users/${users[0].username}/favourites`)
            .send({
              id: 411
            })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .expect({ message: 'Favourite movie removed successfully' });
        });
      });
    });
  });
});