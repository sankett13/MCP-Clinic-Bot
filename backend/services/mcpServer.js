import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import Appointment from "../models/appointment.js";
import mongoose from "mongoose";
import { initializeChromaDB } from "./initializeChromaDB.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

let collection;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log("MongoDB URI:", mongoUri ? "Found" : "Not found");
    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const server = new McpServer({
  name: "Clinic Manager MCP",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Add some sample resources for demo
server.resource(
  "weather://docs",
  "Weather API Documentation",
  "Documentation for the weather service"
);
server.resource(
  "weather://status",
  "Service Status",
  "Current status of the weather service"
);

server.tool(
  "createAppointment",
  "Create a new appointment",
  {
    name: z.string().describe("Name of the person making the appointment"),
    email: z.string().email().describe("Email address of the person"),
    phone: z.string().describe("Phone number of the person"),
    date: z.string().describe("Date of the appointment (YYYY-MM-DD)"),
    time: z.string().describe("Time of the appointment (HH:mm)"),
  },
  async (input) => {
    try {
      const existingAppointment = await Appointment.findOne({
        date: new Date(input.date),
        time: input.time,
      });
      if (existingAppointment) {
        return {
          content: [
            {
              type: "text",
              text: `An appointment already exists for ${input.date} at ${input.time}. Please choose a different time or date.`,
            },
          ],
        };
      }
      const appointment = new Appointment({
        name: input.name.toLowerCase(),
        email: input.email,
        phone: input.phone,
        date: new Date(input.date),
        time: input.time,
      });

      await appointment.save();

      return {
        content: [
          {
            type: "text",
            text: `Appointment created successfully for ${input.name} on ${input.date} at ${input.time}.`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error creating appointment: ${error.message}`,
          },
        ],
      };
    }
  }
);

server.tool(
  "checkForAppointments",
  "Check for existing appointments",
  {
    name: z.string().describe("Name of the person to check appointments for"),
  },
  async (input) => {
    try {
      const appointments = await Appointment.find({
        name: input.name.toLowerCase(),
      });
      if (appointments.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No appointments found for ${input.name}.`,
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(appointments, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error fetching appointments: ${error.message}`,
          },
        ],
      };
    }
  }
);

server.tool(
  "updateAppointment",
  "Update an existing appointment",
  {
    email: z.string().email().describe("Email address to find the appointment"),
    currentDate: z
      .string()
      .describe("Current date of the appointment (YYYY-MM-DD)"),
    currentTime: z.string().describe("Current time of the appointment (HH:mm)"),
    name: z.string().describe("Updated name of the person"),
    phone: z.string().describe("Updated phone number of the person"),
    newDate: z.string().describe("New date of the appointment (YYYY-MM-DD)"),
    newTime: z.string().describe("New time of the appointment (HH:mm)"),
  },
  async (input) => {
    try {
      // Find the appointment by email, current date, and current time
      const existingAppointment = await Appointment.findOne({
        email: input.email,
        date: new Date(input.currentDate),
        time: input.currentTime,
      });

      if (!existingAppointment) {
        return {
          content: [
            {
              type: "text",
              text: `No appointment found for email ${input.email} on ${input.currentDate} at ${input.currentTime}. Please check the details and try again.`,
            },
          ],
        };
      }

      // Check if the new time slot is available (if different from current)
      if (
        input.newDate !== input.currentDate ||
        input.newTime !== input.currentTime
      ) {
        const conflictingAppointment = await Appointment.findOne({
          date: new Date(input.newDate),
          time: input.newTime,
          _id: { $ne: existingAppointment._id }, // Exclude the current appointment
        });

        if (conflictingAppointment) {
          return {
            content: [
              {
                type: "text",
                text: `An appointment already exists for ${input.newDate} at ${input.newTime}. Please choose a different time or date.`,
              },
            ],
          };
        }
      }

      // Update the appointment
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        existingAppointment._id,
        {
          name: input.name.toLowerCase(),
          phone: input.phone,
          date: new Date(input.newDate),
          time: input.newTime,
        },
        { new: true, runValidators: true }
      );

      return {
        content: [
          {
            type: "text",
            text: `Appointment updated successfully for ${input.name}. Changed from ${input.currentDate} at ${input.currentTime} to ${input.newDate} at ${input.newTime}.`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error updating appointment: ${error.message}`,
          },
        ],
      };
    }
  }
);

server.tool(
  "deleteAppointment",
  {
    email: z.string().email().describe("Email address to find the appointment"),
    date: z.string().describe("Date of the appointment (YYYY-MM-DD)"),
    time: z.string().describe("Time of the appointment (HH:mm)"),
  },
  async (input) => {
    try {
      const deletedAppointment = await Appointment.findOneAndDelete({
        email: input.email,
        date: new Date(input.date),
        time: input.time,
      });

      if (!deletedAppointment) {
        return {
          content: [
            {
              type: "text",
              text: `No appointment found for email ${input.email} on ${input.date} at ${input.time}.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Appointment deleted successfully for ${input.email} on ${input.date} at ${input.time}.`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error deleting appointment: ${error.message}`,
          },
        ],
      };
    }
  }
);

server.tool(
  "ClinicInfo",
  "Get clinic information",
  {
    queryText: z
      .string()
      .describe("Query text to get information about the clinic"),
  },
  async (input) => {
    try {
      console.log("Received query:", input.queryText);

      if (!collection) {
        return {
          content: [
            {
              type: "text",
              text: "ChromaDB collection is not initialized yet. Please try again.",
            },
          ],
        };
      }

      const result = await collection.query({
        queryTexts: [input.queryText],
        nResults: 2,
      });

      return {
        content: [
          {
            type: "text",
            text: result.documents.join("\n\n"),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error querying clinic information: ${error.message}`,
          },
        ],
      };
    }
  }
);

async function main() {
  await connectDB();
  console.log("Connected to MongoDB");

  // Initialize ChromaDB collection
  collection = await initializeChromaDB();
  console.log("ChromaDB collection initialized");

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("Clinic Manager MCP server is running...");
}

main().catch((error) => {
  console.error("Error starting server:", error);
  process.exit(1);
});
