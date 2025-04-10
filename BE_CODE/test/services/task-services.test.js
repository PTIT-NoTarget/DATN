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
    it("should return paginated tasks", async () => {
      req.body = { page: 1, pageSize: 2 };
      await taskService.getAllTasks(req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.totalItems).toBeGreaterThan(0);
      expect(result.issues.length).toBeLessThanOrEqual(2);
    });

    it("should filter tasks by project ID", async () => {
      const task = await db.task.findOne();
      req.body = { project_id: task.project_id };

      await taskService.getAllTasks(req, res);
      const data = res.json.mock.calls[0][0];
      expect(data.issues.every(t => t.projectId === task.project_id)).toBe(true);
    });

    it("should filter tasks by name", async () => {
      req.body = { name: "API" };

      await taskService.getAllTasks(req, res);
      const data = res.json.mock.calls[0][0];
      expect(data.issues.every(t => t.title.includes("API"))).toBe(true);
    });

    it("should return empty if no match", async () => {
      req.body = { name: "non-existent-task" };
      await taskService.getAllTasks(req, res);
      expect(res.json.mock.calls[0][0].issues.length).toBe(0);
    });
  });

  describe("addATask", () => {
    it("should create a task with valid input", async () => {
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
    });

    it("should fail if project_id is missing", async () => {
      req.body = { name: "Test" };
      await taskService.addATask(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should fail if project does not exist", async () => {
      req.body = {
        project_id: 99999,
        name: "Ghost Task",
        created_by: 1,
      };
      await taskService.addATask(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should fail if created_by is missing", async () => {
      const project = await db.project.findOne();
      req.body = {
        project_id: project.id,
        name: "Missing Creator",
      };
      await taskService.addATask(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("getATaskById", () => {
    it("should return a task by valid ID", async () => {
      const task = await db.task.findOne();
      req.params = { id: task.id };

      await taskService.getATaskById(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: task.id }));
    });

    it("should return 404 for invalid ID", async () => {
      req.params = { id: 9999 };
      await taskService.getATaskById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
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
  });
});