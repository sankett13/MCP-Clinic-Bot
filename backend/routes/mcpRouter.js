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

async function updateAppointment(appointmentData) {
  if (!mcpClient) {
    throw new Error("MCP client not initialized. Please check server logs.");
  }
  try {
    const result = await mcpClient.callTool({
      name: "updateAppointment",
      arguments: appointmentData,
    });
    if (!result || !result.content || !result.content[0]) {
      throw new Error("Invalid response from MCP server");
    }
    return result.content[0].text; // Return as text, don't parse as JSON
  } catch (error) {
    console.error("Error calling MCP tool:", error);
    throw new Error(`Error updating appointment: ${error.message}`);
  }
}

async function deleteAppointment(appointmentData) {
  if (!mcpClient) {
    throw new Error("MCP client not initialized. Please check server logs.");
  }
  try {
    const result = await mcpClient.callTool({
      name: "deleteAppointment",
      arguments: appointmentData,
    });
    if (!result || !result.content || !result.content[0]) {
      throw new Error("Invalid response from MCP server");
    }
    return result.content[0].text; // Return as text, don't parse as JSON
  } catch (error) {
    console.error("Error calling MCP tool:", error);
    throw new Error(`Error deleting appointment: ${error.message}`);
  }
}

const functionDeclarations = [
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
  {
    name: "updateAppointment",
    description:
      "Update an existing appointment with new details. Use this when users want to modify their appointment.",
    parameters: {
      type: "object",
      properties: {
        email: {
          type: "string",
          description: "Email address to find the appointment.",
        },
        currentDate: {
          type: "string",
          description: "Current date of the appointment (YYYY-MM-DD).",
        },
        currentTime: {
          type: "string",
          description: "Current time of the appointment (HH:mm).",
        },
        name: {
          type: "string",
          description: "Updated name of the person.",
        },
        phone: {
          type: "string",
          description: "Updated phone number of the person.",
        },
        newDate: {
          type: "string",
          description: "New date of the appointment (YYYY-MM-DD).",
        },
        newTime: {
          type: "string",
          description: "New time of the appointment (HH:mm).",
        },
      },
      required: [
        "email",
        "currentDate",
        "currentTime",
        "name",
        "phone",
        "newDate",
        "newTime",
      ],
    },
  },
  {
    name: "deleteAppointment",
    description:
      "Delete an existing appointment. Use this when users want to cancel their appointment.",
    parameters: {
      type: "object",
      properties: {
        email: {
          type: "string",
          description: "Email address to find the appointment.",
        },
        date: {
          type: "string",
          description: "Date of the appointment to delete (YYYY-MM-DD).",
        },
        time: {
          type: "string",
          description: "Time of the appointment to delete (HH:mm).",
        },
      },
      required: ["email", "date", "time"],
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
              text: "You are a helpful AI assistant for a clinic manager. You can help users book, check, and update appointments using the available clinic tools. When users want to book an appointment, use the createAppointment function. If they want to check their appointments, use the checkForAppointments function. To update an appointment, use the updateAppointment function. If users ask what you can do, use the listAvailableTools function. Always be helpful and use the clinic tools when appropriate.",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "I understand! I'm an AI assistant for the clinic. I can help you book, check, or update appointments, and I can tell you what tools are available. How can I assist you today?",
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

          if (call.name === "createAppointment") {
            const createResult = await createAppointment(call.args);
            functionResult = JSON.stringify(createResult, null, 2);
          } else if (call.name === "updateAppointment") {
            const updateResult = await updateAppointment(call.args);
            functionResult = JSON.stringify(updateResult, null, 2);
          } else if (call.name === "checkForAppointments") {
            const checkResult = await checkForAppointments(call.args.name);
            functionResult = JSON.stringify(checkResult, null, 2);
          } else if (call.name === "deleteAppointment") {
            const deleteResult = await deleteAppointment(call.args);
            functionResult = JSON.stringify(deleteResult, null, 2);
          } else if (call.name === "listAvailableTools") {
            const tools = await getAvailableTools();
            functionResult = JSON.stringify(tools, null, 2);
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
