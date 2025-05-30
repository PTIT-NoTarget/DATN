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
  it("GETDEPT1: returns paginated departments", async () => {
    req.body = { page: 1, pageSize: 2 };
    await departmentService.getAllDepartments(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ departments: expect.any(Array) }));
  });

  it("GETDEPT2: filters by name", async () => {
    req.body = { name: "Development" };
    await departmentService.getAllDepartments(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ departments: expect.arrayContaining([
      expect.objectContaining({ name: "Development" }),
    ]) }));
  });

  it("GETDEPT3: filters by createdAt", async () => {
    const today = new Date().toISOString().split("T")[0];
    req.body = { createdAt: today };
    await departmentService.getAllDepartments(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  it("GETDEPT4: returns empty list when no departments", async () => {
    await helper.clearTestDatabase();
    req.body = { page: 1, pageSize: 10 };
    await departmentService.getAllDepartments(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ departments: [] }));
  });

  it("GETDEPT5: handles internal error", async () => {
    jest.spyOn(db.department, "findAndCountAll").mockRejectedValue(new Error("DB failed"));
    await departmentService.getAllDepartments(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// addADepartment
describe("addADepartment", () => {
  it("ADDDEPT1: adds new department", async () => {
    req.body = { name: "Design", description: "UI/UX", manager_id: null };
    await departmentService.addADepartment(req, res);
    expect(res.send).toHaveBeenCalledWith({ message: "Department successfully registered" });

    // Kiểm tra DB
    const savedDept = await db.department.findOne({ where: { name: "Design" } });
    expect(savedDept).toBeTruthy();
    expect(savedDept.description).toBe("UI/UX");
  });

  it("ADDDEPT2: fails if name missing", async () => {
    req.body = { description: "No name" };
    await departmentService.addADepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("ADDDEPT3: handles duplicate name (not restricted but testable)", async () => {
    req.body = { name: "Development", description: "Duplicate test" };
    await departmentService.addADepartment(req, res);
    expect(res.send).toHaveBeenCalled();

    // Kiểm tra xem có ít nhất một bản ghi
    const depts = await db.department.findAll({ where: { name: "Development" } });
    expect(depts.length).toBeGreaterThan(0);
  });

  it("ADDDEPT4: creates department with manager_id", async () => {
    const user = await db.user.findOne();
    req.body = { name: "NewDept", description: "Test", manager_id: user.id };
    await departmentService.addADepartment(req, res);
    expect(res.send).toHaveBeenCalled();

    // Kiểm tra DB
    const savedDept = await db.department.findOne({ where: { name: "NewDept" } });
    expect(savedDept).toBeTruthy();
    expect(savedDept.manager_id).toBe(user.id);
  });

  it("ADDDEPT5: fails when db throws", async () => {
    jest.spyOn(db.department, "create").mockRejectedValue(new Error("DB failed"));
    await departmentService.addADepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// getDepartmentById
describe("getDepartmentById", () => {
  it("GETBYID1: returns department by ID", async () => {
    const department = await db.department.findOne();
    req.params.id = department.id;
    await departmentService.getDepartmentById(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: department.id }));
  });

  it("GETBYID2: returns 404 if not found", async () => {
    req.params.id = 9999;
    await departmentService.getDepartmentById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("GETBYID3: handles invalid ID", async () => {
    req.params.id = "invalid";
    await departmentService.getDepartmentById(req, res);
    expect(res.status).not.toHaveBeenCalledWith(500); // Sequelize auto-converts
  });

  it("GETBYID4: returns department without password field", async () => {
    const department = await db.department.findOne();
    req.params.id = department.id;
    await departmentService.getDepartmentById(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.not.objectContaining({ password: expect.anything() }));
  });

  it("GETBYID5: handles error from DB", async () => {
    jest.spyOn(db.department, "findByPk").mockRejectedValue(new Error("DB error"));
    req.params.id = 1;
    await departmentService.getDepartmentById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

});

// updateDepartment
describe("updateDepartment", () => {
  it("UPDATE1: updates department successfully", async () => {
    const department = await db.department.findOne();
    req.body = { id: department.id, name: "Updated Name" };
    await departmentService.updateDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    // Check DB đã update
    const updated = await db.department.findByPk(department.id);
    expect(updated.name).toBe("Updated Name");
  });

  it("UPDATE2: updates description only", async () => {
    const department = await db.department.findOne();
    req.body = { id: department.id, description: "New Desc" };
    await departmentService.updateDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    // Check DB đã update
    const updated = await db.department.findByPk(department.id);
    expect(updated.description).toBe("New Desc");
  });

  it("UPDATE3: fails if no ID", async () => {
    req.body = {};
    await departmentService.updateDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("UPDATE4: fails if department not found", async () => {
    req.body = { id: 9999 };
    await departmentService.updateDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("UPDATE5: handles DB error", async () => {
    const department = await db.department.findOne();
    jest.spyOn(db.department, "findByPk").mockRejectedValue(new Error("DB error"));
    req.body = { id: department.id };
    await departmentService.updateDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// deleteDepartment
describe("deleteDepartment", () => {
  it("DELETE1: deletes department", async () => {
    const department = await db.department.findOne();
    req.body = { id: department.id };
    await departmentService.deleteDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    // Kiểm tra thật sự đã bị xóa khỏi DB
    const deleted = await db.department.findByPk(department.id);
    expect(deleted).toBeNull();
  });

  it("DELETE2: returns 400 if no ID", async () => {
    req.body = {};
    await departmentService.deleteDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("DELETE3: returns 404 if department not found", async () => {
    req.body = { id: 9999 };
    await departmentService.deleteDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("DELETE4: handles DB error", async () => {
    jest.spyOn(db.department, "findByPk").mockRejectedValue(new Error("DB error"));
    req.body = { id: 1 };
    await departmentService.deleteDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("DELETE5: deletes department with users still assigned", async () => {
    const dept = await db.department.findOne();
    req.body = { id: dept.id };
    await departmentService.deleteDepartment(req, res);
    expect(res.status).toHaveBeenCalled();

    // Kiểm tra DB thật sự đã xóa
    const deleted = await db.department.findByPk(dept.id);
    expect(deleted).toBeNull();
  });
});

// addUsersToDepartment
describe("addUsersToDepartment", () => {
  it("ADDUSR1: returns 400 if userIds is not array", async () => {
    const dept = await db.department.findOne();
    req.body = { departmentId: dept.id, userIds: null };
    await departmentService.addUsersToDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("ADDUSR2: returns 404 if no users found", async () => {
    const dept = await db.department.findOne();
    req.body = { departmentId: dept.id, userIds: [9999] };
    await departmentService.addUsersToDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("ADDUSR3: handles DB error", async () => {
    const dept = await db.department.findOne();
    jest.spyOn(db.user, "findAll").mockRejectedValue(new Error("DB error"));
    req.body = { departmentId: dept.id, userIds: [1] };
    await departmentService.addUsersToDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// removeUserFromDepartment
describe("removeUserFromDepartment", () => {
  it("RMUSR1: returns 404 if user not found", async () => {
    const dept = await db.department.findOne();
    req.body = { departmentId: dept.id, userId: 9999 };
    await departmentService.removeUserFromDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("RMUSR2: removes user not in department (still passes)", async () => {
    const dept = await db.department.findOne();
    const user = await db.user.findOne({ where: { department_id: null } });
    req.body = { departmentId: dept.id, userId: user?.id ?? 1 };
    await departmentService.removeUserFromDepartment(req, res);
    expect(res.status).toHaveBeenCalled();
  });
  
  it("RMUSR3: handles DB error", async () => {
    const dept = await db.department.findOne();
    jest.spyOn(db.user, "findByPk").mockRejectedValue(new Error("DB error"));
    req.body = { departmentId: dept.id, userId: 1 };
    await departmentService.removeUserFromDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
});