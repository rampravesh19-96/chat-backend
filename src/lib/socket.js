import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors"; // ✅ IMPORT CORS

const app = express();

app.use(
  cors({
    origin: ["https://chat-frontend-phi-steel.vercel.app", "http://localhost:5173"],
    credentials: true, // ✅ include credentials if needed (cookies, auth)
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["https://chat-frontend-phi-steel.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = {}; // {userId: socketId}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
