import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// import connectToDatabase from "./connection.js";
dotenv.config();
import McpRouter from "./routes/mcpRouter.js";

const app = express();
const PORT = process.env.PORT;
// console.log(process.env.GEMINI_API_KEY, "GEMINI_API_KEY");

// connnect to the database
// connectToDatabase();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/mcp", McpRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
