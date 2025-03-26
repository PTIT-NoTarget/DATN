const authService = require("../../app/services/auth-services");
const db = require("../../app/models/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../app/models/index.js", () => {
  return {
    user: {
      findOne: jest.fn(),
    },
    project: {
      belongsToMany: jest.fn(),
    },
    Sequelize: {
      Op: {},
    },
  };
});

describe("Auth Service - signin", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        username: "testuser",
        password: "password123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 404 if user is not found", async () => {
    // Prepare
    db.user.findOne.mockReturnValue(Promise.resolve(null));
  

    // Execute
    await authService.signin(req, res);

    // Assert
    expect(db.user.findOne).toHaveBeenCalledWith({
      where: { username: "testuser" },
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should return 401 if password is invalid", async () => {
    // Prepare
    const mockUser = {
      id: "user123",
      username: "testuser",
      password: "hashedPassword",
    };
    db.user.findOne.mockReturnValue(Promise.resolve(mockUser));
    bcrypt.compareSync.mockReturnValue(false);

    // Execute
    await authService.signin(req, res);

    // Assert
    expect(db.user.findOne).toHaveBeenCalledWith({
      where: { username: "testuser" },
    });
    expect(bcrypt.compareSync).toHaveBeenCalledWith(
      "password123",
      "hashedPassword"
    );
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      message: "Invalid password!",
    });
  });

  it("should return 200 with token if credentials are valid", async () => {
    // Prepare
    const mockUser = {
      id: "user123",
      username: "testuser",
      email: "test@example.com",
      password: "hashedPassword",
    };
    db.user.findOne.mockReturnValue(Promise.resolve(mockUser));
    bcrypt.compareSync.mockReturnValue(true);
    jwt.sign.mockReturnValue("fake-jwt-token");

    // Execute
    await authService.signin(req, res);

    // Assert
    expect(db.user.findOne).toHaveBeenCalledWith({
      where: { username: "testuser" },
    });
    expect(bcrypt.compareSync).toHaveBeenCalledWith(
      "password123",
      "hashedPassword"
    );
    expect(jwt.sign).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      id: "user123",
      username: "testuser",
      email: "test@example.com",
      accessToken: "fake-jwt-token",
    });
  });

  it("should handle server errors", async () => {
    // Prepare
    const errorMessage = "Database connection error";
    db.user.findOne.mockImplementation(() => {
      return Promise.reject(new Error(errorMessage));
    });

    // Execute
    await authService.signin(req, res);

    // Assert
    expect(db.user.findOne).toHaveBeenCalledWith({
      where: { username: "testuser" },
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: errorMessage,
    });
  });
});
