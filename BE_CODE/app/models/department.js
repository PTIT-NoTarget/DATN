const db_name = require("./database");
const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Project = sequelize.define(
    "department",
    {
      name: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      manager_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: db_name.department,
    }
  );

  return Project;
};
