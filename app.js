const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const getMessage = require("./utils/messages").getMessage;
const locationGenerator=require("./utils/messages").locationGenerator;

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/chat", (req, res) => {
  res.render("chat");
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });
    if (error) {
      return callback(error);
    }
    console.log(socket.connected);
    socket.join(user.room);

    socket.emit("message", getMessage("Admin", `Welcome to the chat room ${user.room}`));

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        getMessage("Admin", `${user.username} has joined the room`)
      );

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  //receive message
  socket.on("send-message", (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", getMessage(user.username, message));
    callback("Delivered");
  });

  //listen on typing
  // socket.on('typing', data => {
  //     socket.broadcast.emit('typing', data)
  // })
  socket.on('sendLocationInfos',(coords) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("locationMessage", locationGenerator(user.username,coords))
  })

  //on disconnect
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      socket
        .to(user.room)
        .emit(
          "notification",
          getMessage("Admin", `${user.username} has left the room!`)
        );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
      io.to(user.room).emit(
        "message",
        getMessage("Admin", `${user.username} has left the room!`)
      );
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));