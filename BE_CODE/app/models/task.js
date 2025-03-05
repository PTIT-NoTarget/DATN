const db_name = require("./database");
const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Task = sequelize.define(
    "task",
    {
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: db_name.project,
          key: "id",
        },
        onDelete: "CASCADE", // Xóa task khi project bị xóa
        onUpdate: "CASCADE", // Cập nhật task khi id của project thay đổi
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      label: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      priority: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      assigned_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      story_point: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      user_update: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      follower_ids: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true, // Tự động thêm createdAt và updatedAt
      tableName: db_name.task,
    }
  );
  return Task;
};
