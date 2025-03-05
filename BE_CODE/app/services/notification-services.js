const database = require("../models/index.js");
const Project = database.project;
const User = database.user;
const Notification = database.notification;
const { Op } = require("sequelize");
const io = require("../services/socket-instance").getIO();

exports.getAllNotifications = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 10;
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const user_id = req.body.user_id;

    let whereCondition = {};
    if (user_id === 0) {
      whereCondition.user_id = user_id;
    } else {
      whereCondition = {
        [Op.or]: [
          { user_id: user_id }, // Điều kiện user_id từ body
          { user_id: 0 }, // Thêm điều kiện user_id = 0
        ],
      };
    }

    const notifications = await Notification.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]], // Sắp xếp theo thứ tự giảm dần
    });

    res.json({
      totalItems: notifications.count,
      totalPages: Math.ceil(notifications.count / pageSize),
      page: page,
      pageSize: pageSize,
      notis: notifications.rows,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addANotification = async (req, res) => {
  try {
    const body = {
      user_id: req.body.user_id,
      title: req.body.title,
      message: req.body.message,
      seen: false,
      metadata: req.body.metadata,
    };

    // Gửi thông báo
    io.emit("taskNotification", body);

    await Notification.create(body);

    return res.status(200).json({
      message: "Notification added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getANotificationById = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findByPk(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateANotification = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({
        message: "Id is required",
      });
    }

    const notification = await Notification.findByPk(req.body.id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    await notification.update(req.body);

    return res.status(200).json({
      message: "Notification updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteANotification = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const notification = await Notification.findByPk(req.body.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    await notification.destroy();

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
