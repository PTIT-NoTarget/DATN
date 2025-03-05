const database = require("../models/index.js");
const Task = database.task;
const User = database.user;
const SubTask = database.sub_task;

exports.getAllSubTasks = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 10;
    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const taskId = req.body.task_id;
    const assignedBy = req.body.assigned_by;

    const whereCondition = {};
    if (taskId) {
      whereCondition.task_id = taskId;
    }
    if (assignedBy) {
      whereCondition.assigned_by = assignedBy;
    }

    const subTasks = await SubTask.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
    });

    res.json({
      totalItems: subTasks.count,
      totalPages: Math.ceil(subTasks.count / pageSize),
      page: page,
      pageSize: pageSize,
      projects: subTasks.rows,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addASubTask = async (req, res) => {
  try {
    if (!req.body.task_id) {
      return res.status(400).json({
        message: "task_id is required",
      });
    }

    const task = await Task.findByPk(req.body.task_id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (!req.body.created_by) {
      return res.status(400).json({
        message: "created_by is required",
      });
    }

    const body = {
      task_id: req.body.task_id,
      name: req.body.name,
      description: req.body.description,
      label: req.body.label,
      status: req.body.status,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      assigned_by: req.body.assigned_by,
      created_by: req.body.created_by,
      story_point: req.body.story_point,
    };

    await SubTask.create(body);

    return res.status(200).json({
      message: "SubTask added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getASubTaskById = async (req, res) => {
  try {
    const subTaskId = req.params.id;
    const subTask = await SubTask.findByPk(subTaskId);

    if (!subTask) {
      return res.status(404).json({ message: "SubTask not found" });
    }

    res.json(subTask);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateASubTask = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({
        message: "Id is required",
      });
    }

    const subTask = await SubTask.findByPk(req.body.id);

    if (!subTask) {
      return res.status(404).json({
        message: "SubTask not found",
      });
    }

    const body = {
      id: req.body.id,
      task_id: subTask.dataValues.task_id,
      name: req.body.name,
      description: req.body.description,
      label: req.body.label,
      status: req.body.status,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      assigned_by: req.body.assigned_by,
      created_by: subTask.dataValues.created_by,
      story_point: req.body.story_point,
    };

    await subTask.update(body);

    return res.status(200).json({
      message: "SubTask updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteASubTask = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const subTask = await SubTask.findByPk(req.body.id);

    if (!subTask) {
      return res.status(404).json({
        success: false,
        message: "SubTask not found",
      });
    }

    await subTask.destroy();

    return res.status(200).json({
      message: "SubTask deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
