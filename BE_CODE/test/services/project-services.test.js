const projectService = require("../../app/services/project-services");
const db = require("../../app/models/index");

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
      db.project.create({ name: "Project A", description: "A desc" }),
      db.project.create({ name: "Project B", description: "B desc" }),
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
      await db.project.destroy({ where: { name: "New Project" } });
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
      const inserted = await db.project.findOne({
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
  
 
});
