const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const socketInstance = require("./app/services/socket-instance");

const allowedDomains = ["http://localhost:8787", "http://localhost:4200"];

var corsOptions = {
  origin: function (origin, callback) {
    if (allowedDomains.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

const db = require("./app/models");
db.sequelize.sync();

app.use(cors(corsOptions));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// socket server
const server = http.createServer(app);

// Khởi tạo Socket.IO
socketInstance.init(server);

// khởi tạo route
app.get("/", (req, res) => {
  res.json({
    message: "This is a Daily BE",
  });
});
require("./app/routes/auth-routes")(app);
require("./app/routes/user-routes")(app);
require("./app/routes/project-routes")(app);
require("./app/routes/task-routes")(app);
require("./app/routes/sub-task-routes")(app);
require("./app/routes/department-routes")(app);
require("./app/routes/notification-routes")(app);

// listen port
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log("Running on port ", PORT);
});
