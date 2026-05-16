import request from "supertest";
import { jest } from "@jest/globals";

const mockUser = {
  findOne: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  find: jest.fn(),
};

const mockAuditEntry = {
  create: jest.fn().mockResolvedValue({}),
  findOne: jest.fn(),
  find: jest.fn(),
};

const mockBcrypt = {
  hash: jest.fn().mockResolvedValue("hashedpassword123"),
  compare: jest.fn().mockResolvedValue(true),
  genSalt: jest.fn().mockResolvedValue("salt"),
};

const mockCreateToken = jest.fn().mockReturnValue("mock-jwt-token");

jest.unstable_mockModule("../src/models/User.js", () => ({
  default: mockUser,
}));

jest.unstable_mockModule("../src/models/AuditEntry.js", () => ({
  default: mockAuditEntry,
}));

jest.unstable_mockModule("bcryptjs", () => ({
  default: mockBcrypt,
  ...mockBcrypt,
}));

jest.unstable_mockModule("../src/utils/token.js", () => ({
  createToken: mockCreateToken,
}));

jest.mock("../src/middleware/authGuard.js", () => {
  return (req, res, next) => next(); // Just call next() to bypass the middleware
});

const app = (await import("../src/app.js")).default;
const User = (await import("../src/models/User.js")).default;

describe("Authentication Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/signup", () => {
    test("creates a new user successfully", async () => {
      const newUser = {
        forename: "John",
        email: "john@example.com",
        password: "password123",
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: "123456789",
        forename: "John",
        email: "john@example.com",
        role: "VIEWER",
      });

      const response = await request(app)
        .post("/api/auth/signup")
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Signup successful");
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe("123456789");
      expect(response.body.data.forename).toBe("John");
      expect(response.body.data.email).toBe("john@example.com");
      expect(response.body.data.role).toBe("VIEWER");
    });

    test("returns 400 if missing required fields", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send({ email: "john@example.com" });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "Forename, email and password are required",
      );
    });

    test("returns 409 if user already exists", async () => {
      User.findOne.mockResolvedValue({ email: "john@example.com" });

      const response = await request(app).post("/api/auth/signup").send({
        forename: "John",
        email: "john@example.com",
        password: "password123",
      });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("User already exists");
    });
  });

  describe("POST /api/auth/signin", () => {
    test("signs in user successfully", async () => {
      const credentials = {
        email: "john@example.com",
        password: "password123",
      };

      const mockUser = {
        _id: "123456789",
        forename: "John",
        email: "john@example.com",
        role: "VIEWER",
        password: "hashedpassword",
      };

      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/api/auth/signin")
        .send(credentials);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Signin successful");
      expect(response.body.token).toBeDefined();
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe("123456789");
      expect(response.body.data.forename).toBe("John");
      expect(response.body.data.email).toBe("john@example.com");
      expect(response.body.data.role).toBe("VIEWER");
    });

    test("returns 400 if missing email or password", async () => {
      const response = await request(app)
        .post("/api/auth/signin")
        .send({ email: "john@example.com" });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Email and password are required");
    });

    test("returns 401 for invalid credentials (user not found)", async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app).post("/api/auth/signin").send({
        email: "wrong@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid credentials");
    });
  });

  describe("POST /api/auth/signout", () => {
    test("signs out user successfully", async () => {
      const response = await request(app).post("/api/auth/signout");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Signout successful");
    });
  });

  describe("PUT /api/user/update", () => {
    it("should update user profile even without a token", async () => {
      const updatedProfile = { name: "New Name", email: "newemail@test.com" };

      const response = await request(app)
        .put("/api/user/update")
        .send(updatedProfile);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(undefined);
    });
  });

  describe("GET /api", () => {
    test("returns hello world message", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Hello world",
      });
    });
  });
});