const configuration = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  configuration.DB,
  configuration.USER,
  configuration.PASSWORD,
  {
    host: configuration.HOST,
    dialect: configuration.dialect,
    pool: {
      max: configuration.pool.max,
      min: configuration.pool.min,
      acquire: configuration.pool.acquire,
      idle: configuration.pool.idle,
    },
    logging: configuration.logging,
  }
);

const database = {};
database.Sequelize = Sequelize;
database.sequelize = sequelize;
database.user = require("./user.js")(sequelize, Sequelize);
database.project = require("./project.js")(sequelize, Sequelize);
database.project_user = require("./project-user.js")(sequelize, Sequelize);
database.task = require("./task.js")(sequelize, Sequelize);
database.sub_task = require("./sub-task.js")(sequelize, Sequelize);
database.department = require("./department.js")(sequelize, Sequelize);
database.notification = require("./notification.js")(sequelize, Sequelize);

// Thiết lập quan hệ nhiều nhiều với bảng user và bảng project
database.project.belongsToMany(database.user, {
  through: database.project_user,
  foreignKey: "project_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
database.user.belongsToMany(database.project, {
  through: database.project_user,
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Một project có nhiều tasks
database.project.hasMany(database.task, {
  foreignKey: "project_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Một task có nhiều subtask
database.task.hasMany(database.sub_task, {
  foreignKey: "task_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Thiết lập quan hệ 1 nhiều giữa bảng user và department (1 department chứa nhiều user, nhưng 1 user chỉ có 1 department)
database.department.hasMany(database.user, {
  foreignKey: "department_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
database.user.belongsTo(database.department, {
  foreignKey: "department_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

sequelize.sync().then(() => {
  return database.user.findOrCreate({
    where: { username: 'admin' },
    defaults: {
      username: "admin",
      email: "admin@example.com",
      password: '$2a$12$2C7ZzkR1EfWLzkrPf8UF8eA8l1EXS/.7FAQ0WRCxyE6gKLkjwZPje', // 12345678
      fullName: "Admin User",
      sex: "0",
      dob: "2000-01-01",
      phoneNumber: "0123456789",
      address: "Admin Address",
      avatarUrl: null,
      role: "admin",
      position: "MANAGER",
      position_1: "ADMIN",
      position_level: "SENIOR",
      start_date: "2025-01-01",
      department_id: null,
    }
  });
}).catch(err => {
  console.error('Lỗi khi tạo user admin:', err);
});

module.exports = database;
