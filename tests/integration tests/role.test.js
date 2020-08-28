require("dotenv").config({ path: `./.env.${process.env.NODE_ENV}` });
const request = require("supertest");
const { Role } = require("../../models/role");
const jwt = require("jsonwebtoken");
const generateToken = require("../../helpers/generatetoken");
let server;

describe("/api/v1/roles", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Role.deleteMany({});
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

  const createRole = async function () {
    const role = new Role({
      name: "testing genre1",
    });
    await role.save();
    return role;
  };

  describe("GET /", () => {
    it("should return 401 if auth token is not provided.", async () => {
      const res = await request(server).get("/api/v1/roles");
      expect(res.status).toBe(401);
    });
    it("should return 403 if invalid user role.", async () => {
      const token = generateAuthToken({ name: "invalid user role." });
      const res = await request(server)
        .get("/api/v1/roles")
        .set("x-auth-token", token);
      expect(res.status).toBe(403);
    });
    it("should return list of roles / status 200", async () => {
      await createRole();
      const token = generateAuthToken({ name: "administrator" });
      const res = await request(server)
        .get("/api/v1/roles")
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
  });

  describe("GET /:id", () => {
    it("should return 401 if auth token is not provided.", async () => {
      const res = await request(server).get("/api/v1/roles/1");
      expect(res.status).toBe(401);
    });
    it("should return 403 if invalid user role.", async () => {
      const token = generateAuthToken({ name: "invalid user role." });
      const res = await request(server)
        .get("/api/v1/roles/1")
        .set("x-auth-token", token);
      expect(res.status).toBe(403);
    });
    it("should return role / status 200", async () => {
      const role = await createRole();
      const token = generateAuthToken({ name: "administrator" });
      const res = await request(server)
        .get(`/api/v1/roles/${role._id}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", role.name);
    });
  });

  describe("POST /", () => {
    it("should return 401 if auth token is not provided.", async () => {
      const res = await request(server).post("/api/v1/roles");
      expect(res.status).toBe(401);
    });
    it("should return 403 if invalid user role.", async () => {
      const token = generateAuthToken({ name: "invalid user role." });
      const res = await request(server)
        .post("/api/v1/roles")
        .set("x-auth-token", token);
      expect(res.status).toBe(403);
    });
    it("should return status 400 when invalid role is provided.", async () => {
      const role = {
        name: "",
      };
      const token = generateAuthToken({ name: "administrator" });
      const res = await request(server)
        .post(`/api/v1/roles`)
        .set("x-auth-token", token)
        .send(role);
      expect(res.status).toBe(400);
    });
    it("should return role / status 200", async () => {
      const role = {
        name: "testrole",
      };
      const token = generateAuthToken({ name: "administrator" });
      const res = await request(server)
        .post(`/api/v1/roles`)
        .set("x-auth-token", token)
        .send(role);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", role.name);
    });
  });

  describe("PUT /:id", () => {
    it("should return 401 if auth token is not provided.", async () => {
      const res = await request(server).put("/api/v1/roles/1");
      expect(res.status).toBe(401);
    });
    it("should return 403 if invalid user role.", async () => {
      const token = generateAuthToken({ name: "invalid user role." });
      const res = await request(server)
        .put("/api/v1/roles/1")
        .set("x-auth-token", token);
      expect(res.status).toBe(403);
    });

    it("should return 404 if invalid role id is provided.", async () => {
      const token = generateAuthToken({ name: "administrator" });
      const res = await request(server)
        .put("/api/v1/roles/1")
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });

    it("should return status 400 when invalid role is provided.", async () => {
      let role = await createRole();
      const updatedRole = {
        name: "",
      };
      const token = generateAuthToken({ name: "administrator" });
      const res = await request(server)
        .put(`/api/v1/roles/${role._id}`)
        .set("x-auth-token", token)
        .send(updatedRole);
      expect(res.status).toBe(400);
    });
    it("should return role / status 200", async () => {
      let role = await createRole();
      const updatedRole = {
        name: "updated role",
      };
      const token = generateAuthToken({ name: "administrator" });
      const res = await request(server)
        .put(`/api/v1/roles/${role._id}`)
        .set("x-auth-token", token)
        .send(updatedRole);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", updatedRole.name);
    });
  });

  describe("DELETE /:id", () => {
    it("should return 401 if auth token is not provided.", async () => {
      const res = await request(server).delete("/api/v1/roles/1");
      expect(res.status).toBe(401);
    });
    it("should return 403 if invalid user role.", async () => {
      const token = generateAuthToken({ name: "invalid user role." });
      const res = await request(server)
        .delete("/api/v1/roles/1")
        .set("x-auth-token", token);
      expect(res.status).toBe(403);
    });

    it("should return 404 if invalid role id is provided.", async () => {
      const token = generateAuthToken({ name: "administrator" });
      const res = await request(server)
        .delete("/api/v1/roles/1")
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });

    it("should return role / status 200", async () => {
      let role = await createRole();
      const token = generateAuthToken({ name: "administrator" });
      const res = await request(server)
        .delete(`/api/v1/roles/${role._id}`)
        .set("x-auth-token", token);
      const roles = await Role.find();
      expect(res.status).toBe(200);
      expect(roles.length).toBe(0);
      expect(res.body).toHaveProperty("name", role.name);
    });
  });
});
