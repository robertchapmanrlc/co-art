import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on('connection', (socket) => {
    socket.on('draw-line', ({ currentPoint, previousPoint, color }) => {
      socket.broadcast.emit('draw-line', { currentPoint, previousPoint, color });
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
