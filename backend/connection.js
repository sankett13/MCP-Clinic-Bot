import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function connectToDatabase() {
  try {
    await mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error);
      });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

export default connectToDatabase;
