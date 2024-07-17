import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
let broadcastInterval = 1000;

let rooms = {};

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  function startCanvasTimer(room) {
    if (rooms[room]) {
      if (rooms[room].clearCanvasTimeout) {
        clearTimeout(rooms[room].clearCanvasTimeout);
      }
      if (rooms[room].started == true) {
        rooms[room].remainingTime = 31000;
      } else if (rooms[room].previewing == true) {
        rooms[room].remainingTime = 10000;
      }
      rooms[room].clearCanvasTimeout = setTimeout(() => {
        clearCanvas(room);
      }, rooms[room].remainingTime);
    }
  }

  function clearCanvas(room) {
    io.to(room).emit("clear");
    if (rooms[room].previewing == true) {
      io.to(room).emit("preview-drawing", rooms[room].drawing);
      rooms[room].drawing = (rooms[room].drawing + 1) % 4;
    }
    startCanvasTimer(room);
  }

  setInterval(() => {
    for (let room in rooms) {
      if (
        rooms[room].remainingTime > 0 &&
        (rooms[room].previewing == true || rooms[room].started == true)
      ) {
        rooms[room].remainingTime -= 1000;
        let remainingTime = rooms[room].remainingTime;
        io.to(room).emit("display-time", remainingTime / 1000);
      }
      if (rooms[room].remainingTime % 3000 == 0 && rooms[room].started) {
        let player = rooms[room].playerDrawing;
        let currentSocket = rooms[room].users[player].id;
        let nextSocket =
          rooms[room].users[(player + 1) % rooms[room].users.length].id;
        rooms[room].playerDrawing =
          (rooms[room].playerDrawing + 1) % rooms[room].users.length;
        io.to(currentSocket).emit("disable-draw");
        io.to(nextSocket).emit("enable-draw");
      }
      if (rooms[room].remainingTime == 0 && rooms[room].previewing == true) {
        rooms[room].previewing = false;
        rooms[room].started = true;
      } else if (
        rooms[room].remainingTime == 0 &&
        rooms[room].started == true
      ) {
        rooms[room].previewing = true;
        rooms[room].started = false;
        io.to(room).emit("disable-draw");
      }
    }
  }, broadcastInterval);

  io.on("connection", (socket) => {
    socket.on("draw-line", ({ currentPoint, previousPoint, color, room }) => {
      io.to(room).emit("draw-line", { currentPoint, previousPoint, color });
    });

    socket.on("create-room", (room) => {
      rooms[room] = {};
      rooms[room].creater = socket.id;
      rooms[room].users = [];
      rooms[room].started = false;
      rooms[room].previewing = false;
      rooms[room].drawing = 0;
      rooms[room].playerDrawing = 0;
    });

    socket.on("check-creator", (room) => {
      let isCreator = rooms[room].creater === socket.id;
      socket.emit("is-creator", isCreator);
    });

    socket.on("introduce-drawing", (room) => {
      rooms[room].previewing = true;
      io.to(room).emit("preview-drawing", rooms[room].drawing);
      startCanvasTimer(room);
      rooms[room].drawing = (rooms[room].drawing + 1) % 4;
    });

    socket.on("enter-room", ({ name, room }) => {
      if (room === "" || !rooms[room]) {
        socket.emit("invalid-room");
        return;
      }
      const id = socket.id;
      if (!rooms[room].users.find((user) => user.id === id)) {
        let users = rooms[room].users;
        rooms[room].users = [...users, { name, room, id }];
        socket.join(room);
        io.to(room).emit("users", rooms[room].users);
      }
    });

    socket.on("client-ready", (room) => {
      io.to(room).emit("get-canvas-state");
    });

    socket.on("canvas-state", (state, room) => {
      io.to(room).emit("canvas-state-from-server", state);
    });

    socket.on("disconnect", () => {
      let roomsArr = Object.entries(rooms);
      let room = roomsArr.find((room) =>
        room[1].users.some((user) => user.id === socket.id)
      );
      if (room) {
        let roomUsers = room[1].users;
        const removedUser = roomUsers.find((user) => user.id === socket.id);
        if (removedUser) {
          let usersLeft = roomUsers.filter((user) => user.id !== socket.id);
          rooms[removedUser.room].users = usersLeft;
          io.to(removedUser.room).emit("users", usersLeft);
          let player = rooms[removedUser.room].playerDrawing;
          let nextSocket =
            rooms[removedUser.room].users[
              (player + 1) % rooms[removedUser.room].users.length
            ].id;
          rooms[removedUser.room].playerDrawing =
            (rooms[removedUser.room].playerDrawing + 1) %
            rooms[removedUser.room].users.length;
          if (rooms[removedUser.room].started == true) {
            io.to(nextSocket).emit("enable-draw");
          }
          if (
            (usersLeft.length < 2 &&
              (rooms[removedUser.room].previewing ||
                rooms[removedUser.room].started)) ||
            socket.id === rooms[removedUser.room].creater
          ) {
            io.to(room).emit("game-ended");
            clearTimeout(rooms[removedUser.room].clearCanvasTimeout);
            delete rooms[removedUser.room];
          }
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
