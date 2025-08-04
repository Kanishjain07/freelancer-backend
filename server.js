const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/auth");
const gigRoutes = require("./routes/gigRoutes");
const dashboardRoutes = require('./routes/dashboardRoutes');
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // allow all origins for dev
});

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/admin", adminRoutes);
// ✅ Routes
app.use("/api/jobs", jobRoutes);
app.use("/api", authRoutes);
app.use("/api/gigs", require("./routes/gigRoutes"));
app.use("/api/payments", paymentRoutes);
// ✅ WebSocket setup
io.on("connection", (socket) => {
  console.log("🟢 User connected");

  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    // You can later broadcast only to receiver using their socketId
    io.emit("receiveMessage", { senderId, receiverId, message });
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected");
  });
});

// ✅ Make Socket.IO accessible elsewhere if needed
app.set("io", io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
