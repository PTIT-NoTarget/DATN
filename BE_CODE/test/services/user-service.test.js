const userService = require("../../app/services/user-services");
const db = require("../../app/models/index");

jest.mock("../../app/models/index.js", () => {
  return {
    user: {
      findByPk: jest.fn(),
    },
  };
});

describe("User Service - getUserById", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {
        id: "user123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 404 if user is not found", async () => {
    // Prepare
    db.user.findByPk.mockReturnValue(Promise.resolve(null));

    // Execute
    await userService.getUserById(req, res);

    // Assert
    expect(db.user.findByPk).toHaveBeenCalledWith("user123");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should return user data without password if user exists", async () => {
    // Prepare
    const mockUser = {
      id: "user123",
      username: "testuser",
      email: "test@example.com",
      password: "hashedPassword",
    };
    db.user.findByPk.mockReturnValue(Promise.resolve(mockUser));

    // Execute
    await userService.getUserById(req, res);

    // Assert
    expect(db.user.findByPk).toHaveBeenCalledWith("user123");
    expect(res.json).toHaveBeenCalledWith({
      id: "user123",
      username: "testuser",
      email: "test@example.com",
    });
  });

  it("should handle server errors", async () => {
    // Prepare
    const errorMessage = "Database error";
    db.user.findByPk.mockImplementation(() => {
      return Promise.reject(new Error(errorMessage));
    });

    // Execute
    await userService.getUserById(req, res);

    // Assert
    expect(db.user.findByPk).toHaveBeenCalledWith("user123");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
