const { Server } = require("socket.io");

let io;

module.exports = {
  init: (server) => {
    io = new Server(server, {
      cors: {
        origin: ["http://localhost:53822", "http://localhost:4200"],
        methods: ["GET", "POST"],
      },
    });
    console.log("Socket.io initialized!")
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
