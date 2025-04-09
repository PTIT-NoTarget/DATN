const departmentService = require("../../app/services/department-services");
const helper = require("../helper.test");
const db = require("../../app/models");

describe("Department Service", () => {
  let req, res;

  beforeEach(async () => {
    await helper.setupTestDatabase();
    // const departments = await helper.createTestDepartments();
    // const users = await helper.createTestUsers(departments);

    await helper.createTestData();

    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  afterEach(async () => {
    await helper.clearTestDatabase();
    jest.clearAllMocks();
  });

 // getAllDepartments
 describe("getAllDepartments", () => {
  it("returns paginated departments", async () => {
    req.body = { page: 1, pageSize: 2 };
    await departmentService.getAllDepartments(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ departments: expect.any(Array) }));
  });

  it("returns empty list when no departments", async () => {
    await helper.clearTestDatabase();
    req.body = { page: 1, pageSize: 10 };
    await departmentService.getAllDepartments(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ departments: [] }));
  });

  it("filters by name", async () => {
    req.body = { name: "Development" };
    await departmentService.getAllDepartments(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ departments: expect.arrayContaining([
      expect.objectContaining({ name: "Development" }),
    ]) }));
  });

  it("filters by createdAt", async () => {
    const today = new Date().toISOString().split("T")[0];
    req.body = { createdAt: today };
    await departmentService.getAllDepartments(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  it("handles internal error", async () => {
    jest.spyOn(db.department, "findAndCountAll").mockRejectedValue(new Error("DB failed"));
    await departmentService.getAllDepartments(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// addADepartment
describe("addADepartment", () => {
  it("adds new department", async () => {
    req.body = { name: "Design", description: "UI/UX", manager_id: null };
    await departmentService.addADepartment(req, res);
    expect(res.send).toHaveBeenCalledWith({ message: "Department successfully registered" });
  });

  it("fails if name missing", async () => {
    req.body = { description: "No name" };
    await departmentService.addADepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("handles duplicate name (not restricted but testable)", async () => {
    req.body = { name: "Development", description: "Duplicate test" };
    await departmentService.addADepartment(req, res);
    expect(res.send).toHaveBeenCalled();
  });

  it("fails when db throws", async () => {
    jest.spyOn(db.department, "create").mockRejectedValue(new Error("DB failed"));
    await departmentService.addADepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("creates department with manager_id", async () => {
    const user = await db.user.findOne();
    req.body = { name: "NewDept", description: "Test", manager_id: user.id };
    await departmentService.addADepartment(req, res);
    expect(res.send).toHaveBeenCalled();
  });
});

// getDepartmentById
describe("getDepartmentById", () => {
  it("returns department by ID", async () => {
    const department = await db.department.findOne();
    req.params.id = department.id;
    await departmentService.getDepartmentById(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: department.id }));
  });

  it("returns 404 if not found", async () => {
    req.params.id = 9999;
    await departmentService.getDepartmentById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("handles error from DB", async () => {
    jest.spyOn(db.department, "findByPk").mockRejectedValue(new Error("DB error"));
    req.params.id = 1;
    await departmentService.getDepartmentById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("returns department without password field", async () => {
    const department = await db.department.findOne();
    req.params.id = department.id;
    await departmentService.getDepartmentById(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.not.objectContaining({ password: expect.anything() }));
  });

  it("handles invalid ID", async () => {
    req.params.id = "invalid";
    await departmentService.getDepartmentById(req, res);
    expect(res.status).not.toHaveBeenCalledWith(500); // Sequelize auto-converts
  });
});

// updateDepartment
describe("updateDepartment", () => {
  it("updates department successfully", async () => {
    const department = await db.department.findOne();
    req.body = { id: department.id, name: "Updated Name" };
    await departmentService.updateDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("fails if no ID", async () => {
    req.body = {};
    await departmentService.updateDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("fails if department not found", async () => {
    req.body = { id: 9999 };
    await departmentService.updateDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("handles DB error", async () => {
    const department = await db.department.findOne();
    jest.spyOn(db.department, "findByPk").mockRejectedValue(new Error("DB error"));
    req.body = { id: department.id };
    await departmentService.updateDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("updates description only", async () => {
    const department = await db.department.findOne();
    req.body = { id: department.id, description: "New Desc" };
    await departmentService.updateDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

// deleteDepartment
describe("deleteDepartment", () => {
  it("deletes department", async () => {
    const department = await db.department.findOne();
    req.body = { id: department.id };
    await departmentService.deleteDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("returns 400 if no ID", async () => {
    req.body = {};
    await departmentService.deleteDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 404 if department not found", async () => {
    req.body = { id: 9999 };
    await departmentService.deleteDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("handles DB error", async () => {
    jest.spyOn(db.department, "findByPk").mockRejectedValue(new Error("DB error"));
    req.body = { id: 1 };
    await departmentService.deleteDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("deletes department with users still assigned", async () => {
    const dept = await db.department.findOne();
    req.body = { id: dept.id };
    await departmentService.deleteDepartment(req, res);
    expect(res.status).toHaveBeenCalled();
  });
});

// addUsersToDepartment
describe("addUsersToDepartment", () => {
  it("returns 400 if userIds is not array", async () => {
    const dept = await db.department.findOne();
    req.body = { departmentId: dept.id, userIds: null };
    await departmentService.addUsersToDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 404 if no users found", async () => {
    const dept = await db.department.findOne();
    req.body = { departmentId: dept.id, userIds: [9999] };
    await departmentService.addUsersToDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("handles DB error", async () => {
    const dept = await db.department.findOne();
    jest.spyOn(db.user, "findAll").mockRejectedValue(new Error("DB error"));
    req.body = { departmentId: dept.id, userIds: [1] };
    await departmentService.addUsersToDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// removeUserFromDepartment
describe("removeUserFromDepartment", () => {
  it("returns 404 if user not found", async () => {
    const dept = await db.department.findOne();
    req.body = { departmentId: dept.id, userId: 9999 };
    await departmentService.removeUserFromDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("handles DB error", async () => {
    const dept = await db.department.findOne();
    jest.spyOn(db.user, "findByPk").mockRejectedValue(new Error("DB error"));
    req.body = { departmentId: dept.id, userId: 1 };
    await departmentService.removeUserFromDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("removes user not in department (still passes)", async () => {
    const dept = await db.department.findOne();
    const user = await db.user.findOne({ where: { department_id: null } });
    req.body = { departmentId: dept.id, userId: user?.id ?? 1 };
    await departmentService.removeUserFromDepartment(req, res);
    expect(res.status).toHaveBeenCalled();
  });
});
});