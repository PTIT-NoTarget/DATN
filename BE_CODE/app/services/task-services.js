const database = require("../models/index.js");
const Project = database.project;
const User = database.user;
const Task = database.task;
const io = require("../services/socket-instance").getIO();
const Notification = database.notification;
const { Op } = require("sequelize");

exports.getAllTasks = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 10;
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const projectId = req.body.project_id;
    const assignedBy = req.body.assigned_by;
    const status = req.body.status;
    const title = req.body.name;
    const id = req.body.id;
    const createdAt = req.body.createdAt;

    const whereCondition = {};
    if (projectId) {
      whereCondition.project_id = projectId;
    }
    if (assignedBy) {
      whereCondition.assigned_by = assignedBy;
    }
    if (status) {
      whereCondition.status = status;
    }
    if (title) {
      whereCondition.name = { [Op.like]: `%${title}%` };
    }
    if (createdAt) {
      const startOfDay = new Date(new Date(createdAt).setHours(0, 0, 0, 0));
      const endOfDay = new Date(new Date(createdAt).setHours(23, 59, 59, 999));
      whereCondition.createdAt = { [Op.between]: [startOfDay, endOfDay] };
    }
    if (id) {
      whereCondition.id = id;
    }

    const tasks = await Task.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
    });

    const data = tasks.rows.map((item) => {
      return {
        id: item.id,
        title: item.name,
        type: item.label,
        status: item.status,
        priority: item.priority,
        listPosition: 0, // temp
        description: item.description,
        estimate: 1, // temp
        timeSpent: 1, // temp
        timeRemaining: 1, // temp
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        reporterId: item.assigned_by,
        userIds: JSON.parse(item.follower_ids), // follower id
        comments: [],
        projectId: item.project_id,
        startDate: item.start_date,
        endDate: item.end_date,
        createdBy: item.created_by,
        storyPoint: item.story_point,
      };
    });

    res.json({
      totalItems: tasks.count,
      totalPages: Math.ceil(tasks.count / pageSize),
      page: page,
      pageSize: pageSize,
      issues: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addATask = async (req, res) => {
  try {
    if (!req.body.project_id) {
      return res.status(400).json({
        message: "project_id is required",
      });
    }

    const project = await Project.findByPk(req.body.project_id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (!req.body.created_by) {
      return res.status(400).json({
        message: "created_by is required",
      });
    }

    const body = {
      project_id: req.body.project_id,
      name: req.body.name,
      description: req.body.description,
      label: req.body.label,
      status: req.body.status,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      assigned_by: req.body.assigned_by,
      created_by: req.body.created_by,
      story_point: req.body.story_point,
      follower_ids: JSON.stringify(req.body.follower_ids),
    };

    await Task.create(body);

    // Lấy thông tin user
    const user = await User.findByPk(body.created_by);

    const notiBody = {
      user_id: 0,
      title: ``,
      message: `${user.dataValues.fullName} vừa tạo mới công việc "${body.name}"`,
      seen: false,
      metadata: "",
    };

    await Notification.create(notiBody);

    // Gửi thông báo
    io.emit("taskNotification", notiBody);

    return res.status(200).json({
      message: "Task added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getATaskById = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const data = {
      id: task.id,
      title: task.name,
      type: task.label,
      status: task.status,
      priority: task.priority,
      listPosition: 0, // temp
      description: task.description,
      estimate: 1, // temp
      timeSpent: 1, // temp
      timeRemaining: 1, // temp
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      reporterId: task.assigned_by,
      userIds: JSON.parse(task.follower_ids),
      comments: [],
      projectId: task.project_id,
      startDate: task.start_date,
      endDate: task.end_date,
      createdBy: task.created_by,
      storyPoint: task.story_point,
    };

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateATask = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({
        message: "Id is required",
      });
    }

    const task = await Task.findByPk(req.body.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // body update task
    const body = {
      id: req.body.id,
      project_id: task.dataValues.project_id,
      name: req.body.name,
      description: req.body.description,
      label: req.body.label,
      status: req.body.status,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      assigned_by: req.body.assigned_by,
      created_by: task.dataValues.created_by,
      story_point: req.body.story_point,
      user_update: req.body.user_update, // userId update task
      follower_ids: JSON.stringify(req.body.follower_ids),
    };

    // Lấy thông tin user
    const user = await User.findByPk(body.user_update);

    // update task
    await task.update(body);

    // Noti
    if (req.body.assigned_by && req.body.assigned_by !== req.body.user_update) {
      // metadata noti update status task
      const metadataTaskStatus = {
        prevStatus: task.dataValues.status,
        currentStatus: body.status,
        nameUserUpdate: user.dataValues.fullName,
        taskId: req.body.id,
        taskName: task.dataValues.name,
      };
      // Lưu thông báo vào DB
      const notiBody = {
        user_id: req.body.assigned_by,
        title: ``,
        message: ``,
        seen: false,
        metadata: JSON.stringify(metadataTaskStatus),
      };

      await Notification.create(notiBody);

      // Gửi thông báo
      io.emit("taskNotification", notiBody);
    }
    // response update task
    return res.status(200).json({
      message: "Task updated successfully",
    });
  } catch (error) {
    console.log("task err", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteATask = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const task = await Task.findByPk(req.body.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await task.destroy();

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
