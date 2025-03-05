const database = require("../models/index.js");
const Project = database.project;
const ProjectUser = database.project_user;
const User = database.user;

exports.getAllProjects = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 10;
    const userId = req.body.userId;

    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const filterOptions = {
      limit: limit,
      offset: offset,
    };

    if (userId) {
      filterOptions.include = [
        {
          model: User,
          where: { id: userId },
          through: { attributes: [] },
          attributes: [],
        },
      ];
    }

    const projects = await Project.findAndCountAll(filterOptions);

    res.json({
      totalItems: projects.count,
      totalPages: Math.ceil(projects.count / pageSize),
      page: page,
      pageSize: pageSize,
      projects: projects.rows,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addAProject = async (req, res) => {
  const body = {
    name: req.body.name,
    description: req.body.description,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    status: req.body.status,
    manager_id: req.body.manager_id,
    image_url: req.body.image_url,
  };

  await Project.create(body)
    .then(res.send({ message: "Project successfully registered" }))
    .catch((exception) => {
      res.status(500).send({ message: exception.message });
    });
};

exports.getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findByPk(projectId, {
      include: {
        model: User,
        attributes: { exclude: ["password"] },
        through: {
          attributes: [], // Không lấy các trường từ bảng trung gian
        },
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateProject = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const project = await Project.findByPk(req.body.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await project.update(req.body);

    return res.status(200).json({
      success: true,
      message: "Project info updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating project info",
      error,
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const project = await Project.findByPk(req.body.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await ProjectUser.destroy({ where: { project_id: req.body.id } });

    await project.destroy();

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting project",
      error,
    });
  }
};

exports.addUsersToProject = async (req, res) => {
  try {
    const body = {
      projectId: req.body.projectId,
      userIds: req.body.userIds, // array
    };

    const project = await Project.findByPk(body.projectId);
    if (!project) {
      return res.status(404).json({
        error: `Project with ID ${body.projectId} not found`,
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

    await project.addUsers(users);

    return res.status(200).json({
      message: `Users with IDs [${body.userIds.join(
        ", "
      )}] added to project with ID ${body.projectId}`,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to add users to project",
    });
  }
};

exports.removeUserFromProject = async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        error: `Project with ID ${projectId} not found`,
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        error: `User with ID ${userId} not found`,
      });
    }

    await project.removeUser(user);

    return res.status(200).json({
      message: `User with ID ${userId} removed from project with ID ${projectId}`,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to remove user from project",
    });
  }
};
