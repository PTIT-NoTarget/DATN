const departmentService = require("../../app/services/department-services");
const db = require("../../app/models/index");

jest.mock("../../app/models/index", () => {
  return {
    department: {
      findAndCountAll: jest.fn(),
      create: jest.fn(),
      findByPk: jest.fn(),
    },
    user: {
      findAll: jest.fn(),
      findByPk: jest.fn(),
    },
  };
});

describe("Department Service", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("should create a department", async () => {
    db.department.create.mockResolvedValue({ id: 1, name: "HR Department" });

    req.body = { name: "HR Department", description: "Handles HR tasks" };
    await departmentService.addADepartment(req, res);

    expect(res.send).toHaveBeenCalledWith({ message: "Department successfully registered" });
  });

  it("should return department by id", async () => {
    db.department.findByPk.mockResolvedValue({ id: 1, name: "Finance" });

    req.params = { id: 1 };
    await departmentService.getDepartmentById(req, res);

    expect(res.json).toHaveBeenCalledWith({ id: 1, name: "Finance" });
  });

  it("should return 404 if department not found", async () => {
    db.department.findByPk.mockResolvedValue(null);
    req.params = { id: 99 };
    await departmentService.getDepartmentById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Department not found" });
  });
});
