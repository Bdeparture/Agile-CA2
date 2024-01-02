import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import Person from "../../../../api/people/peopleModel";
import api from "../../../../index";
import people from "../../../../seedData/people";
import User from "../../../../api/users/userModel";

// set up seed data for datastore
const expect = chai.expect;
let db;
let token;
let page;
let personId;
describe("People endpoint", () => {
    before(() => {
        mongoose.connect(process.env.MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = mongoose.connection;
    });
    beforeEach(async () => {
        try {
            await Person.deleteMany();
            await Person.collection.insertMany(people);
            await User.deleteMany();
            // Register a user
            await request(api).post("/api/users?action=register").send({
                username: "user1",
                password: "test1",
            });
        } catch (err) {
            console.error(`failed to Load user Data: ${err}`);
        }
    });
    after(async () => {
        try {
            await Person.deleteMany();
        } catch (error) {
            console.log(error);
        }
    });
    afterEach(() => {
        api.close(); // Release PORT 8080
    });
    describe("GET /api/people", () => {
        it("should return 20 people and a status 200", (done) => {
            request(api)
                .get(`/api/people`)
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.body.results).to.be.a("array");
                    expect(res.body.total_results).to.equal(20);
                    done();
                });
        });
    });

    describe("GET /api/people/tmdb/:id", () => {
        describe("for valid id", () => {
            it("should an object of people and a status 200", (done) => {
                request(api)
                    .get(`/api/people/tmdb/${people[0].id}`)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.property("name", people[0].name);
                        done();
                    });
            });
        });
        describe("for invalid id", () => {
            it("should return the NOT found message", () => {
                request(api)
                    .get(`/api/people/tmdb/123123`)
                    .expect("Content-Type", /json/)
                    .expect(404)
                    .expect({ message: 'The resource you requested could not be found.', status_code: 404 })
            });
        });
    });

    describe("GET /api/people/tmdb/peopleList/:page", () => {
        describe("when the page is valid number", () => {
            it('should return popular movies for a given page', (done) => {
              const page = 1;
              chai.request(api)
              .get(`/api/people/tmdb/peopleList/${page}`)
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect("Content-Type", /json/)
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('results').that.is.an('array');
                res.body.results.forEach((movie) => {
                  expect(movie).to.have.property('id');
                  expect(movie).to.have.property('name');
                });
                done();
              });
            });
          });
          describe("when the page is invalid number", () => {
            it("should return a status 404 and the corresponding message", (done) => {
              const page = 0;
              chai.request(api)
                .get(`/api/people/tmdb/peopleList/${page}`)
                .end((err, res) => {
                  expect(res).to.have.status(404);
                  expect("Content-Type", /json/)
                  expect(res.body).to.deep.equal({ message: 'Invalid page form.', status_code: 404 });
                  done();
                });
            });
          });

    });


    describe("GET /api/people/tmdb/:id/peopleImages", () => {

        describe("for a valid id", () => {
            before(() => {
                personId = 287;
            })
            it("should return a person's images from tmdb and a status 200", () => {
                return request(api)
                    .get(`/api/people/tmdb/${personId}/peopleImages`)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then((res) => {
                        expect(res.body).to.have.property("id", personId);
                        expect(res.body).to.have.property("profiles");
                    });
            });
        });
        describe("for an invalid id", () => {
            before(() => {
                personId = "qwe"
            })
            it("should return error message and a status 404", () => {
                return request(api)
                    .get(`/api/people/tmdb/${personId}/peopleImages`)
                    .expect("Content-Type", /json/)
                    .expect(404)
                    .expect({
                        message: 'Invalid person id.', status_code: 404
                    });
            });
        });
    });


    describe("GET /api/people/tmdb/:id/peopleMovieCredits", () => {

        describe("for a valid id", () => {
            before(() => {
                personId = 287;
            })
            it("should return a person's movie credits from tmdb and a status 200", () => {
                return request(api)
                    .get(`/api/people/tmdb/${personId}/peopleMovieCredits`)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then((res) => {
                        expect(res.body).to.have.property("cast");
                        expect(res.body.cast).to.be.a("array");
                    });
            });
            describe("for an invalid id", () => {
                before(() => {
                    personId = "qwe"
                })
                it("should return error message and a status 404", () => {
                    return request(api)
                        .get(`/api/people/tmdb/${personId}/peopleMovieCredits`)
                        .expect("Content-Type", /json/)
                        .expect(404)
                        .expect({
                            message: 'Invalid person id.', status_code: 404
                        });
                });
            });
        });
    });
});      