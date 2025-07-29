import express from "express";
import dotenv from "dotenv";
import connectToDatabase from "./connection.js";
dotenv.config();
import McpRouter from "./routes/mcpRouter.js";

const app = express();
const PORT = process.env.PORT;

// connnect to the database
connectToDatabase();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/mcp", McpRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
