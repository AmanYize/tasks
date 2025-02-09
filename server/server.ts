// server.ts
import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import todoRoutes from "./routes/todoRoutes";
import authRoutes from "./routes/authRoutes";

// Load environment variables
dotenv.config();

// Create an Express app
const app: Express = express();
const PORT: number = parseInt(process.env.PORT || "8000", 10);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => {
    console.log("MongoDB connection successful");
    // Start the server after successful database connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Routes
app.use("/api/todos", todoRoutes);
app.use("/api/auth", authRoutes);

// Default route for testing
app.get("/", (req, res) => {
  res.send("Welcome to the MERN Todo App API");
});
