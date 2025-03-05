const { verifyUser } = require("../middleware");
const SubtaskServices = require("../services/sub-task-services");
const { jwtAuth } = require("../middleware");

module.exports = function (app) {
  const apiUrl = "/api/subtask";
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  //Add a Subtask
  app.post(apiUrl + "/add", SubtaskServices.addASubTask);

  //get all Subtask
  app.post(apiUrl + "/getAll", SubtaskServices.getAllSubTasks);

  //get Subtask by id
  app.get(apiUrl + "/findById/:id", SubtaskServices.getASubTaskById);

  //update project
  app.put(apiUrl + "/update", SubtaskServices.updateASubTask);

  //delete Subtask
  app.delete(apiUrl + "/delete", SubtaskServices.deleteASubTask);
};
