const { verifyUser } = require("../middleware");
const taskServices = require("../services/task-services");
const { jwtAuth } = require("../middleware");

module.exports = function (app) {
  const apiUrl = "/api/task";
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  //Add a task
  app.post(apiUrl + "/add", taskServices.addATask);

  //get all task
  app.post(apiUrl + "/getAll", taskServices.getAllTasks);

  //get task by id
  app.get(apiUrl + "/findById/:id", taskServices.getATaskById);

  //update project
  app.put(apiUrl + "/update", taskServices.updateATask);

  //delete task
  app.delete(apiUrl + "/delete", taskServices.deleteATask);
};
