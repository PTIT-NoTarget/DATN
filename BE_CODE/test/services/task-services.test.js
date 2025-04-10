const taskService = require("../../app/services/task-services");
const helper = require("../helper.test");
const db = helper.database;

jest.mock("../../app/services/socket-instance", () => ({
  getIO: () => ({
    emit: jest.fn(),
  }),
}));

let req, res;

beforeEach(async () => {
  await helper.setupTestDatabase();
  await helper.createTestData();

  req = {};
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
});

afterEach(async () => {
  await helper.clearTestDatabase();
  jest.clearAllMocks();
});

describe("Task Services", () => {
  describe("getAllTasks", () => {
    it("should return paginated tasks with no filter", async () => {
      req.body = {};
      await taskService.getAllTasks(req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(Array.isArray(result.issues)).toBe(true);
    });

    it("should filter by project_id", async () => {
      const task = await db.task.findOne();
      req.body = { project_id: task.project_id };

      await taskService.getAllTasks(req, res);
      const issues = res.json.mock.calls[0][0].issues;
      expect(issues.every((t) => t.projectId === task.project_id)).toBe(true);
    });

    it("should filter by assigned_by", async () => {
      const task = await db.task.findOne();
      req.body = { assigned_by: task.assigned_by };

      await taskService.getAllTasks(req, res);
      const issues = res.json.mock.calls[0][0].issues;
      expect(issues.every((t) => t.reporterId === task.assigned_by)).toBe(true);
    });

    it("should filter by status", async () => {
      const task = await db.task.findOne();
      req.body = { status: task.status };

      await taskService.getAllTasks(req, res);
      const issues = res.json.mock.calls[0][0].issues;
      expect(issues.every((t) => t.status === task.status)).toBe(true);
    });

    it("should filter by name keyword", async () => {
      const task = await db.task.findOne();
      req.body = { name: task.name.slice(0, 3) }; // từ khóa đầu

      await taskService.getAllTasks(req, res);
      const issues = res.json.mock.calls[0][0].issues;
      expect(issues.some((t) => t.title.includes(req.body.name))).toBe(true);
    });

    it("should filter by createdAt date", async () => {
      const task = await db.task.findOne();
      const createdAt = task.createdAt.toISOString().split("T")[0];

      req.body = { createdAt };
      await taskService.getAllTasks(req, res);

      const issues = res.json.mock.calls[0][0].issues;
      expect(issues.length).toBeGreaterThan(0);
    });

    it("should return specific task by ID", async () => {
      const task = await db.task.findOne();
      req.body = { id: task.id };

      await taskService.getAllTasks(req, res);
      const issues = res.json.mock.calls[0][0].issues;

      expect(issues.length).toBe(1);
      expect(issues[0].id).toBe(task.id);
    });

    it("should return empty if no match", async () => {
      req.body = { name: "no-task-should-match-this" };

      await taskService.getAllTasks(req, res);
      expect(res.json.mock.calls[0][0].issues.length).toBe(0);
    });

    it("should return 500 if DB throws error", async () => {
      const spy = jest
        .spyOn(db.task, "findAndCountAll")
        .mockImplementation(() => {
          throw new Error("Simulated DB error");
        });

      await taskService.getAllTasks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });

      spy.mockRestore();
    });
  });

  describe("addATask", () => {
    it("should create a task, save to DB, create notification", async () => {
      const project = await db.project.findOne();
      const user = await db.user.findOne();

      req.body = {
        project_id: project.id,
        name: "New Task",
        description: "Test task",
        label: "dev",
        status: "todo",
        start_date: "2025-01-01",
        end_date: "2025-01-15",
        assigned_by: user.id,
        created_by: user.id,
        story_point: 3,
        follower_ids: [user.id],
      };

      await taskService.addATask(req, res);
      expect(res.status).toHaveBeenCalledWith(200);

      //  Check task saved to DB
      const savedTask = await db.task.findOne({ where: { name: "New Task" } });
      expect(savedTask).toBeTruthy();
      expect(savedTask.description).toBe("Test task");

      //  Check notification created (avoid sequelize stringContaining error)
      const allNotifications = await db.notification.findAll();
      const hasNotification = allNotifications.some((n) =>
        n.message.includes("vừa tạo mới công việc")
      );
      expect(hasNotification).toBe(true);
    });

    it("should fail if project_id is missing", async () => {
      req.body = { name: "Test" };
      await taskService.addATask(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "project_id is required",
      });
    });

    it("should fail if project does not exist", async () => {
      req.body = {
        project_id: 99999,
        name: "Ghost Task",
        created_by: 1,
      };
      await taskService.addATask(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Project not found" });
    });

    it("should fail if created_by is missing", async () => {
      const project = await db.project.findOne();
      req.body = {
        project_id: project.id,
        name: "Missing Creator",
      };
      await taskService.addATask(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "created_by is required",
      });
    });

    it("should return 500 if task creation fails", async () => {
      const project = await db.project.findOne();
      const user = await db.user.findOne();

      const spy = jest.spyOn(db.task, "create").mockImplementation(() => {
        throw new Error("Simulated error");
      });

      req.body = {
        project_id: project.id,
        name: "Fail Task",
        description: "Should fail",
        label: "bug",
        status: "todo",
        start_date: "2025-01-01",
        end_date: "2025-01-15",
        assigned_by: user.id,
        created_by: user.id,
        story_point: 3,
        follower_ids: [user.id],
      };

      await taskService.addATask(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });

      spy.mockRestore();
    });
  });

  describe("getATaskById", () => {
    it("should return a task by valid ID", async () => {
      const task = await db.task.findOne();
      req.params = { id: task.id };

      await taskService.getATaskById(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ id: task.id })
      );
    });

    it("should return 404 for invalid ID", async () => {
      req.params = { id: 9999 };
      await taskService.getATaskById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 if exception occurs", async () => {
      const spy = jest.spyOn(db.task, "findByPk").mockImplementation(() => {
        throw new Error("Simulated error");
      });

      req.params = { id: 1 };
      await taskService.getATaskById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });

      spy.mockRestore();
    });
  });

  describe("updateATask", () => {
    it("should update a task with valid input", async () => {
      const task = await db.task.findOne();
      const user = await db.user.findOne();

      req.body = {
        id: task.id,
        name: "Updated Task",
        label: "design",
        status: "done",
        description: "Updated desc",
        assigned_by: task.assigned_by,
        start_date: task.start_date,
        end_date: task.end_date,
        story_point: 10,
        follower_ids: [user.id],
        user_update: user.id,
      };

      await taskService.updateATask(req, res);
      expect(res.status).toHaveBeenCalledWith(200);

      const updated = await db.task.findByPk(task.id);
      expect(updated.name).toBe("Updated Task");
    });

    it("should return 400 if ID is missing", async () => {
      req.body = {};
      await taskService.updateATask(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if task not found", async () => {
      req.body = { id: 9999 };
      await taskService.updateATask(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 if update throws an exception", async () => {
      const task = await db.task.findOne();
      const user = await db.user.findOne();

      const spy = jest.spyOn(db.task, "findByPk").mockImplementation(() => {
        throw new Error("Simulated DB failure");
      });

      req.body = {
        id: task.id,
        name: "Should Fail",
        label: "error",
        status: "bug",
        description: "Force error",
        assigned_by: task.assigned_by,
        start_date: task.start_date,
        end_date: task.end_date,
        story_point: 3,
        follower_ids: [user.id],
        user_update: user.id,
      };

      await taskService.updateATask(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });

      spy.mockRestore();
    });
  });

  describe("deleteATask", () => {
    it("should delete a task with valid ID", async () => {
      const task = await db.task.findOne();
      req.body = { id: task.id };

      await taskService.deleteATask(req, res);
      expect(res.status).toHaveBeenCalledWith(200);

      const deleted = await db.task.findByPk(task.id);
      expect(deleted).toBeNull();
    });

    it("should return 400 if ID is missing", async () => {
      req.body = {};
      await taskService.deleteATask(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if task does not exist", async () => {
      req.body = { id: 99999 };
      await taskService.deleteATask(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 if Task.findByPk throws an error", async () => {
      const spy = jest.spyOn(db.task, "findByPk").mockImplementation(() => {
        throw new Error("Simulated DB error");
      });

      req.body = { id: 1 };
      await taskService.deleteATask(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });

      spy.mockRestore();
    });
  });
});
