const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");            // <-- 1. Import native HTTP module
const { Server } = require("socket.io"); // <-- 2. Import Socket.io Server
require("dotenv").config();
// Import the Message model to save chats to your DB
const Message = require("./models/Message"); // <-- Adjust path based on your folders

const app = express();

// Create HTTP server wrapping the Express app instance
const server = http.createServer(app);  // <-- 3. Wrap express app

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const mongoose = require('mongoose');

// all routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

// <-- 4. Initialize Socket.io Server instance
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  }
});

// <-- 5. Listen to WebSockets connection events
io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  // Handle joining a specific room
  socket.on("joinChat", ({ chatId }) => {
    socket.join(chatId);
    console.log(`User joined room: ${chatId}`);
  });

  // Handle incoming messages
   // Handle incoming messages
  socket.on("sendMessage", async ({ chatId, senderId, text }) => {
    // Add this line to log the event:
    console.log("--- Received sendMessage event ---", { chatId, senderId, text });

    try {
      // Save the message in MongoDB
      const newMessage = new Message({
        conversationId: chatId,
        senderId,
        text
      });
      await newMessage.save();

      // Broadcast the message back to all users in the specific room
      io.to(chatId).emit("receiveMessage", newMessage);
      console.log("--- Message saved and broadcasted ---");
    } catch (err) {
      console.error("Error saving/broadcasting message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected: " + socket.id);
  });
});

const PORT = process.env.PORT;
const mongoURI = process.env.mongoURI;
// <-- 6. Connect to MongoDB Atlas
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB!');
    // IMPORTANT: Start listening using server.listen, NOT app.listen
    server.listen(3000, () => {
      console.log("server is running on port 3000");
    });
  })
  .catch(err => console.error('Connection error:', err));