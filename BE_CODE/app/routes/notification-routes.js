const { verifyUser } = require("../middleware");
const notificationServices = require("../services/notification-services.js");
const { jwtAuth } = require("../middleware");

module.exports = function (app) {
  const apiUrl = "/api/notification";
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  //Add a notification
  app.post(apiUrl + "/add", notificationServices.addANotification);

  //get all notification
  app.post(apiUrl + "/getAll", notificationServices.getAllNotifications);

  //get notification by id
  app.get(apiUrl + "/findById/:id", notificationServices.getANotificationById);

  //update notification
  app.put(apiUrl + "/update", notificationServices.updateANotification);

  //delete notification
  app.delete(apiUrl + "/delete", notificationServices.deleteANotification);
};
