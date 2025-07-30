import { join } from "path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

let mcpClient = null;
const __dirname = import.meta.dirname || process.cwd();

async function initializeMCPClient() {
  try {
    // Get the absolute path to mcpServer.js
    const serverPath = join(__dirname, "mcpServer.js");

    console.log(`Starting MCP server at: ${serverPath}`);

    // Create transport that will spawn the server process
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [serverPath],
      cwd: __dirname,
    });

    mcpClient = new Client(
      {
        name: "Clinic Manager MCP Client",
        version: "1.0.0",
      },
      {
        capabilities: {},
      }
    );

    await mcpClient.connect(transport);
    console.log("MCP client connected successfully");
  } catch (error) {
    console.error("Failed to initialize MCP client:", error);
    mcpClient = null;
  }
}

// Export the client for use in other modules
export { mcpClient, initializeMCPClient };
