const database = require("../app/models");
const bcrypt = require("bcryptjs");

const setupTestDatabase = async () => {
  await database.sequelize.sync({ force: true });
};

const clearTestDatabase = async () => {
  await database.project_user.destroy({ where: {} });
  await database.sub_task.destroy({ where: {} });
  await database.task.destroy({ where: {} });
  await database.notification.destroy({ where: {} });
  await database.project.destroy({ where: {} });
  await database.user.destroy({ where: {} });
  await database.department.destroy({ where: {} });
};

// Tạo department mẫu
const createTestDepartments = async () => {
  const departments = await database.department.bulkCreate([
    {
      name: "Development",
      description: "Phòng phát triển phần mềm",
      manager_id: null, // Sẽ update sau khi có user
    },
    {
      name: "QA/Testing",
      description: "Phòng kiểm thử phần mềm",
      manager_id: null,
    },
    {
      name: "Business Analysis",
      description: "Phòng phân tích nghiệp vụ",
      manager_id: null,
    },
  ]);
  return departments;
};
const createMoreUsers = async (departments) => {
  const users = await database.user.bulkCreate([
    {
      username: "johndoe",
      email: "john@example.com",
      password: bcrypt.hashSync("password123", 8),
      fullName: "John Doe",
      sex: "0", // Nam
      dob: "1990-01-01",
      phoneNumber: "0123456789",
      address: "123 Street",
      position: "MANAGER",
      position_1: "DEV",
      position_level: "SENIOR",
      role: "admin",
      department_id: departments[0].id,
      start_date: "2020-01-01",
    },
    {
      username: "janesmith",
      email: "jane@example.com",
      password: bcrypt.hashSync("password123", 8),
      fullName: "Jane Smith",
      sex: "1", // Nữ
      dob: "1992-02-02",
      phoneNumber: "0987654321",
      address: "456 Avenue",
      position: "STAFF",
      position_1: "TESTER",
      position_level: "JUNIOR",
      role: "user",
      department_id: departments[1].id,
      start_date: "2021-01-01",
    },
    {
      username: "bobwilson",
      email: "bob@example.com",
      password: bcrypt.hashSync("password123", 8),
      fullName: "Bob Wilson",
      sex: "0",
      dob: "1988-03-03",
      phoneNumber: "0123498765",
      address: "789 Road",
      position: "STAFF",
      position_1: "BA",
      position_level: "MIDDLE",
      role: "user",
      department_id: departments[2].id,
      start_date: "2022-01-01",
    },
  ]);

  // Update manager_id cho departments
  await departments[0].update({ manager_id: users[0].id });
  await departments[1].update({ manager_id: users[1].id });
  await departments[2].update({ manager_id: users[2].id });

  return users;
};
// Tạo user mẫu
const createTestUsers = async (departments) => {
  const users = await database.user.bulkCreate([
    {
      username: "johndoe",
      email: "john@example.com",
      password: bcrypt.hashSync("password123", 8),
      fullName: "John Doe",
      sex: "0", // Nam
      dob: "1990-01-01",
      phoneNumber: "0123456789",
      address: "123 Street",
      position: "MANAGER",
      position_1: "DEV",
      position_level: "SENIOR",
      role: "admin",
      department_id: departments[0].id,
      start_date: "2020-01-01",
    },
    {
      username: "janesmith",
      email: "jane@example.com",
      password: bcrypt.hashSync("password123", 8),
      fullName: "Jane Smith",
      sex: "1", // Nữ
      dob: "1992-02-02",
      phoneNumber: "0987654321",
      address: "456 Avenue",
      position: "STAFF",
      position_1: "TESTER",
      position_level: "JUNIOR",
      role: "user",
      department_id: departments[1].id,
      start_date: "2021-01-01",
    },
    {
      username: "bobwilson",
      email: "bob@example.com",
      password: bcrypt.hashSync("password123", 8),
      fullName: "Bob Wilson",
      sex: "0",
      dob: "1988-03-03",
      phoneNumber: "0123498765",
      address: "789 Road",
      position: "STAFF",
      position_1: "BA",
      position_level: "MIDDLE",
      role: "user",
      department_id: departments[2].id,
      start_date: "2022-01-01",
    },
  ]);

  // Update manager_id cho departments
  await departments[0].update({ manager_id: users[0].id });
  await departments[1].update({ manager_id: users[1].id });
  await departments[2].update({ manager_id: users[2].id });

  return users;
};

// Tạo project mẫu
const createTestProjects = async (users) => {
  const projects = await database.project.bulkCreate([
    {
      name: "Project Alpha",
      description: "Dự án quản lý nhân sự",
      start_date: "2024-01-01",
      end_date: "2024-06-30",
      status: 0,
      manager_id: users[0].id,
    },
    {
      name: "Project Beta",
      description: "Dự án thương mại điện tử",
      start_date: "2024-02-01",
      end_date: "2024-08-31",
      status: 1,
      manager_id: users[1].id,
    },
    {
      name: "Project Gamma",
      description: "Dự án thanh toán trực tuyến",
      start_date: "2024-03-01",
      end_date: "2024-09-30",
      status: 2,
      manager_id: users[2].id,
    },
  ]);
  return projects;
};

// Tạo project_user mẫu
const createTestProjectUsers = async (projects, users) => {
  await database.project_user.bulkCreate([
    {
      project_id: projects[0].id,
      user_id: users[0].id,
    },
    {
      project_id: projects[0].id,
      user_id: users[1].id,
    },
    {
      project_id: projects[1].id,
      user_id: users[1].id,
    },
    {
      project_id: projects[2].id,
      user_id: users[2].id,
    },
  ]);
};

// Tạo task mẫu
const createTestTasks = async (projects, users) => {
  const tasks = await database.task.bulkCreate([
    {
      project_id: projects[0].id,
      name: "Thiết kế database",
      description: "Thiết kế cấu trúc database cho dự án",
      label: "technical",
      status: "todo",
      priority: "high",
      start_date: "2024-01-05",
      end_date: "2024-01-15",
      assigned_by: users[1].id,
      created_by: users[0].id,
      story_point: 5,
      follower_ids: JSON.stringify([users[0].id, users[1].id]),
    },
    {
      project_id: projects[0].id,
      name: "Phát triển API",
      description: "Xây dựng REST API",
      label: "feature",
      status: "in_progress",
      priority: "medium",
      start_date: "2024-01-16",
      end_date: "2024-02-15",
      assigned_by: users[1].id,
      created_by: users[0].id,
      story_point: 8,
      follower_ids: JSON.stringify([users[1].id]),
    },
    {
      project_id: projects[1].id,
      name: "Testing UI",
      description: "Kiểm thử giao diện người dùng",
      label: "testing",
      status: "done",
      priority: "low",
      start_date: "2024-02-05",
      end_date: "2024-02-15",
      assigned_by: users[2].id,
      created_by: users[1].id,
      story_point: 3,
      follower_ids: JSON.stringify([users[2].id]),
    },
  ]);
  return tasks;
};

// Tạo notification mẫu
const createTestNotifications = async (users) => {
  await database.notification.bulkCreate([
    {
      user_id: users[0].id,
      title: "Task mới",
      message: "Bạn được giao một task mới",
      seen: false,
      metadata: JSON.stringify({
        taskId: 1,
        type: "new_task",
      }),
    },
    {
      user_id: users[1].id,
      title: "Deadline sắp đến",
      message: "Task của bạn sắp đến deadline",
      seen: true,
      metadata: JSON.stringify({
        taskId: 2,
        type: "deadline_reminder",
      }),
    },
    {
      user_id: users[2].id,
      title: "Task hoàn thành",
      message: "Task đã được hoàn thành",
      seen: false,
      metadata: JSON.stringify({
        taskId: 3,
        type: "task_completed",
      }),
    },
  ]);
};

const createTestData = async () => {
  const departments = await createTestDepartments();
  const users = await createTestUsers(departments);
  const projects = await createTestProjects(users);
  await createTestProjectUsers(projects, users);
  const tasks = await createTestTasks(projects, users);
  await createTestNotifications(users);
};

module.exports = {
  setupTestDatabase,
  clearTestDatabase,
  createTestData,
  database,
};
