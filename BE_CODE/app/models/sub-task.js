const db_name = require("./database");
const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Task = sequelize.define(
    "sub_task",
    {
      task_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: db_name.task,
          key: "id",
        },
        onDelete: "CASCADE", // Xóa subtask khi task bị xóa
        onUpdate: "CASCADE", // Cập nhật subtask khi id của task thay đổi
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
    },
    {
      timestamps: true, // Tự động thêm createdAt và updatedAt
      tableName: db_name.sub_task,
    }
  );
  return Task;
};
