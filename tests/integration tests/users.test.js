require("dotenv").config({ path: `./.env.${process.env.NODE_ENV}` });
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { hash } = require("../../helpers/hash");
const { User } = require("../../models/user");
const { Role } = require("../../models/role");
const generateToken = require("../../helpers/generateToken");
let server;

describe("/api/v1/users", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Role.deleteMany({});
    await User.deleteMany({});
    server.close();
  });

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

  let generateUser = async function (assignedRole) {
    let role = new Role({
      name: assignedRole,
    });
    await role.save();
    let user = new User({
      name: "test",
      email: "testemail@test.com",
      password: await hash("test123131313"),
      roles: [role],
    });
    await user.save();
    return user;
  };

  describe("GET /", () => {
    it("should return 401 if user auth token is not provided.", async () => {
      const res = await request(server).get("/api/v1/users");
      expect(res.status).toBe(401);
    });
    it("should return 403 if user role is not authorized.", async () => {
      const token = generateAuthToken({ name: "testrole" });
      const res = await request(server)
        .get("/api/v1/users")
        .set("x-auth-token", token);
      expect(res.status).toBe(403);
    });
    it("should return list of users", async () => {
      let user = await generateUser("administrator");
      const token = generateAuthToken({ name: "administrator" });
      const res = await request(server)
        .get("/api/v1/users")
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
  });
  describe("GET /:id", () => {
    it("should return 401 if user auth token is not provided.", async () => {
      const res = await request(server).get("/api/v1/users/1");
      expect(res.status).toBe(401);
    });
    it("should return 403 if user role is not authorized.", async () => {
      const token = generateAuthToken({ name: "testrole" });
      const res = await request(server)
        .get("/api/v1/users/1")
        .set("x-auth-token", token);
      expect(res.status).toBe(403);
    });
    it("should return a user", async () => {
      let user = await generateUser("administrator");
      const token = generateAuthToken({ name: "administrator" });
      const res = await request(server)
        .get(`/api/v1/users/${user._id}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("email", user.email);
      expect(res.body).toHaveProperty("name", user.name);
    });
  });
});
