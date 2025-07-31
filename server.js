const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/auth");
const gigRoutes = require("./routes/gigRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

dotenv.config();
connectDB();

const app = express();

// ✅ Set allowed origin (your frontend domain)
const allowedOrigin = "https://freelancer-mu-liard.vercel.app";

// ✅ CORS Middleware
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

// ✅ Express JSON Parser
app.use(express.json());

// ✅ Static file serving (e.g., uploaded images)
app.use("/uploads", express.static("uploads"));

// ✅ API Routes
app.use("/api/jobs", jobRoutes);
app.use("/api", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payments", paymentRoutes);

// ✅ Create HTTP server for Socket.IO
const server = http.createServer(app);

// ✅ Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// ✅ Socket.IO Events
io.on("connection", (socket) => {
  console.log("🟢 User connected");

  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    io.emit("receiveMessage", { senderId, receiverId, message });
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected");
  });
});

// ✅ Make Socket.IO accessible elsewhere (optional)
app.set("io", io);

// ✅ Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
