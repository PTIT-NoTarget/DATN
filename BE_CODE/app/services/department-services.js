const database = require("../models/index.js");
const Department = database.department;
const User = database.user;
const { Op } = require('sequelize');

exports.getAllDepartments = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 10;

    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    const name = req.body.name;
    const id = req.body.id;
    const description = req.body.description;
    const manager_id = req.body.manager_id;
    const createdAt = req.body.createdAt;

    // Điều kiện where
    const whereCondition = {};
    if (id) {
      whereCondition.id = id;
    }
    if (name) {
      whereCondition.name = { [Op.like]: `%${name}%` };
    }
    if (description) {
      whereCondition.description = { [Op.like]: `%${description}%` };
    }
    if (manager_id) {
      whereCondition.manager_id = manager_id;
    }
    if (createdAt) {
      const startOfDay = new Date(new Date(createdAt).setHours(0, 0, 0, 0));
      const endOfDay = new Date(new Date(createdAt).setHours(23, 59, 59, 999));
      whereCondition.createdAt = { [Op.between]: [startOfDay, endOfDay] };
    }

    const departments = await Department.findAndCountAll({
      limit: limit,
      offset: offset,
      where: whereCondition,
      include: {
        model: User,
        attributes: { exclude: ["password"] },
      },
    });

    const data = departments.rows.map((item) => {
      return {
        ...item.toJSON(),
        memberCount: item.getDataValue("memberCount"),
      };
    });

    res.json({
      totalItems: departments.count,
      totalPages: Math.ceil(departments.count / pageSize),
      page: page,
      pageSize: pageSize,
      departments: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addADepartment = async (req, res) => {
  const body = {
    name: req.body.name,
    description: req.body.description,
    manager_id: req.body.manager_id,
  };

  await Department.create(body)
    .then(res.send({ message: "Department successfully registered" }));
};

exports.getDepartmentById = async (req, res) => {
  try {
    const departmentId = req.params.id;
    const department = await Department.findByPk(departmentId, {
      include: {
        model: User,
        attributes: { exclude: ["password"] },
      },
    });

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json(department);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const department = await Department.findByPk(req.body.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    await department.update(req.body);

    return res.status(200).json({
      success: true,
      message: "Department info updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating Department info",
    });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const department = await Department.findByPk(req.body.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    await department.destroy();

    return res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting department",
    });
  }
};

exports.addUsersToDepartment = async (req, res) => {
  try {
    const body = {
      departmentId: req.body.departmentId,
      userIds: req.body.userIds, // array
    };

    const department = await Department.findByPk(body.departmentId);
    if (!department) {
      return res.status(404).json({
        error: `Department with ID ${body.departmentId} not found`,
      });
    }

    if (!Array.isArray(body.userIds) || body.userIds.length === 0) {
      return res.status(400).json({
        error: "userIds must be a non-empty array",
      });
    }

    const users = await User.findAll({
      where: {
        id: body.userIds,
      },
    });

    if (users.length === 0) {
      return res.status(404).json({
        message: `No users found with the provided IDs: ${body.userIds.join(
          ", "
        )}`,
      });
    }

    await department.addUsers(users);

    return res.status(200).json({
      message: `Users with IDs [${body.userIds.join(
        ", "
      )}] added to department with ID ${body.departmentId}`,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to add users to department",
    });
  }
};

exports.removeUserFromDepartment = async (req, res) => {
  try {
    const { departmentId, userId } = req.body;

    const department = await Department.findByPk(departmentId);
    if (!department) {
      return res.status(404).json({
        error: `Department with ID ${departmentId} not found`,
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        error: `User with ID ${userId} not found`,
      });
    }

    await department.removeUser(user);

    return res.status(200).json({
      message: `User with ID ${userId} removed from department with ID ${departmentId}`,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to remove user from department",
    });
  }
};

function validateRequest(req) {
  if (!req.body) {
    res.status(400).send({
      message: "Request can't be empty!",
    });
    return;
  }
}
