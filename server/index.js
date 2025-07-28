import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/connectDatabase.js";
import authRoutes from "./routes/auth-routes.js";
import userRoutes from "./routes/user-routes.js";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ quiet: true });
const PORT = process.env.PORT;

const corsOptions = {
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/v1", authRoutes);
app.use("/api/v1/users", userRoutes);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const usersMap = new Map();

io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  socket.on("register-user", (phoneNumber) => {
    usersMap.set(phoneNumber, socket.id);
    console.log(`📱 Registered ${phoneNumber} with socket ID: ${socket.id}`);
  });

  socket.on("private-message", ({ toPhoneNumber, message }) => {
    const targetSocketId = usersMap.get(toPhoneNumber);
    if (targetSocketId) {
      io.to(targetSocketId).emit("private-message", {
        message,
        sender: socket.id,
      });
    } else {
      socket.emit("private-message-failed", {
        error: "User not connected",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    for (const [phone, id] of usersMap.entries()) {
      if (id === socket.id) {
        usersMap.delete(phone);
        break;
      }
    }
  });
});

server.listen(PORT, () => {
  connectDB();
  console.log(`SERVER IS RUNNING AT PORT ${PORT}`);
});
