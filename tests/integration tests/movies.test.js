require("dotenv").config({ path: `./.env.${process.env.NODE_ENV}` });
const request = require("supertest");
const { Movie } = require("../../models/movie");
const { Genre } = require("../../models/genre");
const jwt = require("jsonwebtoken");
const generateToken = require("../../helpers/generatetoken");
let server;

describe("/api/v1/movies", () => {
  const generateAuthToken = function (role) {
    const user = {
      _id: "1",
      name: "testuser",
      roles: [],
    };
    user.roles.push(role);
    const token = generateToken(user);
    return token;
  };

  const createMovie = async function () {
    const genre = new Genre({
      name: "testing genre1",
    });
    await genre.save();
    const movie = new Movie({
      title: "Sons of Testing1",
      genre,
      numberInStock: 2,
      dailyRentalRate: 10,
    });
    await movie.save();
    return movie;
  };

  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Genre.deleteMany({});
    await Movie.deleteMany({});
    server.close();
  });

  describe("GET /", () => {
    it("should return 401 if auth token is not provided.", async () => {
      const res = await request(server).get("/api/v1/movies");

      expect(res.status).toBe(401);
    });

    it("should return 403 if user role is invalid.", async () => {
      const token = generateAuthToken({ name: "invalidrole" });

      const res = await request(server)
        .get("/api/v1/movies")
        .set("x-auth-token", token);

      expect(res.status).toBe(403);
    });

    it("should be able to access movie list", async () => {
      const movie = await createMovie();
      const token = generateAuthToken({ name: "administrator" });
      const res = await request(server)
        .get("/api/v1/movies")
        .set("x-auth-token", token);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
  });

  describe("GET /:id", () => {
    it("should return 401 if auth token is not provided.", async () => {
      const res = await request(server).get("/api/v1/movies/1");

      expect(res.status).toBe(401);
    });
    it("should return 403 if user role is invalid.", async () => {
      const token = generateAuthToken({ name: "invalidrole" });

      const res = await request(server)
        .get("/api/v1/movies/1")
        .set("x-auth-token", token);

      expect(res.status).toBe(403);
    });
    it("should return 404 if invalid id is provided.", async () => {
      const invalidId = 1;
      const token = generateAuthToken({ name: "administrator" });
      const res = await request(server)
        .get(`/api/v1/movies/${invalidId}`)
        .set("x-auth-token", token);

      expect(res.status).toBe(404);
    });
    it("should return a movie if valid id is provided.", async () => {
      const movie = await createMovie();
      const token = generateAuthToken({ name: "administrator" });
      const res = await request(server)
        .get(`/api/v1/movies/${movie._id}`)
        .set("x-auth-token", token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", movie.title);
    });
  });

  describe("POST /", () => {
    it("should return 401 if auth token is not provided.", async () => {
      const res = await request(server).post("/api/v1/movies");

      expect(res.status).toBe(401);
    });
    it("should return 403 if user role is invalid.", async () => {
      const token = generateAuthToken({ name: "invalidrole" });

      const res = await request(server)
        .post("/api/v1/movies")
        .set("x-auth-token", token);

      expect(res.status).toBe(403);
    });
    it("should return 400 when invalid movie object is provided.", async () => {
      const movie = {
        title: "",
        genre: "",
        numberInStock: "",
        dailyRentalRate: "",
      };

      const token = generateAuthToken({ name: "administrator" });
      const res = await request(server)
        .post("/api/v1/movies")
        .set("x-auth-token", token)
        .send(movie);

      expect(res.status).toBe(400);
      expect(res.body.length).toBeGreaterThan(0);
    });
    it("should return 404 when invalid genre id is provided.", async () => {
      const genre = new Genre({
        name: "testing genre1",
      });
      await genre.save();
      const movie = {
        title: "Sons of Testing12",
        genre: "5f3800265c28d43e64cddc7f",
        numberInStock: "2",
        dailyRentalRate: "10",
      };

      const token = generateAuthToken({ name: "administrator" });
      const res = await request(server)
        .post("/api/v1/movies")
        .set("x-auth-token", token)
        .send(movie);

      expect(res.status).toBe(404);
    });
    it("should return a movie / status 200 when valid movie is provided.", async () => {
      const genre = new Genre({
        name: "testing genre1",
      });
      await genre.save();
      const movie = {
        title: "Sons of Testing12",
        genre: genre._id,
        numberInStock: "2",
        dailyRentalRate: "10",
      };

      const token = generateAuthToken({ name: "administrator" });
      const res = await request(server)
        .post("/api/v1/movies")
        .set("x-auth-token", token)
        .send(movie);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", movie.title);
    });
  });

  describe("PUT /:id", () => {
    it("should return 401 if auth token is not provided.", async () => {
      const res = await request(server).put("/api/v1/movies/1");

      expect(res.status).toBe(401);
    });
    it("should return 403 if user role is invalid.", async () => {
      const token = generateAuthToken({ name: "invalidrole" });

      const res = await request(server)
        .put("/api/v1/movies/1")
        .set("x-auth-token", token);

      expect(res.status).toBe(403);
    });

    it("should return 400 when invalid movie object is provided.", async () => {
      const movie = await createMovie();
      const genre = new Genre({
        name: "testing genre2",
      });
      await genre.save();
      const updatedMovie = {
        title: "",
        genre: "",
        numberInStock: "",
        dailyRentalRate: "",
      };

      const token = generateAuthToken({ name: "administrator" });
      const res = await request(server)
        .put(`/api/v1/movies/${movie._id}`)
        .set("x-auth-token", token)
        .send(updatedMovie);

      expect(res.status).toBe(400);
    });

    it("should return 404 when invalid movie id is provided.", async () => {
      const invalidId = 1;
      const updatedMovie = {
        title: "",
        genre: "",
        numberInStock: "",
        dailyRentalRate: "",
      };
      const token = generateAuthToken({ name: "administrator" });
      const res = await request(server)
        .put(`/api/v1/movies/${invalidId}`)
        .set("x-auth-token", token)
        .send(updatedMovie);

      expect(res.status).toBe(404);
    });

    it("should return 404 when invalid genre id is provided.", async () => {
      const movie = await createMovie();
      const genre = new Genre({
        name: "testing genre2",
      });
      await genre.save();
      const updatedMovie = {
        title: "Sons of TestingUpdated",
        genre: "5f3800265c28d43e64cddc7f",
        numberInStock: "3",
        dailyRentalRate: "11",
      };

      const token = generateAuthToken({ name: "administrator" });
      const res = await request(server)
        .put(`/api/v1/movies/${movie._id}`)
        .set("x-auth-token", token)
        .send(updatedMovie);

      expect(res.status).toBe(404);
    });

    it("should return a movie / status 200 when valid movie is provided.", async () => {
      const movie = await createMovie();
      const genre = new Genre({
        name: "testing genre2",
      });
      await genre.save();
      const updatedMovie = {
        title: "Sons of TestingUpdated",
        genre: genre._id,
        numberInStock: "3",
        dailyRentalRate: "11",
      };

      const token = generateAuthToken({ name: "administrator" });
      const res = await request(server)
        .put(`/api/v1/movies/${movie._id}`)
        .set("x-auth-token", token)
        .send(updatedMovie);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("title", updatedMovie.title);
      expect(res.body).toHaveProperty("genre");
      expect(res.body).toHaveProperty(
        "numberInStock",
        parseInt(updatedMovie.numberInStock)
      );
      expect(res.body).toHaveProperty(
        "dailyRentalRate",
        parseInt(updatedMovie.dailyRentalRate)
      );
    });
  });

  describe("DELETE /:id", () => {
    it("should return 401 if auth token is not provided.", async () => {
      const res = await request(server).delete("/api/v1/movies/1");

      expect(res.status).toBe(401);
    });

    it("should return 403 if user role is invalid.", async () => {
      const token = generateAuthToken({ name: "invalidrole" });

      const res = await request(server)
        .delete("/api/v1/movies/1")
        .set("x-auth-token", token);

      expect(res.status).toBe(403);
    });
    it("should return 404 if invalid movie id is provided.", async () => {
      const token = generateAuthToken({ name: "administrator" });

      const res = await request(server)
        .delete("/api/v1/movies/1")
        .set("x-auth-token", token);

      expect(res.status).toBe(404);
    });
    it("should return a movie / status 200 when valid movie is provided.", async () => {
      const movie = await createMovie();

      const token = generateAuthToken({ name: "administrator" });
      const res = await request(server)
        .delete(`/api/v1/movies/${movie._id}`)
        .set("x-auth-token", token)
        .send(movie);
      const movies = await Movie.find({});
      expect(res.status).toBe(200);
      expect(movies.length).toBe(0);
      expect(res.body).toHaveProperty("title", movie.title);
    });
  });
});
