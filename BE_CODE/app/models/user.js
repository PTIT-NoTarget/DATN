const db_name = require("./database");
const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "user",
    {
      username: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      fullName: {
        type: DataTypes.STRING,
      },
      sex: {
        type: DataTypes.STRING,
      },
      dob: {
        type: DataTypes.STRING,
      },
      phoneNumber: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      avatarUrl: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.STRING,
      },
      position: {
        type: DataTypes.STRING, // chức vụ. VD: giám đốc, nhân viên,..
      },
      position_1: {
        type: DataTypes.STRING, // chức vụ. VD: dev, BA, tester,..
      },
      position_level: {
        type: DataTypes.STRING, // level. VD: intern, junior,...
      },
      start_date: {
        type: DataTypes.STRING, // ngày tham gia công ty
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: db_name.department,
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }
    },
    {
      timestamps: true, // Tự động thêm createdAt và updatedAt
      tableName: db_name.user,
    }
  );

  return User;
};
