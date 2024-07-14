import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
let clearCanvasTimeout;
let remainingTime = 30000;
let broadcastInterval = 1000;

let users = [];

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  function startCanvasTimer() {
    if (clearCanvasTimeout) {
      clearTimeout(clearCanvasTimeout);
    }

    remainingTime = 30000;
    clearCanvasTimeout = setTimeout(clearCanvas, remainingTime);
  }

  function clearCanvas() {
    io.sockets.emit('clear');
    startCanvasTimer();
  }

  setInterval(() => {
    if (remainingTime > 0) {
      remainingTime -= broadcastInterval;
      io.sockets.emit('display-time', remainingTime/1000);
    }
  }, broadcastInterval);

  startCanvasTimer();

  io.on('connection', (socket) => {
    socket.on('draw-line', ({ currentPoint, previousPoint, color }) => {
      socket.broadcast.emit('draw-line', { currentPoint, previousPoint, color });
    });

    socket.on('enter-room', ({name, room}) => {
      users = [...users, { name, room }];
      socket.join(room);
      const usersInRoom = roomUsers(room);
      io.to(room).emit('users', usersInRoom );
    });

    socket.on('client-ready', () => {
      socket.broadcast.emit('get-canvas-state');
    });

    socket.on('canvas-state', (state) => {
      socket.broadcast.emit('canvas-state-from-server', state);
    });
  })

  httpServer.once('error', (err) => {
    console.error(err);
    process.exit(1);
  }).listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
  })
});

function roomUsers(room) {
  return users.filter((user) => user.room === room);
}
