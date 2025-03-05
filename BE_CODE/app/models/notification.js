const db_name = require("./database");
const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Notification = sequelize.define(
    "notification",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      seen: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      metadata: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: db_name.notification,
    }
  );

  return Notification;
};
