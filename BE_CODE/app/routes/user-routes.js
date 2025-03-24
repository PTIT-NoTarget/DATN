const { verifyUser } = require("../middleware");
const userServices = require("../services/user-services.js");
const { jwtAuth } = require("../middleware");

module.exports = function (app) {
  const apiUrl = "/api/user";
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  //get all user
  app.post(apiUrl + "/getAll", userServices.getAllUsers);

  //get user by id
  app.get(apiUrl + "/findById/:id", userServices.getUserById);

  //update user
  app.put(apiUrl + "/update", userServices.updateUser);

  //delete user
  app.delete(apiUrl + "/delete", userServices.deleteUser);
};