const projectService = require("../../app/services/project-services");
const db = require("../../app/models/index");

jest.mock("../../app/models/index.js", () => {
  return {
    project: {
      create: jest.fn(),
    },
  };
});

describe("Project Service - addAProject", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: "Test Project",
        description: "This is a test project",
        start_date: "2024-03-27",
        end_date: "2024-04-30",
        status: "ongoing",
        manager_id: 1,
        image_url: "https://example.com/image.jpg",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 if project is created successfully", async () => {
    // Mock thành công
    db.project.create.mockResolvedValue(req.body);

    // Gọi hàm
    await projectService.addAProject(req, res);

    // Kiểm tra
    expect(db.project.create).toHaveBeenCalledWith(req.body);
    expect(res.send).toHaveBeenCalledWith({ message: "Project successfully registered" });
  });

  it("should return 500 if database throws an error", async () => {
    // Mock lỗi database
    const errorMessage = "Database error";
    db.project.create.mockRejectedValue(new Error(errorMessage));

    // Gọi hàm
    await projectService.addAProject(req, res);

    // Kiểm tra
    expect(db.project.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ message: errorMessage });
  });
});
