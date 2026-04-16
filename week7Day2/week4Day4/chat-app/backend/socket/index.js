const { Server } = require("socket.io");
const { allowedOrigin } = require("../config/cors");
const { registerHandlers } = require("./handlers");

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: allowedOrigin, methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => registerHandlers(io, socket));

  return io;
}

module.exports = { initSocket };
