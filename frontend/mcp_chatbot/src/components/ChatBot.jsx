import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";

const ChatBot = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm your CareWell Medical Assistant. I can help you book appointments, check existing appointments, answer questions about our clinic, and provide general health information. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/mcp/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        content:
          data.response ||
          "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date(),
        functionsUsed: data.functionsUsed || [],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: messages.length + 2,
        type: "bot",
        content:
          "I'm sorry, I'm having trouble connecting to our servers right now. Please try again in a moment, or contact our clinic directly for immediate assistance.",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const quickActions = [
    "Book an appointment",
    "Check my appointments",
    "What services do you offer?",
    "What are your office hours?",
    "How can I contact the clinic?",
  ];

  const handleQuickAction = (action) => {
    setInputMessage(action);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={onToggle}
        data-chat-toggle
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 p-4 sm:p-4 rounded-full shadow-lg transition-all duration-300 touch-manipulation ${
          isOpen
            ? "bg-red-600 hover:bg-red-700 active:bg-red-800"
            : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:scale-110"
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-x-2 bottom-16 top-2 sm:inset-x-4 sm:bottom-20 sm:top-4 md:bottom-24 md:right-6 md:left-auto md:top-auto md:w-96 md:h-[600px] lg:w-[420px] xl:w-[460px] z-40 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 sm:p-3 md:p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-2 rounded-full">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base sm:text-sm md:text-base">
                  CareWell Assistant
                </h3>
                <p className="text-blue-100 text-sm sm:text-xs md:text-sm">
                  {isLoading ? "Thinking..." : "Online"}
                </p>
              </div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={onToggle}
              className="md:hidden p-2 rounded-full hover:bg-blue-500 active:bg-blue-700 transition-colors touch-manipulation"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-3 md:p-4 space-y-4 sm:space-y-3 md:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[85%] md:max-w-xs lg:max-w-md rounded-2xl p-3 sm:p-2.5 md:p-3 ${
                    message.type === "user"
                      ? "bg-blue-600 text-white"
                      : message.isError
                      ? "bg-red-50 text-red-800 border border-red-200"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === "bot" && (
                      <Bot
                        className={`h-4 w-4 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 mt-0.5 flex-shrink-0 ${
                          message.isError ? "text-red-600" : "text-blue-600"
                        }`}
                      />
                    )}
                    {message.type === "user" && (
                      <User className="h-4 w-4 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 mt-0.5 flex-shrink-0 text-white" />
                    )}
                    <div className="space-y-1 min-w-0">
                      <p className="text-sm sm:text-xs md:text-sm whitespace-pre-wrap break-words leading-relaxed">
                        {message.content}
                      </p>
                      {message.functionsUsed &&
                        message.functionsUsed.length > 0 && (
                          <div className="text-xs text-gray-500 mt-2">
                            <span className="bg-blue-100 px-2 py-1 rounded-full text-xs">
                              Used: {message.functionsUsed.join(", ")}
                            </span>
                          </div>
                        )}
                      <p className="text-xs opacity-70">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl p-3 sm:p-2.5 md:p-3 max-w-[80%] sm:max-w-[85%] md:max-w-xs">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-blue-600" />
                    <div className="flex space-x-1">
                      <Loader2 className="h-4 w-4 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-blue-600 animate-spin" />
                      <span className="text-sm sm:text-xs md:text-sm text-gray-600">
                        Typing...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="px-4 sm:px-3 md:px-4 pb-3 sm:pb-2 md:pb-3">
              <p className="text-xs text-gray-500 mb-3 sm:mb-2 md:mb-3">
                Quick actions:
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-1 md:gap-2">
                {quickActions
                  .slice(0, isMobile ? 2 : 3)
                  .map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action)}
                      className="text-xs sm:text-xs md:text-xs bg-blue-50 text-blue-600 px-3 py-2 sm:px-2 sm:py-1 md:px-3 md:py-2 rounded-full hover:bg-blue-100 active:bg-blue-200 transition-colors duration-200 break-words touch-manipulation min-h-[32px] sm:min-h-auto md:min-h-[32px]"
                    >
                      {action}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 sm:p-3 md:p-4 border-t border-gray-200 bg-gray-50 sm:bg-white md:bg-gray-50">
            <div className="flex space-x-3 sm:space-x-2 md:space-x-3">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 resize-none border border-gray-300 rounded-xl sm:rounded-lg md:rounded-xl px-4 py-3 sm:px-3 sm:py-2 md:px-4 md:py-3 text-sm sm:text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px] sm:min-h-[36px] md:min-h-[44px] leading-relaxed"
                rows="1"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 text-white p-3 sm:p-2 md:p-3 rounded-xl sm:rounded-lg md:rounded-xl hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0 touch-manipulation min-w-[44px] sm:min-w-auto md:min-w-[44px]"
              >
                <Send className="h-5 w-5 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3 sm:mt-2 md:mt-3 hidden sm:block md:block">
              Press Enter to send • This AI can help with appointments and
              clinic info
            </p>
            <p className="text-xs text-gray-500 mt-3 sm:hidden text-center">
              AI assistant for appointments & clinic info
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
