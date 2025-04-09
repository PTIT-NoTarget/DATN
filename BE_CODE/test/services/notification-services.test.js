const notificationService = require("../../app/services/notification-services");
const db = require("../../app/models");
const helper = require("../helper.test");
const io = require("../../app/services/socket-instance").getIO();

const mockEmit = jest.fn();
jest.mock("../../app/services/socket-instance", () => ({
  getIO: jest.fn(() => ({
    emit: mockEmit,
  })),
}));

describe("Notification Service", () => {
  let req, res;

  beforeEach(async () => {
    await helper.setupTestDatabase();
    req = {
      body: {
        user_id: 1,
        title: "Test Notification",
        message: "This is a test notification",
        metadata: JSON.stringify({
          taskId: 1,
          type: "test_notification",
        }),
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
  });

  afterEach(async () => {
    await helper.clearTestDatabase();
    jest.clearAllMocks();
    mockEmit.mockClear();
  });

  describe("getAllNotifications", () => {
    it("should return all notifications for a user", async () => {
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

    it("should return 500 if database error occurs", async () => {
      // Prepare
      const error = new Error("Database error");
      jest.spyOn(db.notification, "findAndCountAll").mockRejectedValue(error);

      // Execute
      await notificationService.getAllNotifications(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });

  describe("addANotification", () => {
    it("should create notification successfully", async () => {
      // Execute
      await notificationService.addANotification(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Notification added successfully",
      });

      // Check database
      const savedNotification = await db.notification.findOne({
        where: { message: req.body.message },
      });
      expect(savedNotification).toBeTruthy();
      expect(savedNotification.title).toBe(req.body.title);
      expect(savedNotification.message).toBe(req.body.message);
      expect(savedNotification.user_id).toBe(req.body.user_id);
    });

    it("should emit socket event when notification is created", async () => {
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
    });
  });

  describe("deleteANotification", () => {
    // it("should delete notification successfully", async () => {
    //   // Prepare
    //   const notification = await db.notification.create(req.body);
    //   req.body.id = notification.id;

    //   // Execute
    //   await notificationService.deleteANotification(req, res);

    //   // Assert
    //   expect(res.status).toHaveBeenCalledWith(200);
    //   expect(res.json).toHaveBeenCalledWith({
    //     success: true,
    //     message: "Notification deleted successfully",
    //   });

    //   // Verify deletion
    //   const deletedNotification = await db.notification.findByPk(
    //     notification.id
    //   );
    //   expect(deletedNotification).toBeNull();
    // });

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
      // Prepare
      req.body.id = 999;

      // Execute
      await notificationService.deleteANotification(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Notification not found",
      });
    });
  });

  // describe("updateANotification", () => {
  //   it("should update notification successfully", async () => {
  //     // Prepare
  //     const notification = await db.notification.create(req.body);
  //     req.body.id = notification.id;
  //     req.body.message = "Updated message";

  //     // Execute
  //     await notificationService.updateANotification(req, res);

  //     // Assert
  //     expect(res.status).toHaveBeenCalledWith(200);
  //     expect(res.json).toHaveBeenCalledWith({
  //       message: "Notification updated successfully",
  //     });

  //     // Verify update
  //     const updatedNotification = await db.notification.findByPk(
  //       notification.id
  //     );
  //     expect(updatedNotification.message).toBe("Updated message");
  //   });
  // });
});
