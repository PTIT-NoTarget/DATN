const { verifyUser } = require("../middleware");
const departmentServices = require("../services/department-services.js");
const { jwtAuth } = require("../middleware");

module.exports = function (app) {
  const apiUrl = "/api/department";
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  //Add a department
  app.post(apiUrl + "/add", departmentServices.addADepartment);
  //   {
  //     "name": "Phòng QA",
  //     "description": "Phòng QA des",
  //     "manager_id": 1
  //   }

  //get all department
  app.post(apiUrl + "/getAll", departmentServices.getAllDepartments);
  //   {
  //     "page": 1,
  //     "pageSize": 10,
  //     "name": null,
  //     "description": null,
  //     "manager_id": null,
  //     "createdAt": null
  //   }

  //get department by id
  app.get(apiUrl + "/findById/:id", departmentServices.getDepartmentById);
  // http://localhost:8080/api/department/findById/1

  //update department
  app.put(apiUrl + "/update", departmentServices.updateDepartment);
  //   {
  //     "id": 2,
  //     "name": "Phòng SX fix",
  //     "description": "Phòng SX des fix",
  //     "manager_id": 1
  //   }

  //delete department
  app.delete(apiUrl + "/delete", departmentServices.deleteDepartment);
  //   {
  //     "id": 1
  //   }

  //add user to department
  app.post(apiUrl + "/addUsers", departmentServices.addUsersToDepartment);

  //remove user From department
  app.delete(apiUrl + "/deleteUser", departmentServices.removeUserFromDepartment);
};
