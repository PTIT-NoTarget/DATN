const db_name = require("./database");
const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Project = sequelize.define(
    "project",
    {
      name: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      start_date: {
        type: DataTypes.STRING,
      },
      end_date: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.INTEGER,
      },
      manager_id: {
        type: DataTypes.INTEGER,
      },
      image_url: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: db_name.project,
    }
  );

  return Project;
};
