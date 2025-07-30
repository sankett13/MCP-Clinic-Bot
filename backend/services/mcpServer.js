import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import Appointment from "../models/appointment.js"; // Assuming you have an Appointment model defined
import mongoose from "mongoose"; // Import mongoose for MongoDB connection

// const NWS_API_BASE = "https://api.weather.gov";
// const USER_AGENT = "weather-app/1.0";

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

// connectDB();

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

// server.tool(
//   "getWeather",
//   "Fetch current weather data for a given location",
//   {
//     location: z
//       .string()
//       .describe(
//         "The location for which to fetch weather data (lat,lon format)"
//       ),
//   },
//   async (input) => {
//     try {
//       const response = await fetch(`${NWS_API_BASE}/points/${input.location}`, {
//         headers: {
//           "User-Agent": USER_AGENT,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch weather data: ${response.statusText}`);
//       }

//       const pointsData = await response.json();

//       // Get the forecast URL from the points data
//       const forecastUrl = pointsData.properties?.forecast;
//       if (!forecastUrl) {
//         throw new Error("No forecast URL found for this location");
//       }

//       // Fetch the actual forecast
//       const forecastResponse = await fetch(forecastUrl, {
//         headers: {
//           "User-Agent": USER_AGENT,
//         },
//       });

//       if (!forecastResponse.ok) {
//         throw new Error(
//           `Failed to fetch forecast: ${forecastResponse.statusText}`
//         );
//       }

//       const forecastData = await forecastResponse.json();
//       const currentPeriod = forecastData.properties?.periods?.[0];

//       return {
//         content: [
//           {
//             type: "text",
//             text: JSON.stringify(
//               {
//                 location: input.location,
//                 name: currentPeriod?.name || "Current",
//                 temperature: currentPeriod?.temperature
//                   ? `${currentPeriod.temperature}°${currentPeriod.temperatureUnit}`
//                   : "N/A",
//                 conditions: currentPeriod?.shortForecast || "N/A",
//                 detailedForecast: currentPeriod?.detailedForecast || "N/A",
//                 windSpeed: currentPeriod?.windSpeed || "N/A",
//                 windDirection: currentPeriod?.windDirection || "N/A",
//               },
//               null,
//               2
//             ),
//           },
//         ],
//       };
//     } catch (error) {
//       return {
//         content: [
//           {
//             type: "text",
//             text: JSON.stringify(
//               {
//                 error: error.message,
//                 location: input.location,
//               },
//               null,
//               2
//             ),
//           },
//         ],
//       };
//     }
//   }
// );

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

async function main() {
  await connectDB();
  console.log("Connected to MongoDB");
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("Clinic Manager MCP server is running...");
}

main().catch((error) => {
  console.error("Error starting server:", error);
  process.exit(1);
});
