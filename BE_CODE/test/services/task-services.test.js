const taskService = require("../../app/services/task-services");
const db = require("../../app/models/index");
const helper = require("../helper.test");
const Task = db.task;
const { Op } = require("sequelize"); // Đảm bảo rằng Sequelize Op được import

// Mock `getIO` từ `socket-instance.js` để tránh lỗi Socket.io
jest.mock("../../app/services/socket-instance.js", () => ({
  getIO: jest.fn().mockReturnValue({
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  }),
}));

describe("Task Service", () => {
  let req, res;

  beforeEach(() => {
    // Giả lập request và response
    req = {
      body: {
        project_id: 1,
        name: "New Task",
        description: "This is a test task",
        label: "technical",
        status: "todo",
        priority: "high",
        start_date: "2024-01-01",
        end_date: "2024-01-10",
        assigned_by: 1,
        created_by: 1,
        story_point: 5,
        follower_ids: [1],
      },
    };

    res = {
      status: jest.fn().mockReturnThis(), // Mock method `status`
      json: jest.fn(), // Mock method `json`
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe("addATask", () => {
    it("should add a new task successfully and save to database", async () => {
      // Giả lập việc tạo task thành công
      const expectedTask = {
        ...req.body,
        status: "todo",
        priority: "high",
        story_point: 5,
      };
      jest.spyOn(Task, "create").mockResolvedValue(expectedTask); // Giả lập db tạo task thành công

      // Gọi hàm addATask với các tham số giả lập
      await taskService.addATask(req, res);

      // Kiểm tra xem status có trả về 200 không
      expect(res.status).toHaveBeenCalledWith(200);
      // Kiểm tra xem json có trả về thông báo thành công không
      expect(res.json).toHaveBeenCalledWith({
        message: "Task added successfully",
      });
    });

    it("should return 500 if database error occurs", async () => {
      // Giả lập lỗi khi tạo task trong database
      const error = new Error("Database error");
      jest.spyOn(Task, "create").mockRejectedValue(error); // Giả lập lỗi từ database

      // Gọi hàm addATask với các tham số giả lập
      await taskService.addATask(req, res);

      // Kiểm tra xem status có trả về 500 không
      expect(res.status).toHaveBeenCalledWith(500);
      // Kiểm tra xem json có trả về lỗi không
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal Server Error",
      });
    });
  });

  describe("getAllTasks", () => {
    it("should return a list of tasks successfully", async () => {
      // Giả lập dữ liệu trả về từ database
      const tasksData = {
        count: 2,
        rows: [
          {
            id: 1,
            name: "Task 1",
            status: "todo",
            priority: "high",
            description: "Task 1 description",
            assigned_by: 1,
            project_id: 1,
            start_date: "2024-01-01",
            end_date: "2024-01-10",
            created_by: 1,
            story_point: 5,
            follower_ids: "[1]",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 2,
            name: "Task 2",
            status: "in-progress",
            priority: "medium",
            description: "Task 2 description",
            assigned_by: 2,
            project_id: 1,
            start_date: "2024-01-05",
            end_date: "2024-01-15",
            created_by: 2,
            story_point: 3,
            follower_ids: "[2]",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };

      // Giả lập findAndCountAll trả về dữ liệu task
      jest.spyOn(Task, "findAndCountAll").mockResolvedValue(tasksData);

      // Giả lập request với tham số tìm kiếm
      req = {
        body: {
          page: 1,
          pageSize: 10,
        },
      };

      // Gọi hàm getAllTasks với các tham số giả lập
      await taskService.getAllTasks(req, res);

      // Kiểm tra xem status có trả về 200 không
      expect(res.status).toHaveBeenCalledWith(200); // Kiểm tra res.status
      // Kiểm tra xem json có trả về đúng dữ liệu không
      expect(res.json).toHaveBeenCalledWith({
        totalItems: 2,
        totalPages: 1,
        page: 1,
        pageSize: 10,
        issues: expect.arrayContaining([
          expect.objectContaining({
            title: "Task 1",
            status: "todo",
            priority: "high",
          }),
          expect.objectContaining({
            title: "Task 2",
            status: "in-progress",
            priority: "medium",
          }),
        ]),
      });
    });

    it("should return 500 if database error occurs", async () => {
      // Giả lập lỗi khi tìm kiếm task trong database
      const error = new Error("Database error");
      jest.spyOn(Task, "findAndCountAll").mockRejectedValue(error); // Giả lập lỗi từ database

      // Gọi hàm getAllTasks với các tham số giả lập
      await taskService.getAllTasks(req, res);

      // Kiểm tra xem status có trả về 500 không
      expect(res.status).toHaveBeenCalledWith(500); // Kiểm tra res.status
      // Kiểm tra xem json có trả về lỗi không
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal Server Error",
      });
    });
  });

  describe("getATaskById", () => {
    it("should return a task by ID successfully", async () => {
      // Giả lập dữ liệu trả về từ database
      const taskData = {
        id: 1,
        name: "Task 1",
        status: "todo",
        priority: "high",
        description: "Task 1 description",
        assigned_by: 1,
        project_id: 1,
        start_date: "2024-01-01",
        end_date: "2024-01-10",
        created_by: 1,
        story_point: 5,
        follower_ids: "[1]",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Giả lập findOne trả về task theo ID
      jest.spyOn(Task, "findOne").mockResolvedValue(taskData);

      // Giả lập request với tham số tìm kiếm
      req = {
        params: {
          id: 1,
        },
      };

      // Gọi hàm getATaskById với các tham số giả lập
      await taskService.getATaskById(req, res);

      // Kiểm tra xem status có trả về 200 không
      expect(res.status).toHaveBeenCalledWith(200); // Kiểm tra res.status
      // Kiểm tra xem json có trả về đúng dữ liệu không
      expect(res.json).toHaveBeenCalledWith({
        task: expect.objectContaining({
          id: 1,
          name: "Task 1",
          status: "todo",
          priority: "high",
        }),
      });
    });

    it("should return 404 if task is not found", async () => {
      // Giả lập findOne trả về null nếu không tìm thấy task
      jest.spyOn(Task, "findOne").mockResolvedValue(null);

      // Giả lập request với tham số tìm kiếm
      req = {
        params: {
          id: 999, // ID không tồn tại
        },
      };

      // Gọi hàm getATaskById với các tham số giả lập
      await taskService.getATaskById(req, res);

      // Kiểm tra xem status có trả về 404 không
      expect(res.status).toHaveBeenCalledWith(404);
      // Kiểm tra xem json có trả về thông báo lỗi không
      expect(res.json).toHaveBeenCalledWith({
        error: "Task not found",
      });
    });

    it("should return 500 if database error occurs", async () => {
      // Giả lập lỗi khi tìm task trong database
      const error = new Error("Database error");
      jest.spyOn(Task, "findOne").mockRejectedValue(error);

      // Giả lập request với tham số tìm kiếm
      req = {
        params: {
          id: 1,
        },
      };

      // Gọi hàm getATaskById với các tham số giả lập
      await taskService.getATaskById(req, res);

      // Kiểm tra xem status có trả về 500 không
      expect(res.status).toHaveBeenCalledWith(500);
      // Kiểm tra xem json có trả về lỗi không
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal Server Error",
      });
    });
  });

  describe("updateATask", () => {
    it("should update a task successfully", async () => {
      const updatedTask = {
        id: 1,
        name: "Updated Task",
        status: "in-progress",
        priority: "medium",
        description: "Updated task description",
        assigned_by: 1,
        project_id: 1,
        start_date: "2024-01-01",
        end_date: "2024-01-10",
        created_by: 1,
        story_point: 5,
        follower_ids: "[1]",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Giả lập cập nhật task thành công
      jest.spyOn(Task, "update").mockResolvedValue([1]); // Return array with 1 to indicate 1 row updated

      // Giả lập request với tham số cập nhật
      req = {
        params: {
          id: 1,
        },
        body: {
          name: "Updated Task",
          status: "in-progress",
          priority: "medium",
          description: "Updated task description",
        },
      };

      // Gọi hàm updateATask với các tham số giả lập
      await taskService.updateATask(req, res);

      // Kiểm tra xem status có trả về 200 không
      expect(res.status).toHaveBeenCalledWith(200);
      // Kiểm tra xem json có trả về thông báo thành công không
      expect(res.json).toHaveBeenCalledWith({
        message: "Task updated successfully",
      });
    });

    it("should return 404 if task is not found", async () => {
      // Giả lập không tìm thấy task để cập nhật
      jest.spyOn(Task, "update").mockResolvedValue([0]); // Return [0] to simulate no rows updated

      // Giả lập request với tham số cập nhật
      req = {
        params: {
          id: 999, // ID không tồn tại
        },
        body: {
          name: "Updated Task",
          status: "in-progress",
          priority: "medium",
          description: "Updated task description",
        },
      };

      // Gọi hàm updateATask với các tham số giả lập
      await taskService.updateATask(req, res);

      // Kiểm tra xem status có trả về 404 không
      expect(res.status).toHaveBeenCalledWith(404);
      // Kiểm tra xem json có trả về lỗi không
      expect(res.json).toHaveBeenCalledWith({
        error: "Task not found",
      });
    });

    it("should return 500 if database error occurs", async () => {
      // Giả lập lỗi khi cập nhật task trong database
      const error = new Error("Database error");
      jest.spyOn(Task, "update").mockRejectedValue(error);

      // Giả lập request với tham số cập nhật
      req = {
        params: {
          id: 1,
        },
        body: {
          name: "Updated Task",
          status: "in-progress",
          priority: "medium",
          description: "Updated task description",
        },
      };

      // Gọi hàm updateATask với các tham số giả lập
      await taskService.updateATask(req, res);

      // Kiểm tra xem status có trả về 500 không
      expect(res.status).toHaveBeenCalledWith(500);
      // Kiểm tra xem json có trả về lỗi không
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal Server Error",
      });
    });
  });

  describe("deleteATask", () => {
    it("should delete a task successfully", async () => {
      // Giả lập việc xóa task thành công
      jest.spyOn(Task, "destroy").mockResolvedValue(1); // Giả lập xóa task thành công

      // Giả lập request với tham số id
      req = {
        params: {
          id: 1,
        },
      };

      // Gọi hàm deleteATask với các tham số giả lập
      await taskService.deleteATask(req, res);

      // Kiểm tra xem status có trả về 200 không
      expect(res.status).toHaveBeenCalledWith(200);
      // Kiểm tra xem json có trả về thông báo thành công không
      expect(res.json).toHaveBeenCalledWith({
        message: "Task deleted successfully",
      });
    });

    it("should return 404 if task is not found", async () => {
      // Giả lập không tìm thấy task để xóa
      jest.spyOn(Task, "destroy").mockResolvedValue(0); // Return 0 to simulate no rows deleted

      // Giả lập request với tham số id
      req = {
        params: {
          id: 999, // ID không tồn tại
        },
      };

      // Gọi hàm deleteATask với các tham số giả lập
      await taskService.deleteATask(req, res);

      // Kiểm tra xem status có trả về 404 không
      expect(res.status).toHaveBeenCalledWith(404);
      // Kiểm tra xem json có trả về lỗi không
      expect(res.json).toHaveBeenCalledWith({
        error: "Task not found",
      });
    });

    it("should return 500 if database error occurs", async () => {
      // Giả lập lỗi khi xóa task trong database
      const error = new Error("Database error");
      jest.spyOn(Task, "destroy").mockRejectedValue(error);

      // Giả lập request với tham số id
      req = {
        params: {
          id: 1,
        },
      };

      // Gọi hàm deleteATask với các tham số giả lập
      await taskService.deleteATask(req, res);

      // Kiểm tra xem status có trả về 500 không
      expect(res.status).toHaveBeenCalledWith(500);
      // Kiểm tra xem json có trả về lỗi không
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal Server Error",
      });
    });
  });
});
