# MCP Joke Server - Backend

This backend integrates a Model Context Protocol (MCP) server with Express.js to provide joke-related functionality through RESTful APIs.

## Features

- **MCP Integration**: Uses the Model Context Protocol SDK to create a structured server
- **Multiple Joke Sources**: Integrates with multiple joke APIs
- **RESTful API**: Clean REST endpoints for frontend consumption
- **Error Handling**: Comprehensive error handling and logging
- **Health Monitoring**: Service health check endpoints

## Available Joke Tools

1. **Random Jokes** - Get random jokes with optional category filtering
2. **Dad Jokes** - Get dad jokes from icanhazdadjoke.com
3. **Chuck Norris Jokes** - Get Chuck Norris jokes with category support
4. **Search Jokes** - Search for jokes containing specific terms

## API Endpoints

### Base URL

```
http://localhost:8000/api/mcp
```

### Health Check

```http
GET /health
```

Check if the MCP service is running properly.

### Get Available Tools

```http
GET /tools
```

Returns a list of all available MCP tools.

### Joke Endpoints

#### 1. Random Joke

```http
GET /jokes/random?category={category}&safe={boolean}
```

**Query Parameters:**

- `category` (optional): Programming, Misc, Dark, Pun, Spooky, Christmas
- `safe` (optional): true/false (default: true) - filters explicit content

**Example:**

```bash
curl "http://localhost:8000/api/mcp/jokes/random?category=Programming&safe=true"
```

#### 2. Dad Joke

```http
GET /jokes/dad
```

**Example:**

```bash
curl "http://localhost:8000/api/mcp/jokes/dad"
```

#### 3. Chuck Norris Joke

```http
GET /jokes/chuck?category={category}
```

**Query Parameters:**

- `category` (optional): animal, career, celebrity, dev, explicit, fashion, food, history, money, movie, music, political, religion, science, sport, travel

**Example:**

```bash
curl "http://localhost:8000/api/mcp/jokes/chuck?category=dev"
```

#### 4. Search Jokes

```http
GET /jokes/search?q={searchTerm}&amount={number}
```

**Query Parameters:**

- `q` (required): Search term
- `amount` (optional): Number of jokes (1-10, default: 3)

**Example:**

```bash
curl "http://localhost:8000/api/mcp/jokes/search?q=programming&amount=5"
```

#### 5. Unified Joke Endpoint

```http
GET /jokes/{type}
```

**Supported Types:**

- `random` - Same as `/jokes/random`
- `dad` - Same as `/jokes/dad`
- `chuck` or `chuck_norris` - Same as `/jokes/chuck`
- `search` - Same as `/jokes/search` (requires `q` parameter)

**Example:**

```bash
curl "http://localhost:8000/api/mcp/jokes/random?category=Programming"
```

## Response Format

All endpoints return JSON responses in the following format:

### Success Response

```json
{
  "success": true,
  "data": {
    "joke": "🎭 **Random Joke** (Programming)\n\nWhy do programmers prefer dark mode?\nBecause light attracts bugs!\n\n*Category: Programming*",
    "type": "random",
    "category": "Programming"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Failed to get random joke",
  "error": "Network error"
}
```

## Setup and Installation

1. **Install Dependencies**

```bash
npm install
```

2. **Environment Setup**
   Create a `.env` file:

```properties
PORT=8000
NODE_ENV=development
```

3. **Start the Server**

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Project Structure

```
backend/
├── controllers/
│   └── jokeController.js    # API request handlers
├── routes/
│   └── mcpRouter.js         # Route definitions
├── services/
│   └── mcpService.js        # MCP client service
├── mcpServer.js             # MCP server implementation
├── server.js                # Express server setup
├── package.json
└── .env
```

## MCP Server Details

The MCP server (`mcpServer.js`) implements the Model Context Protocol and provides four main tools:

1. **get_random_joke**: Fetches random jokes from JokeAPI
2. **get_dad_joke**: Fetches dad jokes from icanhazdadjoke.com
3. **get_chuck_norris_joke**: Fetches Chuck Norris jokes
4. **search_jokes**: Searches for jokes containing specific terms

## Dependencies

- **@modelcontextprotocol/sdk**: MCP SDK for server implementation
- **express**: Web framework
- **axios**: HTTP client for API requests
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## Error Handling

The application includes comprehensive error handling:

- MCP service connection errors
- API request failures
- Invalid parameters
- Service unavailability

## Testing the API

You can test the API using curl, Postman, or any HTTP client:

```bash
# Test health
curl http://localhost:8000/api/mcp/health

# Get a random joke
curl http://localhost:8000/api/mcp/jokes/random

# Get a dad joke
curl http://localhost:8000/api/mcp/jokes/dad

# Get a Chuck Norris joke
curl http://localhost:8000/api/mcp/jokes/chuck

# Search for programming jokes
curl "http://localhost:8000/api/mcp/jokes/search?q=programming&amount=2"
```

## Frontend Integration

This backend is designed to work with the React frontend in the `frontend/mcp_chatbot` directory. The frontend can consume these APIs to display jokes in a chat interface.

## Troubleshooting

1. **MCP Service Not Starting**: Check that Node.js supports ES modules and all dependencies are installed
2. **API Errors**: Check the server logs and ensure external joke APIs are accessible
3. **Connection Issues**: Verify the PORT in .env matches your frontend configuration

For more issues, check the server logs and the `/health` endpoint for service status.
