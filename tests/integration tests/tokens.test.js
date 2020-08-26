require("dotenv").config({ path: `./.env.${process.env.NODE_ENV}` });
const request = require("supertest");
const jwt = require("jsonwebtoken");
const { hash } = require("../../helpers/hash");
const { User } = require("../../models/user");
const { Role } = require("../../models/role");
let server;

describe("/api/v1/tokens", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Role.deleteMany({});
    await User.deleteMany({});
    server.close();
  });

  describe("POST /", () => {
    it("should return 400 when invalid user credential object is provided.", async () => {
      const res = await request(server)
        .post("/api/v1/tokens")
        .send({ email: "", password: "" });
      expect(res.status).toBe(400);
    });
    it("should return 401 when invalid user credentials are provided.", async () => {
      const res = await request(server)
        .post("/api/v1/tokens")
        .send({ email: "almodalalvin@gmail.com", password: "test1234" });
      expect(res.status).toBe(401);
    });

    it("should return a token status 200 when valid credentials are provided.", async () => {
      let role = new Role({
        name: "TestRole",
      });
      await role.save();
      let user = new User({
        name: "test",
        email: "testemail@test.com",
        password: await hash("test123131313"),
        roles: [role],
      });
      await user.save();
      const res = await request(server)
        .post("/api/v1/tokens")
        .send({ email: user.email, password: "test123131313" });

      const token = res.body.token;
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      expect(res.status).toBe(200);
      expect(decodedToken).toHaveProperty("name", "test");
    });
  });
});
