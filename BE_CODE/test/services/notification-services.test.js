const mockEmit = jest.fn();

// Mock socket-instance BEFORE requiring the notification service
jest.mock("../../app/services/socket-instance", () => ({
  getIO: () => ({
    emit: mockEmit,
  }),
}));

const notificationService = require("../../app/services/notification-services");
const helper = require("../helper.test");
const db = require("../../app/models");

describe("Notification Service", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        user_id: 1,
        title: "Test Notification",
        message: "This is a test notification",
        metadata: JSON.stringify({
          taskId: 1,
          type: "test",
        }),
      },
      params: {
        id: 1,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  beforeEach(async () => {
    await helper.setupTestDatabase();
  });

  afterEach(async () => {
    await helper.clearTestDatabase();
    jest.clearAllMocks();
  });

  describe("getAllNotifications", () => {
    it("should get all notifications with pagination", async () => {
      // Prepare
      await helper.createTestData();
      req.body = {
        page: 1,
        pageSize: 10,
        user_id: 1,
      };

      // Execute
      await notificationService.getAllNotifications(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          totalItems: expect.any(Number),
          totalPages: expect.any(Number),
          page: 1,
          pageSize: 10,
          notis: expect.any(Array),
        })
      );
    });

    it("should handle empty notifications list", async () => {
      // Execute
      await notificationService.getAllNotifications(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        totalItems: 0,
        totalPages: 0,
        page: 1,
        pageSize: 10,
        notis: [],
      });
    });

    it("should apply proper pagination", async () => {
      // Prepare
      await helper.createTestData();
      req.body = {
        page: 2,
        pageSize: 1,
        user_id: 1,
      };

      // Execute
      await notificationService.getAllNotifications(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2,
          pageSize: 1,
          notis: expect.any(Array),
        })
      );
    });
  });

  describe("addANotification", () => {
    it("should create notification successfully", async () => {
      // Execute
      await notificationService.addANotification(req, res);

      // Assert
      expect(mockEmit).toHaveBeenCalledWith("taskNotification", {
        user_id: req.body.user_id,
        title: req.body.title,
        message: req.body.message,
        seen: false,
        metadata: req.body.metadata,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Notification added successfully",
      });

      // Verify database
      const savedNotification = await db.notification.findOne({
        where: { user_id: req.body.user_id },
      });
      expect(savedNotification).toBeTruthy();
      expect(savedNotification.title).toBe(req.body.title);
    });

    it("should handle database error", async () => {
      // Prepare
      jest
        .spyOn(db.notification, "create")
        .mockRejectedValue(new Error("Database error"));

      // Execute
      await notificationService.addANotification(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal Server Error",
      });
    });
  });

  describe("getANotificationById", () => {
    it("should get notification by id", async () => {
      // Prepare
      await helper.createTestData();

      // Execute
      await notificationService.getANotificationById(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(Number),
          user_id: expect.any(Number),
          message: expect.any(String),
        })
      );
    });

    it("should return 404 if notification not found", async () => {
      // Execute
      await notificationService.getANotificationById(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Notification not found",
      });
    });

    it("should return full notification object with all fields", async () => {
      // Prepare
      await helper.createTestData();
      const notification = await db.notification.findOne();
      req.params.id = notification.id;

      // Execute
      await notificationService.getANotificationById(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(Number),
          user_id: expect.any(Number),
          title: expect.any(String),
          message: expect.any(String),
          seen: expect.any(Boolean),
          metadata: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        })
      );
    });

    it("should handle invalid notification id", async () => {
      // Prepare
      req.params.id = "invalid-id";

      // Execute
      await notificationService.getANotificationById(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("deleteANotification", () => {
    it("should delete notification successfully", async () => {
      // Prepare
      req.body.id = 1;
      await helper.createTestData();

      // Execute
      await notificationService.deleteANotification(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Notification deleted successfully",
      });

      // Verify deletion
      const deletedNotification = await db.notification.findByPk(req.body.id);
      expect(deletedNotification).toBeNull();
    });

    it("should return 400 if id is missing", async () => {
      // Prepare
      req.body.id = null;

      // Execute
      await notificationService.deleteANotification(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Id is required",
      });
    });

    it("should return 404 if notification not found", async () => {
      // Execute
      req.body.id = 999;
      await notificationService.deleteANotification(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Notification not found",
      });
    });
  });
});
