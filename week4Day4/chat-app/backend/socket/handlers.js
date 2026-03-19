const onlineUsers = {}; // { socketId: { username, roomId } }

function getRoomCount(io, roomId) {
  return Object.values(onlineUsers).filter((u) => u.roomId === roomId).length;
}

function registerHandlers(io, socket) {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("join_room", ({ roomId, username }) => {
    socket.join(roomId);
    onlineUsers[socket.id] = { username, roomId };

    socket.to(roomId).emit("user_joined", { username, roomId });
    io.to(roomId).emit("room_user_count", { roomId, count: getRoomCount(io, roomId) });

    console.log(`${username} joined #${roomId}`);
  });

  socket.on("leave_room", ({ roomId, username }) => {
    socket.leave(roomId);
    delete onlineUsers[socket.id];

    socket.to(roomId).emit("user_left", { username, roomId });
    io.to(roomId).emit("room_user_count", { roomId, count: getRoomCount(io, roomId) });

    console.log(`${username} left #${roomId}`);
  });

  socket.on("typing", ({ roomId, username }) => {
    socket.to(roomId).emit("user_typing", { username });
  });

  socket.on("stop_typing", ({ roomId, username }) => {
    socket.to(roomId).emit("user_stop_typing", { username });
  });

  socket.on("disconnect", () => {
    const user = onlineUsers[socket.id];
    if (user) {
      const { username, roomId } = user;
      socket.to(roomId).emit("user_left", { username, roomId });
      delete onlineUsers[socket.id];
      io.to(roomId).emit("room_user_count", { roomId, count: getRoomCount(io, roomId) });
    }
    console.log(`Socket disconnected: ${socket.id}`);
  });
}

module.exports = { registerHandlers };
