const database = require("../models/index.js");
const User = database.user;
const { Op } = require("sequelize");

var bcrypt = require("bcryptjs");

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 10;

    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    const email = req.body.email;
    const id = req.body.id;
    const username = req.body.username;
    const fullName = req.body.fullName;
    const sex = req.body.sex;
    const createdAt = req.body.createdAt;
    const dob = req.body.dob;

    // Điều kiện where
    const whereCondition = {};
    if (id) {
      whereCondition.id = id;
    }
    if (username) {
      whereCondition.username = username;
    }
    if (fullName) {
      whereCondition.fullName = { [Op.like]: `%${fullName}%` };
    }
    if (sex) {
      whereCondition.sex = sex;
    }
    if (email) {
      whereCondition.email = { [Op.like]: `%${email}%` };
    }
    if (dob) {
      const startOfDay = new Date(new Date(dob).setHours(0, 0, 0, 0));
      const endOfDay = new Date(new Date(dob).setHours(23, 59, 59, 999));
      whereCondition.dob = { [Op.between]: [startOfDay, endOfDay] };
    }
    if (createdAt) {
      const startOfDay = new Date(new Date(createdAt).setHours(0, 0, 0, 0));
      const endOfDay = new Date(new Date(createdAt).setHours(23, 59, 59, 999));
      whereCondition.createdAt = { [Op.between]: [startOfDay, endOfDay] };
    }

    const users = await User.findAndCountAll({
      limit: limit,
      offset: offset,
      where: whereCondition,
      attributes: { exclude: ["password"] },
    });

    res.json({
      totalItems: users.count,
      totalPages: Math.ceil(users.count / pageSize),
      page: page,
      pageSize: pageSize,
      users: users.rows,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = undefined;

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const user = await User.findByPk(req.body.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    delete req.body.username;
    delete req.body.email;
    delete req.body.phoneNumber;

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 8);
    }
    else {
      req.body.password = user.password;
    }

    await user.update(req.body);

    return res.status(200).json({
      success: true,
      message: "User info updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating user info",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const user = await User.findByPk(req.body.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.destroy();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting user",
    });
  }
};
