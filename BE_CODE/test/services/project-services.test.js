const projectService = require("../../app/services/project-services");
const helper = require("../helper.test");
const db = require("../../app/models/index");

let req, res;

beforeEach(async () => {
  await helper.setupTestDatabase();
  await helper.createTestData();
  req = {};
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

describe("Project Services", () => {
  describe("getAllProjects", () => {
    it("GAP1: should return all projects without userId filter", async () => {
      req.body = { page: 1, pageSize: 10 };
      await projectService.getAllProjects(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          totalItems: expect.any(Number),
          totalPages: expect.any(Number),
          page: 1,
          pageSize: 10,
          projects: expect.any(Array),
        })
      );
    });

    it("GAP2: should return filtered projects with userId", async () => {
      const user = await db.user.findOne({ where: { username: "janesmith" } });
      req.body = { page: 1, pageSize: 10, userId: user.id };

      await projectService.getAllProjects(req, res);
      const result = res.json.mock.calls[0][0];

      expect(result.projects.length).toBeGreaterThan(0);
    });

    it("GAP3: should return empty array for invalid userId", async () => {
      req.body = { page: 1, pageSize: 10, userId: 9999 };

      await projectService.getAllProjects(req, res);
      expect(res.json.mock.calls[0][0].projects.length).toBe(0);
    });

    it("GAP4: should return default pagination if page and pageSize are missing", async () => {
      req.body = {}; // không có page và pageSize

      await projectService.getAllProjects(req, res);
      const result = res.json.mock.calls[0][0];

      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(Array.isArray(result.projects)).toBe(true);
    });

    it("GAP5: should return empty result if page number is too high", async () => {
      req.body = { page: 999, pageSize: 10 };

      await projectService.getAllProjects(req, res);
      const result = res.json.mock.calls[0][0];

      expect(result.projects.length).toBe(0);
      expect(result.totalItems).toBeGreaterThanOrEqual(0);
    });

    it("GAP6: should return 500 if database connection error", async () => {
      const error = new Error("Database error");
      jest.spyOn(db.project, "findAndCountAll").mockRejectedValue(error);

      await projectService.getAllProjects(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal Server Error",
      });
    });
  });

  describe("addAProject", () => {
    it("AAP1: should create a project and save to database", async () => {
      const manager = await db.user.findOne();
      req.body = {
        name: "Test Project",
        description: "Test desc",
        start_date: "2025-01-01",
        end_date: "2025-06-01",
        status: 1,
        manager_id: manager.id,
        image_url: "http://example.com/image.png",
      };

      await projectService.addAProject(req, res);
      expect(res.send).toHaveBeenCalledWith({
        message: "Project successfully registered",
      });

      const project = await db.project.findOne({
        where: { name: "Test Project" },
      });
      expect(project).toBeTruthy();
    });

    it("AAP2: should return 500 if status is an invalid data type", async () => {
      const manager = await db.user.findOne();
      req.body = {
        name: "Invalid Status Project",
        description: "Some description",
        start_date: "2025-01-01",
        end_date: "2025-06-01",
        status: "not-a-number", // ❌ gây lỗi
        manager_id: manager.id,
        image_url: "http://example.com/image.png",
      };

      await projectService.addAProject(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.any(String) })
      );
    });

    it("AAP3: should create project even if manager_id does not exist (no FK enforced)", async () => {
      req.body = {
        name: "Ghost Manager Project",
        description: "No manager exists",
        start_date: "2025-01-01",
        end_date: "2025-06-01",
        status: 0,
        manager_id: 999999, // ❗ ID không tồn tại
        image_url: "http://example.com/image.png",
      };

      await projectService.addAProject(req, res);

      expect(res.send).toHaveBeenCalledWith({
        message: "Project successfully registered",
      });

      const proj = await db.project.findOne({
        where: { name: "Ghost Manager Project" },
      });

      expect(proj).toBeTruthy();
      expect(proj.manager_id).toBe(999999);
    });

    it("AAP4: should still create project even if end_date is before start_date", async () => {
      const manager = await db.user.findOne();

      req.body = {
        name: "Reversed Dates",
        description: "Testing wrong date order",
        start_date: "2025-12-01",
        end_date: "2025-01-01", // ❗ trước ngày bắt đầu
        status: 1,
        manager_id: manager.id,
        image_url: "http://example.com/image.png",
      };

      await projectService.addAProject(req, res);

      expect(res.send).toHaveBeenCalledWith({
        message: "Project successfully registered",
      });

      const proj = await db.project.findOne({
        where: { name: "Reversed Dates" },
      });

      expect(proj).toBeTruthy();
      expect(new Date(proj.end_date) < new Date(proj.start_date)).toBe(true);
    });
  });

  describe("getProjectById", () => {
    it("GPBI1: should return a project by ID", async () => {
      const proj = await db.project.findOne();
      req.params = { id: proj.id };

      await projectService.getProjectById(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ id: proj.id })
      );
    });

    it("GPBI2: should return 404 for invalid ID", async () => {
      req.params = { id: 9999 };
      await projectService.getProjectById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("GPBI3: should return 500 if an error occurs", async () => {
      const originalFn = db.project.findByPk;
      db.project.findByPk = () => {
        throw new Error("Simulated DB error");
      };

      req.params = { id: 1 };

      await projectService.getProjectById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });

      // Restore
      db.project.findByPk = originalFn;
    });

    it("GPBI4: should exclude user password field in result", async () => {
      const project = await db.project.findOne({
        include: {
          model: db.user,
        },
      });

      req.params = { id: project.id };
      await projectService.getProjectById(req, res);

      const result = res.json.mock.calls[0][0];
      if (result.users?.length > 0) {
        for (const user of result.users) {
          expect(user.password).toBeUndefined();
        }
      }
    });
  });

  describe("updateProject", () => {
    it("UP1: should update a project successfully", async () => {
      const project = await db.project.findOne();
      req.body = { id: project.id, name: "Updated name" };

      await projectService.updateProject(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      const updated = await db.project.findByPk(project.id);
      expect(updated.name).toBe("Updated name");
    });

    it("UP2: should return 400 if no ID", async () => {
      req.body = {};
      await projectService.updateProject(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("UP3: should return 404 if project not found", async () => {
      req.body = { id: 9999 };
      await projectService.updateProject(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("UP4: should return 500 if an exception occurs during update", async () => {
      const project = await db.project.findOne();

      // Ghi đè tạm thời hàm update để ném lỗi
      const originalUpdate = project.update;
      project.update = () => {
        throw new Error("Simulated update failure");
      };

      // Ghi đè findByPk để trả về project đã bị patch
      const originalFind = db.project.findByPk;
      db.project.findByPk = () => project;

      req.body = { id: project.id, name: "Should fail" };

      await projectService.updateProject(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          success: false,
          message: "Error updating project info",
        })
      );

      // Khôi phục
      db.project.findByPk = originalFind;
      project.update = originalUpdate;
    });

    it("UP5: should update multiple fields of a project", async () => {
      const project = await db.project.findOne();
      req.body = {
        id: project.id,
        name: "Multi-field Update",
        description: "Updated description",
        status: 2,
      };

      await projectService.updateProject(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const updated = await db.project.findByPk(project.id);
      expect(updated.name).toBe("Multi-field Update");
      expect(updated.description).toBe("Updated description");
      expect(updated.status).toBe(2);
    });
  });

  describe("deleteProject", () => {
    it("DP1: should delete a project and related project_user entries", async () => {
      const project = await db.project.findOne();
      req.body = { id: project.id };

      await projectService.deleteProject(req, res);
      expect(res.status).toHaveBeenCalledWith(200);

      const deleted = await db.project.findByPk(project.id);
      expect(deleted).toBeNull();
    });

    it("DP2: should return 400 if no ID", async () => {
      req.body = {};
      await projectService.deleteProject(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("DP3: should return 404 if project not found", async () => {
      req.body = { id: 9999 };
      await projectService.deleteProject(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("DP4: should return 500 if project.destroy throws an error", async () => {
      const project = await db.project.findOne();

      // Ghi đè tạm thời hàm destroy
      const originalDestroy = project.destroy;
      project.destroy = () => {
        throw new Error("Simulated deletion failure");
      };

      // Ghi đè project tìm được (không mock toàn model)
      const originalFind = db.project.findByPk;
      db.project.findByPk = () => project;

      req.body = { id: project.id };
      await projectService.deleteProject(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          success: false,
          message: "Error deleting project",
        })
      );

      // Khôi phục
      db.project.findByPk = originalFind;
      project.destroy = originalDestroy;
    });

    it("DP5: should delete associated project_user records", async () => {
      const projectWithUsers = await db.project.findOne({
        include: db.user,
      });

      // Đảm bảo có user liên kết để test meaningful
      const projectUsersBefore = await db.project_user.findAll({
        where: { project_id: projectWithUsers.id },
      });
      expect(projectUsersBefore.length).toBeGreaterThan(0);

      req.body = { id: projectWithUsers.id };
      await projectService.deleteProject(req, res);

      const projectUsersAfter = await db.project_user.findAll({
        where: { project_id: projectWithUsers.id },
      });
      expect(projectUsersAfter.length).toBe(0);
    });
  });

  describe("addUsersToProject", () => {
    it("AUTP1: should add users to a project", async () => {
      const project = await db.project.findOne();
      const users = await db.user.findAll();
      req.body = { projectId: project.id, userIds: [users[2].id] };

      await projectService.addUsersToProject(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("AUTP2: should return 400 if userIds is empty", async () => {
      const project = await db.project.findOne();
      req.body = { projectId: project.id, userIds: [] };

      await projectService.addUsersToProject(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("AUTP3: should return 404 if project not found", async () => {
      req.body = { projectId: 9999, userIds: [1] };

      await projectService.addUsersToProject(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("AUTP4: should return 404 if none of the provided userIds exist", async () => {
      const project = await db.project.findOne();
      req.body = { projectId: project.id, userIds: [9999, 8888] };

      await projectService.addUsersToProject(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.stringContaining(
          "No users found with the provided IDs"
        ),
      });
    });

    it("AUTP5: should return 500 if project.addUsers throws an error", async () => {
      const project = await db.project.findOne();
      const users = await db.user.findAll();

      // Ghi đè tạm thời project.addUsers để ném lỗi
      const originalAddUsers = project.addUsers;
      project.addUsers = () => {
        throw new Error("Simulated failure in addUsers");
      };

      // Ghi đè db.project.findByPk để trả về project ghi đè
      const originalFindByPk = db.project.findByPk;
      db.project.findByPk = () => project;

      req.body = {
        projectId: project.id,
        userIds: [users[0].id, users[1].id],
      };

      await projectService.addUsersToProject(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Failed to add users to project",
      });

      // Khôi phục
      db.project.findByPk = originalFindByPk;
      project.addUsers = originalAddUsers;
    });
  });

  describe("removeUserFromProject", () => {
    it("RUFP1: should remove a user from a project", async () => {
      const projectUser = await db.project_user.findOne();
      req.body = {
        projectId: projectUser.project_id,
        userId: projectUser.user_id,
      };

      await projectService.removeUserFromProject(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("RUFP2: should return 404 if project not found", async () => {
      req.body = { projectId: 9999, userId: 1 };
      await projectService.removeUserFromProject(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("RUFP3: should return 404 if user not found", async () => {
      const project = await db.project.findOne();
      req.body = { projectId: project.id, userId: 9999 };
      await projectService.removeUserFromProject(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("RUFP4: should return 500 if removeUser throws an error", async () => {
      const projectUser = await db.project_user.findOne();
      const project = await db.project.findByPk(projectUser.project_id);
      const user = await db.user.findByPk(projectUser.user_id);

      // Ghi đè tạm thời project.removeUser
      const originalRemoveUser = project.removeUser;
      project.removeUser = () => {
        throw new Error("Simulated error in removeUser");
      };

      // Ghi đè findByPk để trả về project đã bị patch
      const originalFind = db.project.findByPk;
      db.project.findByPk = () => project;

      req.body = {
        projectId: project.id,
        userId: user.id,
      };

      await projectService.removeUserFromProject(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to remove user from project",
      });

      // Khôi phục
      db.project.findByPk = originalFind;
      project.removeUser = originalRemoveUser;
    });

    it("RUFP5: should actually remove the user from project_user table", async () => {
      const projectUser = await db.project_user.findOne();
      req.body = {
        projectId: projectUser.project_id,
        userId: projectUser.user_id,
      };

      await projectService.removeUserFromProject(req, res);

      const deleted = await db.project_user.findOne({
        where: {
          project_id: projectUser.project_id,
          user_id: projectUser.user_id,
        },
      });

      expect(deleted).toBeNull();
    });
  });
});
