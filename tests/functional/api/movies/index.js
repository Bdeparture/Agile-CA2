import chai from "chai";
const chaiHttp = require('chai-http');
import request from "supertest";
const mongoose = require("mongoose");
import Movie from "../../../../api/movies/movieModel";
import api from "../../../../index";
import movies from "../../../../seedData/movies";

const expect = chai.expect;
let db;

describe("Movies endpoint", () => {
  before(() => {
    mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = mongoose.connection;
  });

  after(async () => {
    try {
      await Movie.deleteMany();
    } catch (error) {
      console.log(error);
    }
  });

  beforeEach(async () => {
    try {
      await Movie.deleteMany();
      await Movie.collection.insertMany(movies);
    } catch (err) {
      console.error(`failed to Load user Data: ${err}`);
    }
  });
  afterEach(() => {
    api.close(); // Release PORT 8080
  });
  describe("GET /api/movies ", () => {
    it("should return 20 movies and a status 200", (done) => {
      request(api)
        .get("/api/movies")
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.a("array");
          expect(res.body.length).to.equal(20);
          done();
        });
    });
  });

  describe("GET /api/movies/tmdb/:id", () => {
    describe("when the id is valid", () => {
      it("should return the matching movie", () => {
        return request(api)
          .get(`/api/movies/tmdb/${movies[0].id}`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("title", movies[0].title);
          });
      });
    });
    describe("when the id is invalid", () => {
      it("should return the NOT found message", () => {
        return request(api)
          .get("/api/movies/tmdb/00000")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(404)
          .expect({
            status_code: 404,
            message: "The resource you requested could not be found.",
          });
      });
    });
  });

  chai.use(chaiHttp);
  describe('GET /api/movies/tmdb/popular/:page', () => {
    describe("when the page is valid number", () => {
      it('should return popular movies for a given page', (done) => {
        const page = 1;
        chai.request(api)
          .get(`/api/movies/tmdb/popular/${page}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect("Content-Type", /json/)
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('results').that.is.an('array');
            res.body.results.forEach((movie) => {
              expect(movie).to.have.property('id');
              expect(movie).to.have.property('title');
              expect(movie).to.have.property('overview');
              expect(movie).to.have.property('popularity').that.is.a('number');
            });
            done();
          });
      });
    });
    describe("when the page is invalid number", () => {
      it("should return a status 404 and the corresponding message", (done) => {
        const page = 0;
        chai.request(api)
          .get(`/api/movies/tmdb/popular/${page}`)
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect("Content-Type", /json/)
            expect(res.body).to.deep.equal({ message: 'Invalid page form.', status_code: 404 });
            done();
          });
      });
    });
  });


  describe('GET /api/movies/tmdb/upcoming/:page', () => {
    describe("when the page is valid number", () => {
      it('should return upcoming movies for a given page', (done) => {
        const page = 1;
        chai.request(api)
          .get(`/api/movies/tmdb/upcoming/${page}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect("Content-Type", /json/)
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('results').that.is.an('array');
            res.body.results.forEach((movie) => {
              expect(movie).to.have.property('id');
              expect(movie).to.have.property('title');
              expect(movie).to.have.property('overview');
              expect(movie).to.have.property('popularity').that.is.a('number');
            });
            done();
          });
      });
    }),
      describe("when the page is invalid number", () => {
        it("should return a status 404 and the corresponding message", (done) => {
          const page = 0;
          chai.request(api)
            .get(`/api/movies/tmdb/upcoming/${page}`)
            .end((err, res) => {
              expect(res).to.have.status(404);
              expect("Content-Type", /json/)
              expect(res.body).to.deep.equal({ message: 'Invalid page form.', status_code: 404 });
              done();
            });
        });
      });
  });

  describe('GET /api/movies/tmdb/topRated/:page', () => {
    describe("when the page is valid number", () => {
      it('should return topRated movies for a given page', (done) => {
        const page = 1;
        chai.request(api)
          .get(`/api/movies/tmdb/topRated/${page}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect("Content-Type", /json/)
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('results').that.is.an('array');
            res.body.results.forEach((movie) => {
              expect(movie).to.have.property('id');
              expect(movie).to.have.property('title');
              expect(movie).to.have.property('overview');
              expect(movie).to.have.property('popularity').that.is.a('number');
            });
            done();
          });
      });
    });
    describe("when the page is invalid number", () => {
      it("should return a status 404 and the corresponding message", (done) => {
        const page = 0;
        chai.request(api)
          .get(`/api/movies/tmdb/topRated/${page}`)
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect("Content-Type", /json/)
            expect(res.body).to.deep.equal({ message: 'Invalid page form.', status_code: 404 });
            done();
          });
      });
    });
  });

  describe("GET /api/movies/tmdb/:id/images", () => {
    describe("when the id is valid number", () => {
      it("should return an object containing the images and status 200", () => {
        return request(api)
          .get(`/api/movies/tmdb/${movies[0].id}/images`)
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("id", movies[0].id);
            expect(res.body).to.have.property("backdrops");
            expect(res.body).to.have.property("posters");
          });
      });
    });
    describe("when the id is not number", () => {
      it("should return a status 404 and the corresponding message", () => {
        return request(api)
          .get(`/api/movies/tmdb/qwe/images`)
          .expect("Content-Type", /json/)
          .expect(404)
          .expect({ message: 'The resource you requested could not be found.', status_code: 404 });
      });
    });
  })

  describe("GET /api/movies/tmdb/:id/movie_credits", () => {
    describe("when the id is valid number", () => {
      it("should return an object containing the movie_credits and status 200", () => {
        return request(api)
          .get(`/api/movies/tmdb/${movies[0].id}/movie_credits`)
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("id", movies[0].id);
          });
      });
    });
    describe("when the id is not number", () => {
      it("should return a status 404 and the corresponding message", () => {
        return request(api)
          .get(`/api/movies/tmdb/qwe/movie_credits`)
          .expect("Content-Type", /json/)
          .expect(404)
          .expect({ message: 'The resource you requested could not be found.', status_code: 404 });
      });
    });
  })

  describe("GET /api/movies/:id/reviews", () => {
    describe("when the id is valid number", () => {
      it("should return a list of the reviews in tmdb and status 200", () => {
        return request(api)
          .get(`/api/movies/${movies[0].id}/reviews`)
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("id", movies[0].id);
            expect(res.body.results).to.be.a("array");
          });
      });
    });

    describe("when the id is not number", () => {
      it("should return a status 404 and the corresponding message", () => {
        return request(api)
          .get(`/api/movies/abc/reviews`)
          .expect("Content-Type", /json/)
          .expect(404)
          .expect({ message: 'The resource you requested could not be found.', status_code: 404 });
      });

    });
  });
  describe("POST /api/movies/:id/reviews", () => {
    const postData = {
      "username": "user123",
      "rating": 4.5,
      "comment": "This movie is great! Highly recommended."
    };
    describe("when the id is valid number", () => {
      it("should return a list of the reviews in tmdb and status 200", () => {
        return request(api)
          .post(`/api/movies/${movies[0].id}/reviews`)
          .send(postData)
          .set("Accept", "application/json")
          .expect(201)
          .then((res) => {
            expect(res.body).to.have.property("id").that.is.a("string");
          });
      });
    });

    describe("when the id is not number", () => {
      it("should return a status 404 and the corresponding message", () => {
        return request(api)
        .post(`/api/movies/abc/reviews`)
        .send(postData)
        .set("Accept", "application/json")
          .expect(404)
          .expect({ message: 'The resource you requested could not be found.', status_code: 404 });
      });

    });
  });
});
