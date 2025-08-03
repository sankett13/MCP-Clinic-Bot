# 🏥 CareWell Medical Clinic ChatBot

An AI-powered medical clinic chatbot built with Model Context Protocol (MCP) that provides intelligent appointment management and clinic information retrieval through a modern, responsive interface.

## ✨ Features

- **Smart Appointment Management**: Book, check, update, and cancel appointments
- **Intelligent Information Retrieval**: ChromaDB-powered vector search for clinic information
- **24/7 Availability**: AI assistant available round the clock
- **Mobile-First Design**: Fully responsive interface with mobile optimization
- **Real-time Chat**: Instant responses with typing indicators
- **Function Tracking**: Visual indicators showing which AI functions were used
- **Error Handling**: Graceful error handling with user-friendly messages

## 🚀 Tech Stack

### Frontend

- **React 19** - Modern UI library
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Responsive Design** - Mobile-first approach

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database for appointment storage
- **ChromaDB** - Vector database for clinic information
- **Model Context Protocol (MCP)** - AI agent communication protocol

### AI & ML

- **Google Gemini AI** - Large language model
- **MCP Server** - Tool execution and management
- **Vector Search** - Semantic information retrieval

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Google Gemini API key
- npm or yarn package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/sankett13/MCP-Clinic-Bot.git
cd MCP-Clinic-Bot
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=mongodb://localhost:27017/clinic_chatbot
PORT=5000
```

### 3. Frontend Setup

```bash
cd frontend/mcp_chatbot
npm install
```

### 4. Start the Application

**Backend (Terminal 1):**

```bash
cd backend
npm run dev
```

**Frontend (Terminal 2):**

```bash
cd frontend/mcp_chatbot
npm run dev
```

**MCP Server Inspector (Terminal 3 - Optional):**

```bash
cd backend
npm run inspector
```

The application will be available at:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- MCP Inspector: `http://localhost:3000`

## 🏗️ Project Structure

```
MCP_ChatBot_Clinic/
├── backend/
│   ├── controllers/
│   │   └── chatManager.js
│   ├── models/
│   │   └── appointment.js
│   ├── routes/
│   │   └── mcpRouter.js
│   ├── services/
│   │   ├── initializeChromaDB.js
│   │   ├── initializeMcpServer.js
│   │   └── mcpServer.js
│   ├── chromaDB_store.js
│   ├── connection.js
│   ├── server.js
│   └── package.json
├── frontend/
│   └── mcp_chatbot/
│       ├── src/
│       │   ├── components/
│       │   │   ├── ChatBot.jsx
│       │   │   ├── Header.jsx
│       │   │   ├── Hero.jsx
│       │   │   ├── Services.jsx
│       │   │   ├── About.jsx
│       │   │   ├── Contact.jsx
│       │   │   └── Footer.jsx
│       │   ├── assets/
│       │   ├── App.jsx
│       │   └── main.jsx
│       └── package.json
└── README.md
```

## 🔧 Available MCP Tools

The chatbot uses the following MCP tools:

1. **createAppointment** - Book new appointments
2. **checkForAppointments** - View existing appointments
3. **updateAppointment** - Modify appointment details
4. **deleteAppointment** - Cancel appointments
5. **ClinicInfo** - Retrieve clinic information using vector search

## 💬 Usage Examples

**Book an Appointment:**

```
User: "I'd like to book an appointment for tomorrow at 2 PM"
Bot: "I'll help you book an appointment. Could you please provide your name, email, and phone number?"
```

**Check Appointments:**

```
User: "Do I have any appointments this week?"
Bot: "Let me check your appointments. What's your name?"
```

**Clinic Information:**

```
User: "What services do you provide?"
Bot: "CareWell Medical Clinic offers comprehensive healthcare services including..."
```

## 🎯 Key Components

### ChatBot Component

- Real-time messaging interface
- Mobile-responsive design
- Quick action buttons
- Function usage tracking
- Error handling with retry logic

### MCP Server

- Tool registration and execution
- Database operations
- Vector search capabilities
- Error handling and validation

### ChromaDB Integration

- Semantic search for clinic information
- Vector embeddings for improved relevance
- Fast query responses

## 🔒 Environment Variables

### Backend (.env)

```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=mongodb://localhost:27017/clinic_chatbot
PORT=5000
NODE_ENV=development
```

## 📱 Features in Detail

### Responsive Design

- Mobile-first approach with touch-optimized interactions
- Adaptive chat window sizing
- Optimized quick actions for different screen sizes

### Error Handling

- Network error recovery
- Graceful API failure handling
- User-friendly error messages
- Retry mechanisms

### Performance Optimizations

- Lazy loading of components
- Optimized re-renders
- Efficient state management
- Vector search optimization

## 🧪 Development

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend/mcp_chatbot
npm test
```

### MCP Inspector

Use the MCP Inspector to debug and test MCP tools:

```bash
cd backend
npm run inspector
```

## 🚀 Deployment

### Production Build

```bash
# Frontend
cd frontend/mcp_chatbot
npm run build

# Backend
cd backend
npm start
```

### Environment Setup

Ensure all environment variables are properly configured for production:

- Database connection strings
- API keys
- CORS settings
- Port configurations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) for the MCP framework
- [Google Gemini AI](https://ai.google.dev/) for the language model
- [ChromaDB](https://www.trychroma.com/) for vector database capabilities
- [React](https://react.dev/) and [Vite](https://vitejs.dev/) for the frontend framework

## 📞 Support

If you have any questions or need help setting up the project, please open an issue or contact the maintainer.

---

**Built with ❤️ using Model Context Protocol and modern web technologies**
