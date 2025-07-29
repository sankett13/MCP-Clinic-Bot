import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import Appointment from "./appointment.js";
import connectToDatabase from "./database.js";

// const NWS_API_BASE = "https://api.weather.gov";
// const USER_AGENT = "weather-app/1.0";

// Connect to MongoDB
connectToDatabase().catch((error) => {
  console.error("Failed to connect to MongoDB:", error);
  process.exit(1);
});

const server = new McpServer({
  name: "WeatherApp",
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
        name: input.name,
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
      const appointments = await Appointment.find({ name: input.name });
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

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("WeatherApp server is running...");
}

main().catch((error) => {
  console.error("Error starting server:", error);
  process.exit(1);
});
