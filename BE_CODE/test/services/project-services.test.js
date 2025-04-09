const projectService = require("../../app/services/project-services");
const db = require("../../app/models/index");
const Project = db.project;
const ProjectUser = db.project_user;
const User = db.user;
function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}
describe("Project Service", () => {
  let testUser;
  let testProjects;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });

    // Tạo user test
    testUser = await db.user.create({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
    });

    // Tạo projects và liên kết với user
    testProjects = await Promise.all([
      Project.create({ name: "Project A", description: "A desc" }),
      Project.create({ name: "Project B", description: "B desc" }),
    ]);

    await testUser.addProjects(testProjects);
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  describe("getAllProjects", () => {
    it("should return list of all projects (no filter)", async () => {
      const req = {
        body: {
          page: 1,
          pageSize: 10,
        },
      };

      const res = {
        statusCode: 200,
        body: null,
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(data) {
          this.body = data;
          return this;
        },
      };

      await projectService.getAllProjects(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("projects");
      expect(Array.isArray(res.body.projects)).toBe(true);
    });

    it("should return projects filtered by userId", async () => {
      const req = {
        body: {
          page: 1,
          pageSize: 5,
          userId: testUser.id,
        },
      };

      const res = {
        statusCode: 200,
        body: null,
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(data) {
          this.body = data;
          return this;
        },
      };

      await projectService.getAllProjects(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("projects");
      expect(res.body.projects.length).toBeGreaterThan(0);
    });
  });

  describe("addAProject", () => {
    let manager;

    beforeAll(async () => {
      // Tạo user manager hợp lệ để test
      manager = await db.user.create({
        name: "Test Manager",
        email: "manager@example.com",
        password: "123456",
      });
    });

    afterEach(async () => {
      // Xóa các project test theo tên
      await Project.destroy({ where: { name: "New Project" } });
    });

    afterAll(async () => {
      // Xóa manager test
      await db.user.destroy({ where: { id: manager.id } });
      await db.sequelize.close();
    });

    it("should create a new project and return success message", async () => {
      const req = {
        body: {
          name: "New Project",
          description: "New project description",
          start_date: "2025-01-01",
          end_date: "2025-12-31",
          status: "1",
          manager_id: manager.id,
          image_url: "https://example.com/image.png",
        },
      };

      let statusCode = 200;
      let responseBody;
      const res = {
        status(code) {
          statusCode = code;
          return this;
        },
        send(data) {
          responseBody = data;
          return this;
        },
      };

      await projectService.addAProject(req, res);

      expect(statusCode).toBe(200);
      expect(responseBody).toEqual({
        message: "Project successfully registered",
      });

      // Kiểm tra DB
      const inserted = await Project.findOne({
        where: { name: "New Project" },
      });
      expect(inserted).not.toBeNull();
      expect(inserted.description).toBe("New project description");
    });

    it("should return 500 if project creation fails (missing name)", async () => {
      const req = {
        body: {
          // Không có field name
          description: "Missing name",
          start_date: "2025-01-01",
          end_date: "2025-12-31",
          status: "1",
          manager_id: manager.id,
          image_url: "https://example.com/image.png",
        },
      };

      let statusCode;
      let responseBody;
      const res = {
        status(code) {
          statusCode = code;
          return this;
        },
        send(data) {
          responseBody = data;
          return this;
        },
      };

      await projectService.addAProject(req, res);

      expect(statusCode).toBe(500);
      expect(responseBody).toHaveProperty("message");
      expect(typeof responseBody.message).toBe("string");
    });

    it("should return 400 if manager_id does not exist", async () => {
      const req = {
        body: {
          name: "Invalid Manager Test",
          description: "Should fail",
          start_date: "2025-01-01",
          end_date: "2025-12-31",
          status: "1",
          manager_id: 99999, // không tồn tại
          image_url: "https://example.com/image.png",
        },
      };

      let statusCode;
      let responseBody;
      const res = {
        status(code) {
          statusCode = code;
          return this;
        },
        send(data) {
          responseBody = data;
          return this;
        },
      };

      await projectService.addAProject(req, res);

      expect(statusCode).toBe(400);
      expect(responseBody).toHaveProperty("message", "Manager not found");
    });
  });

  describe("getProjectById", () => {
    let mockProject;

    beforeEach(() => {
      // Reset mock project
      mockProject = {
        id: 1,
        name: "Test Project",
        description: "Sample description",
        Users: [{ id: 2, name: "User 1", email: "user1@example.com" }],
      };
    });

    afterEach(() => {
      jest.restoreAllMocks(); // Clear mocks after each test
    });

    it("should return the project with user info if project exists", async () => {
      jest.spyOn(Project, "findByPk").mockResolvedValue(mockProject);

      const req = { params: { id: 1 } };
      let statusCode;
      let responseBody;
      const res = {
        status(code) {
          statusCode = code;
          return this;
        },
        json(data) {
          responseBody = data;
          return this;
        },
      };

      await projectService.getProjectById(req, res);

      expect(statusCode).toBeUndefined(); // vì dùng res.json trực tiếp không gọi res.status
      expect(responseBody).toEqual(mockProject);
    });

    it("should return 404 if project not found", async () => {
      jest.spyOn(Project, "findByPk").mockResolvedValue(null);

      const req = { params: { id: 999 } };
      let statusCode;
      let responseBody;
      const res = {
        status(code) {
          statusCode = code;
          return this;
        },
        json(data) {
          responseBody = data;
          return this;
        },
      };

      await projectService.getProjectById(req, res);

      expect(statusCode).toBe(404);
      expect(responseBody).toEqual({ message: "Project not found" });
    });

    it("should return 500 if error occurs", async () => {
      jest.spyOn(Project, "findByPk").mockRejectedValue(new Error("DB error"));

      const req = { params: { id: 1 } };
      let statusCode;
      let responseBody;
      const res = {
        status(code) {
          statusCode = code;
          return this;
        },
        json(data) {
          responseBody = data;
          return this;
        },
      };

      await projectService.getProjectById(req, res);

      expect(statusCode).toBe(500);
      expect(responseBody).toEqual({ message: "Internal server error" });
    });
  });

  describe("updateProject", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should update the project and return success message", async () => {
      const req = {
        body: {
          id: 1,
          name: "Updated Project Name",
          description: "Updated description",
        },
      };

      const mockProject = {
        update: jest.fn().mockResolvedValue(),
      };

      jest.spyOn(Project, "findByPk").mockResolvedValue(mockProject);

      let statusCode;
      let responseBody;
      const res = {
        status(code) {
          statusCode = code;
          return this;
        },
        json(data) {
          responseBody = data;
          return this;
        },
      };

      await projectService.updateProject(req, res);

      expect(Project.findByPk).toHaveBeenCalledWith(1);
      expect(mockProject.update).toHaveBeenCalledWith(req.body);
      expect(statusCode).toBe(200);
      expect(responseBody).toEqual({
        success: true,
        message: "Project info updated successfully",
      });
    });

    it("should return 400 if project id is missing", async () => {
      const req = { body: {} };

      let statusCode;
      let responseBody;
      const res = {
        status(code) {
          statusCode = code;
          return this;
        },
        json(data) {
          responseBody = data;
          return this;
        },
      };

      await projectService.updateProject(req, res);

      expect(statusCode).toBe(400);
      expect(responseBody).toEqual({
        success: false,
        message: "Id is required",
      });
    });

    it("should return 404 if project is not found", async () => {
      const req = { body: { id: 999 } };

      jest.spyOn(Project, "findByPk").mockResolvedValue(null);

      let statusCode;
      let responseBody;
      const res = {
        status(code) {
          statusCode = code;
          return this;
        },
        json(data) {
          responseBody = data;
          return this;
        },
      };

      await projectService.updateProject(req, res);

      expect(statusCode).toBe(404);
      expect(responseBody).toEqual({
        success: false,
        message: "Project not found",
      });
    });
  });

  describe("deleteProject", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should delete the project and related project_user entries", async () => {
      const req = { body: { id: 1 } };
      const mockProject = {
        destroy: jest.fn().mockResolvedValue(),
      };

      jest.spyOn(Project, "findByPk").mockResolvedValue(mockProject);
      jest.spyOn(ProjectUser, "destroy").mockResolvedValue();

      let statusCode;
      let responseBody;
      const res = {
        status(code) {
          statusCode = code;
          return this;
        },
        json(data) {
          responseBody = data;
          return this;
        },
      };

      await projectService.deleteProject(req, res);

      expect(Project.findByPk).toHaveBeenCalledWith(1);
      expect(ProjectUser.destroy).toHaveBeenCalledWith({
        where: { project_id: 1 },
      });
      expect(mockProject.destroy).toHaveBeenCalled();
      expect(statusCode).toBe(200);
      expect(responseBody).toEqual({
        success: true,
        message: "Project deleted successfully",
      });
    });

    it("should return 400 if project id is missing", async () => {
      const req = { body: {} };

      let statusCode;
      let responseBody;
      const res = {
        status(code) {
          statusCode = code;
          return this;
        },
        json(data) {
          responseBody = data;
          return this;
        },
      };

      await projectService.deleteProject(req, res);

      expect(statusCode).toBe(400);
      expect(responseBody).toEqual({
        success: false,
        message: "Id is required",
      });
    });

    it("should return 404 if project is not found", async () => {
      const req = { body: { id: 999 } };

      jest.spyOn(Project, "findByPk").mockResolvedValue(null);

      let statusCode;
      let responseBody;
      const res = {
        status(code) {
          statusCode = code;
          return this;
        },
        json(data) {
          responseBody = data;
          return this;
        },
      };

      await projectService.deleteProject(req, res);

      expect(statusCode).toBe(404);
      expect(responseBody).toEqual({
        success: false,
        message: "Project not found",
      });
    });
  });

  describe("addUsersToProject", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    const mockRes = () => {
      let statusCode;
      let responseBody;
      const res = {
        status(code) {
          statusCode = code;
          return this;
        },
        json(data) {
          responseBody = data;
          return this;
        },
        getStatus: () => statusCode,
        getBody: () => responseBody,
      };
      return res;
    };

    it("should add users to project successfully", async () => {
      const req = {
        body: {
          projectId: 1,
          userIds: [2, 3],
        },
      };

      const mockProject = {
        addUsers: jest.fn().mockResolvedValue(),
      };
      const mockUsers = [{ id: 2 }, { id: 3 }];

      jest.spyOn(Project, "findByPk").mockResolvedValue(mockProject);
      jest.spyOn(User, "findAll").mockResolvedValue(mockUsers);

      const res = mockRes();
      await projectService.addUsersToProject(req, res);

      expect(Project.findByPk).toHaveBeenCalledWith(1);
      expect(User.findAll).toHaveBeenCalledWith({ where: { id: [2, 3] } });
      expect(mockProject.addUsers).toHaveBeenCalledWith(mockUsers);
      expect(res.getStatus()).toBe(200);
      expect(res.getBody()).toEqual({
        message: `Users with IDs [2, 3] added to project with ID 1`,
      });
    });

    it("should return 404 if project not found", async () => {
      const req = {
        body: {
          projectId: 1,
          userIds: [2],
        },
      };

      jest.spyOn(Project, "findByPk").mockResolvedValue(null);
      const res = mockRes();

      await projectService.addUsersToProject(req, res);

      expect(res.getStatus()).toBe(404);
      expect(res.getBody()).toEqual({
        error: `Project with ID 1 not found`,
      });
    });

    it("should return 400 if userIds is not a valid non-empty array", async () => {
      const req = {
        body: {
          projectId: 1,
          userIds: [],
        },
      };

      const res = mockRes();
      jest.spyOn(Project, "findByPk").mockResolvedValue({}); // Giả sử project tồn tại

      await projectService.addUsersToProject(req, res);

      expect(res.getStatus()).toBe(400);
      expect(res.getBody()).toEqual({
        error: "userIds must be a non-empty array",
      });
    });

    it("should return 404 if no users found", async () => {
      const req = {
        body: {
          projectId: 1,
          userIds: [99, 100],
        },
      };

      jest
        .spyOn(Project, "findByPk")
        .mockResolvedValue({ addUsers: jest.fn() });
      jest.spyOn(User, "findAll").mockResolvedValue([]); // Không tìm thấy user

      const res = mockRes();
      await projectService.addUsersToProject(req, res);

      expect(res.getStatus()).toBe(404);
      expect(res.getBody()).toEqual({
        message: "No users found with the provided IDs: 99, 100",
      });
    });

    it("should return 500 if an error occurs", async () => {
      const req = {
        body: {
          projectId: 1,
          userIds: [2],
        },
      };

      jest.spyOn(Project, "findByPk").mockRejectedValue(new Error("DB error"));

      const res = mockRes();
      await projectService.addUsersToProject(req, res);

      expect(res.getStatus()).toBe(500);
      expect(res.getBody()).toEqual({
        message: "Failed to add users to project",
      });
    });
  });

  describe("removeUserFromProject", () => {
    const req = {
      body: {
        projectId: 1,
        userId: 10,
      },
    };

    it("should remove user from project successfully", async () => {
      const mockProject = {
        removeUser: jest.fn(),
      };
      const mockUser = {};

      jest.spyOn(Project, "findByPk").mockResolvedValueOnce(mockProject);
      jest.spyOn(User, "findByPk").mockResolvedValueOnce(mockUser);

      const res = mockRes();
      await projectService.removeUserFromProject(req, res);

      expect(Project.findByPk).toHaveBeenCalledWith(1);
      expect(User.findByPk).toHaveBeenCalledWith(10);
      expect(mockProject.removeUser).toHaveBeenCalledWith(mockUser);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: `User with ID 10 removed from project with ID 1`,
      });
    });

    it("should return 404 if project not found", async () => {
      jest.spyOn(Project, "findByPk").mockResolvedValue(null);

      const res = mockRes();
      await projectService.removeUserFromProject(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: `Project with ID 1 not found`,
      });
    });

    it("should return 404 if user not found", async () => {
      jest
        .spyOn(Project, "findByPk")
        .mockResolvedValue({ removeUser: jest.fn() });
      jest.spyOn(User, "findByPk").mockResolvedValue(null);

      const res = mockRes();
      await projectService.removeUserFromProject(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: `User with ID 10 not found`,
      });
    });

    it("should return 500 if an error occurs", async () => {
      jest.spyOn(Project, "findByPk").mockRejectedValue(new Error("DB Error"));

      const res = mockRes();
      await projectService.removeUserFromProject(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to remove user from project",
      });
    });
  });
});
