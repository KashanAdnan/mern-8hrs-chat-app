const { Server } = require("socket.io");
const io = new Server({ cors: "http://localhost:3000/" });

let onlineUser = [];

io.on("connection", (socket) => {
  socket.on("addNewUser", (userId) => {
    !onlineUser.some((user) => user.userId === userId) &&
      onlineUser.push({
        userId,
        socketId: socket.id,
      });

    io.emit("getOnlineUsers", onlineUser);
  });
  socket.on("sendMessage", (data) => {
    const user = onlineUser.find((user) => user.userId === data.recipientId);
    if (user) {
      io.to(user.socketId).emit("getMessage", data);
      io.to(user.socketId).emit("getNotification", {
        senderId: data.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });
  socket.on("disconnect", () => {
    onlineUser = onlineUser.filter((user) => user.socketId !== socket.id);

    io.emit("getOnlineUsers", onlineUser);
  });
});

io.listen(3001 , () =>{
  console.log(`Socket server listening on Port ${3001}`);
});
