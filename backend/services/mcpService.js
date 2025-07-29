import { spawn } from "child_process";
import { EventEmitter } from "events";

class MCPService extends EventEmitter {
  constructor() {
    super();
    this.mcpProcess = null;
    this.requestId = 0;
    this.pendingRequests = new Map();
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) {
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        // Start the MCP server process
        this.mcpProcess = spawn("node", ["mcpServer.js"], {
          cwd: process.cwd(),
          stdio: ["pipe", "pipe", "pipe"],
        });

        this.mcpProcess.stdout.on("data", (data) => {
          this.handleResponse(data);
        });

        this.mcpProcess.stderr.on("data", (data) => {
          console.error("MCP Server Error:", data.toString());
        });

        this.mcpProcess.on("error", (error) => {
          console.error("Failed to start MCP server:", error);
          this.isConnected = false;
          reject(error);
        });

        this.mcpProcess.on("exit", (code) => {
          console.log(`MCP server exited with code ${code}`);
          this.isConnected = false;
        });

        // Initialize the connection
        this.sendRequest({
          jsonrpc: "2.0",
          id: this.getNextRequestId(),
          method: "initialize",
          params: {
            protocolVersion: "2024-11-05",
            capabilities: {
              tools: {},
            },
            clientInfo: {
              name: "joke-client",
              version: "1.0.0",
            },
          },
        })
          .then(() => {
            this.isConnected = true;
            resolve();
          })
          .catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  handleResponse(data) {
    const lines = data
      .toString()
      .split("\n")
      .filter((line) => line.trim());

    for (const line of lines) {
      try {
        const response = JSON.parse(line);

        if (response.id && this.pendingRequests.has(response.id)) {
          const { resolve, reject } = this.pendingRequests.get(response.id);
          this.pendingRequests.delete(response.id);

          if (response.error) {
            reject(new Error(response.error.message || "MCP Error"));
          } else {
            resolve(response.result);
          }
        }
      } catch (error) {
        console.error("Failed to parse MCP response:", error);
      }
    }
  }

  getNextRequestId() {
    return ++this.requestId;
  }

  async sendRequest(request) {
    if (!this.mcpProcess) {
      throw new Error("MCP server not connected");
    }

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingRequests.delete(request.id);
        reject(new Error("Request timeout"));
      }, 30000); // 30 second timeout

      this.pendingRequests.set(request.id, {
        resolve: (result) => {
          clearTimeout(timeoutId);
          resolve(result);
        },
        reject: (error) => {
          clearTimeout(timeoutId);
          reject(error);
        },
      });

      this.mcpProcess.stdin.write(JSON.stringify(request) + "\n");
    });
  }

  async listTools() {
    const request = {
      jsonrpc: "2.0",
      id: this.getNextRequestId(),
      method: "tools/list",
      params: {},
    };

    return await this.sendRequest(request);
  }

  async callTool(toolName, args = {}) {
    const request = {
      jsonrpc: "2.0",
      id: this.getNextRequestId(),
      method: "tools/call",
      params: {
        name: toolName,
        arguments: args,
      },
    };

    return await this.sendRequest(request);
  }

  // Convenience methods for joke tools
  async getRandomJoke(category, safe = true) {
    return await this.callTool("get_random_joke", { category, safe });
  }

  async getDadJoke() {
    return await this.callTool("get_dad_joke");
  }

  async getChuckNorrisJoke(category) {
    return await this.callTool("get_chuck_norris_joke", { category });
  }

  async searchJokes(searchTerm, amount = 3) {
    return await this.callTool("search_jokes", { searchTerm, amount });
  }

  async disconnect() {
    if (this.mcpProcess) {
      this.mcpProcess.kill();
      this.mcpProcess = null;
      this.isConnected = false;
    }
  }
}

// Create a singleton instance
const mcpService = new MCPService();

export default mcpService;
