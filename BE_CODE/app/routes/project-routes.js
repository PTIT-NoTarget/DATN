const { verifyUser } = require("../middleware");
const projectServices = require("../services/project-services");
const { jwtAuth } = require("../middleware");

module.exports = function (app) {
  const apiUrl = "/api/project";
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  //Add a project
  app.post(apiUrl + "/add", projectServices.addAProject);

  //get all project
  app.post(apiUrl + "/getAll", projectServices.getAllProjects);

  //get project by id
  app.get(apiUrl + "/findById/:id", projectServices.getProjectById);

  //update project
  app.put(apiUrl + "/update", projectServices.updateProject);

  //delete project
  app.delete(apiUrl + "/delete", projectServices.deleteProject);

  //add users to Project
  app.post(apiUrl + "/addUsers", projectServices.addUsersToProject);
  // {
  //   "departmentId": 2,
  //   "userIds": [1]
  // }

  //remove user From project
  app.delete(apiUrl + "/deleteUser", projectServices.removeUserFromProject);
};
