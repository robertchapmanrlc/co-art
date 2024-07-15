import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
let broadcastInterval = 1000;

let users = [];
let rooms = {};

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  function startCanvasTimer(room) {
    if (rooms[room]) {
      if (rooms[room].clearCanvasTimeout) {
        clearTimeout(rooms[room].clearCanvasTimeout);
      }
      rooms[room].remainingTime = 30000;
      rooms[room].clearCanvasTimeout = setTimeout(() => {
        clearCanvas(room);
      }, rooms[room].remainingTime);
    }
  }

  function clearCanvas(room) {
    io.to(room).emit("clear");
    startCanvasTimer(room);
  }

  setInterval(() => {
    for (let room in rooms) {
      if (rooms[room].remainingTime >= 0) {
        rooms[room].remainingTime -= 1000;
        let remainingTime = rooms[room].remainingTime;
        io.to(room).emit("display-time", remainingTime / 1000);
        if (remainingTime < 20000) {
          io.to(room).emit('enable-draw');
        }
      }
    }
  }, broadcastInterval);

  io.on("connection", (socket) => {
    socket.on("draw-line", ({ currentPoint, previousPoint, color, room }) => {
      io.to(room).emit("draw-line", { currentPoint, previousPoint, color });
    });

    socket.on('create-room', (room) => {
      rooms[room] = {};
      rooms[room].creater = socket.id;
    });

    socket.on('check-creator', (room) => {
      let isCreator = rooms[room].creater === socket.id;
      socket.emit('is-creator', isCreator);
    });

    socket.on("enter-room", ({ name, room }) => {
      if (room === '' || !rooms[room]) {
        socket.emit('invalid-room');
        return;
      }
      const id = socket.id;
      if (!users.find((user) => user.id === id)) {
        users = [...users, { name, room, id }];
        socket.join(room);
        const usersInRoom = roomUsers(room);
        if (usersInRoom.length <= 1) {
          startCanvasTimer(room);
        }
        io.to(room).emit("users", usersInRoom);
      }
    });

    socket.on("client-ready", (room) => {
      io.to(room).emit("get-canvas-state");
    });

    socket.on("canvas-state", (state, room) => {
      io.to(room).emit("canvas-state-from-server", state);
    });

    socket.on("disconnect", () => {
      const removedUser = users.find((user) => user.id === socket.id);
      if (removedUser) {
        users = users.filter((user) => user.id !== socket.id);
        let room = removedUser.room;
        const usersInRoom = roomUsers(room);
        io.to(room).emit("users", usersInRoom);
        if (usersInRoom.length == 0) {
          delete rooms[room];
        }
      }
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

function roomUsers(room) {
  return users.filter((user) => user.room === room);
}
