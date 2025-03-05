const db_name = require("./database.js");
const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const ProjectUser = sequelize.define(
    "project_user",
    {
      project_id: {
        type: DataTypes.INTEGER,
        references: {
          model: db_name.project,
          key: "id",
        },
        onDelete: 'CASCADE',
        onUpdate: "CASCADE",
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: db_name.user,
          key: "id",
        },
        onDelete: 'CASCADE',
        onUpdate: "CASCADE",
      },
    },
    {
      tableName: db_name.project_user,
      timestamps: true, 
    }
  );

  return ProjectUser;
};
