import express from "express";
import { initializeMCPClient } from "../services/initializeMcpServer.js";
import { mcpClient } from "../services/initializeMcpServer.js"; // Import the MCP client
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: path.join(__dirname, "../.env") });
const router = express.Router();

initializeMCPClient().catch((error) => {
  console.error("Failed to initialize MCP client:", error);
});

console.log(process.env.GEMINI_API_KEY, "GEMINI_API_KEY");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//Helper function for MCP Client
async function createAppointment(appointmentData) {
  if (!mcpClient) {
    throw new Error("MCP client not initialized. Please check server logs.");
  }

  try {
    const result = await mcpClient.callTool({
      name: "createAppointment",
      arguments: appointmentData,
    });

    if (!result || !result.content || !result.content[0]) {
      throw new Error("Invalid response from MCP server");
    }

    return result.content[0].text; // Return as text, don't parse as JSON
  } catch (error) {
    console.error("Error calling MCP tool:", error);
    throw new Error(`Appointment creation failed: ${error.message}`);
  }
}

async function checkForAppointments(name) {
  if (!mcpClient) {
    throw new Error("MCP client not initialized. Please check server logs.");
  }
  try {
    const result = await mcpClient.callTool({
      name: "checkForAppointments",
      arguments: { name },
    });
    if (!result || !result.content || !result.content[0]) {
      throw new Error("Invalid response from MCP server");
    }
    return result.content[0].text; // Return as text, don't parse as JSON
  } catch (error) {
    console.error("Error calling MCP tool:", error);
    throw new Error(`Error checking appointments: ${error.message}`);
  }
}

// Helper function to get available MCP tools
async function getAvailableTools() {
  if (!mcpClient) {
    throw new Error("MCP client not initialized");
  }

  try {
    const tools = await mcpClient.listTools();
    return tools;
  } catch (error) {
    console.error("Error listing MCP tools:", error);
    throw error;
  }
}

const functionDeclarations = [
  {
    name: "getWeather",
    description:
      "Fetch current weather data for a given location using coordinates. Use this when users ask about weather, temperature, conditions, or related questions.",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description:
            "Location coordinates in lat,lon format (e.g., '40.7128,-74.0060'). Extract coordinates from user input or ask for them if not provided.",
        },
      },
      required: ["location"],
    },
  },
  {
    name: "listAvailableTools",
    description:
      "List all available MCP tools and their descriptions. Use this when users ask what tools you have or what you can do.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "createAppointment",
    description:
      "Create a new appointment with user details. Use this when users want to book an appointment.",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the person booking the appointment.",
        },
        email: {
          type: "string",
          description:
            "The email address of the person booking the appointment.",
        },
        phone: {
          type: "string",
          description:
            "The phone number of the person booking the appointment.",
        },
        date: {
          type: "string",
          description: "The date of the appointment (YYYY-MM-DD).",
        },
        time: {
          type: "string",
          description: "The time of the appointment (HH:mm).",
        },
      },
      required: ["name", "email", "phone", "date", "time"],
    },
  },
  {
    name: "checkForAppointments",
    description:
      "Check if there are any appointments for a given name. Use this when users want to check their existing appointments.",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the person to check appointments for.",
        },
      },
      required: ["name"],
    },
  },
];

router.get("/tools", async (req, res) => {
  try {
    const tools = await getAvailableTools();
    res.json(tools);
  } catch (error) {
    console.error("Error fetching tools:", error);
    res.status(500).json({ error: "Failed to fetch tools" });
  }
});

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    console.log("Received message:", message);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      tools: [{ functionDeclarations }],
    });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: "You are a helpful AI assistant with access to weather tools. When users ask about weather, temperature, conditions, or related questions, use the getWeather function with the appropriate coordinates. If users ask what tools you have or what you can do, use the listAvailableTools function. Always be helpful and use the tools when appropriate.",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "I understand! I'm an AI assistant with access to weather tools. I can help you get current weather information for any location using coordinates, and I can tell you what tools I have available. How can I help you today?",
            },
          ],
        },
      ],
    });

    let result = await chat.sendMessage(message);
    let response = result.response;

    const functionCalls = response.functionCalls();
    let toolResults = [];

    if (functionCalls && functionCalls.length > 0) {
      // Execute the function calls
      for (const call of functionCalls) {
        console.log(`Executing function: ${call.name} with args:`, call.args);

        try {
          let functionResult;

          if (call.name === "getWeather") {
            // const weatherData = await getWeatherData(call.args.location);
            console.log("Fetching weather data");
            functionResult = JSON.stringify(weatherData, null, 2);
          } else if (call.name === "listAvailableTools") {
            const tools = await getAvailableTools();
            functionResult = JSON.stringify(tools, null, 2);
          } else if (call.name === "createAppointment") {
            const getCreateAppointment = await createAppointment(call.args);
            functionResult = JSON.stringify(getCreateAppointment, null, 2);
          } else if (call.name === "checkForAppointments") {
            const getCheckForAppointments = await checkForAppointments(
              call.args.name
            );
            functionResult = JSON.stringify(getCheckForAppointments, null, 2);
          } else {
            functionResult = `Unknown function: ${call.name}`;
          }

          toolResults.push({
            functionResponse: {
              name: call.name,
              response: { result: functionResult },
            },
          });
        } catch (error) {
          console.error(`Error executing function ${call.name}:`, error);
          toolResults.push({
            functionResponse: {
              name: call.name,
              response: { error: error.message },
            },
          });
        }
      }

      // Send function results back to the model
      result = await chat.sendMessage(toolResults);
      response = result.response;
    }

    const text = response.text();

    res.json({
      response: text,
      functionsUsed: functionCalls
        ? functionCalls.map((call) => call.name)
        : [],
      toolResults: toolResults.length > 0,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
