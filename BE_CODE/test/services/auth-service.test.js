const authService = require("../../app/services/auth-services");
const db = require("../../app/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const helper = require("../helper.test");
const configuration = require("../../app/config/config-jwt");

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Auth Service", () => {
  let req, res;

  beforeEach(async () => {
    await helper.setupTestDatabase();
    req = {
      body: {
        username: "johndoe",
        email: "john@example.com",
        password: "password123",
        fullName: "John Doe",
        sex: "0",
        dob: "1990-01-01",
        phoneNumber: "0123456789",
        address: "123 Street",
        position: "MANAGER",
        position_1: "DEV",
        position_level: "SENIOR",
        role: "admin",
        start_date: "2020-01-01",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(async () => {
    await helper.clearTestDatabase();
    jest.clearAllMocks();
  });

  describe("signup", () => {
    it("AUTH1: should create new user successfully and save to database", async () => {
      // Prepare
      bcrypt.hashSync.mockReturnValue("hashedPassword");
      const expectedUser = {
        ...req.body,
        password: "hashedPassword",
      };

      // Execute
      await authService.signup(req, res);

      // Assert
      // Kiểm tra response
      expect(res.send).toHaveBeenCalledWith({
        message: "User successfully registered",
      });

      // Kiểm tra database
      const savedUser = await db.user.findOne({
        where: { username: req.body.username },
      });
      expect(savedUser).toBeTruthy();
      expect(savedUser.username).toBe(expectedUser.username);
      expect(savedUser.email).toBe(expectedUser.email);
      expect(savedUser.password).toBe(expectedUser.password);
      expect(savedUser.fullName).toBe(expectedUser.fullName);
    });

    it("AUTH2: should return 500 if database error occurs", async () => {
      // Prepare
      const error = new Error("Database error");
      jest.spyOn(db.user, "create").mockRejectedValue(error);

      // Execute
      await authService.signup(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: error.message,
      });
    });
    it("AUTH3: should validate empty request body", async () => {
      // Prepare
      req.body = null;

      // Execute
      await authService.signup(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Request can't be empty!",
      });
    });

    it("AUTH4: should check for duplicate username", async () => {
      // Prepare
      await helper.createTestData(); // Creates a user with username "johndoe"

      // Execute
      await authService.signup(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Username already exists",
      });
    });
  });

  describe("signin", () => {
    it("AUTH5: should validate token expiration time", async () => {
      // Prepare
      await helper.createTestData();
      bcrypt.compareSync.mockReturnValue(true);

      // Execute
      await authService.signin(req, res);

      // Assert
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.any(Object),
        configuration.secret,
        { expiresIn: 600 }
      );
    });

    it("AUTH6: should return user data without password in response", async () => {
      // Prepare
      const testUser = {
        id: 1,
        username: "johndoe",
        email: "john@example.com",
        password: "hashedPassword",
      };
      await helper.createTestData();
      bcrypt.compareSync.mockReturnValue(true);
      jwt.sign.mockReturnValue("fake-token");

      // Execute
      await authService.signin(req, res);

      // Assert
      expect(res.send).toHaveBeenCalledWith({
        id: testUser.id,
        username: testUser.username,
        email: testUser.email,
        accessToken: "fake-token",
      });
      expect(res.send).not.toHaveBeenCalledWith(
        expect.objectContaining({ password: expect.any(String) })
      );
    });

    it("AUTH7: should return 400 if username/password missing", async () => {
      // Prepare
      req.body = {};

      // Execute
      await authService.signin(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Username and password are required",
      });
    });

    it("AUTH8: should return 404 if user not found", async () => {
      // Execute
      await authService.signin(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: "User not found",
      });
    });

    it("AUTH9: should return 401 if password invalid", async () => {
      // Prepare
      await helper.createTestData();
      bcrypt.compareSync.mockReturnValue(false);

      // Execute
      await authService.signin(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        message: "Invalid password!",
      });
    });

    it("AUTH10: should return 200 and token if credentials valid", async () => {
      // Prepare
      const user = {
        id: 1,
        username: "johndoe",
        email: "john@example.com",
      };
      await helper.createTestData();
      bcrypt.compareSync.mockReturnValue(true);
      jwt.sign.mockReturnValue("fake-token");

      // Execute
      await authService.signin(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        id: user.id,
        username: user.username,
        email: user.email,
        accessToken: "fake-token",
      });
    });
  });
});
