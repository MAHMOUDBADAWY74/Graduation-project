import { useState, useRef, useEffect } from "react";
import {
  FiSend,
  FiMinimize2,
  FiMaximize2,
  FiBell,
  FiSearch,
  FiX,
  FiUsers,
} from "react-icons/fi";
import "./styles.css";

export default function ChatBox() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [hasNotification, setHasNotification] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChat, setActiveChat] = useState("general");
  const [showChatList, setShowChatList] = useState(false);

  const [chats, setChats] = useState({
    general: {
      name: "General Chat",
      messages: [
        {
          id: 1,
          text: "Welcome to General Chat! 👋",
          sender: "system",
          timestamp: new Date(),
        },
      ],
    },
    support: {
      name: "Support",
      messages: [
        {
          id: 1,
          text: "How can we help you today?",
          sender: "system",
          timestamp: new Date(),
        },
      ],
    },
    tech: {
      name: "Tech Discussion",
      messages: [
        {
          id: 1,
          text: "Welcome to Tech Discussion! 💻",
          sender: "system",
          timestamp: new Date(),
        },
      ],
    },
  });

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats[activeChat].messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: chats[activeChat].messages.length + 1,
        text: message,
        sender: "user",
        timestamp: new Date(),
      };
      setChats({
        ...chats,
        [activeChat]: {
          ...chats[activeChat],
          messages: [...chats[activeChat].messages, newMessage],
        },
      });
      setMessage("");
      setHasNotification(true);
    }
  };

  const handleNotificationClick = () => {
    setHasNotification(false);
  };

  const filteredMessages = chats[activeChat].messages.filter((msg) =>
    msg.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatChange = (chatId) => {
    setActiveChat(chatId);
    setShowChatList(false);
  };

  const handleToggleChat = () => {
    setIsMinimized(!isMinimized);
    if (!isMinimized) {
      setShowChatList(false);
      setIsSearching(false);
    }
  };

  return (
    <div className={`chat-box ${isMinimized ? "minimized" : ""}`}>
      <div className="chat-header">
        <div className="header-left">
          <button
            className="chat-list-btn"
            onClick={() => setShowChatList(!showChatList)}
            aria-label="Toggle chat list"
          >
            <FiUsers size={16} />
          </button>
          <h3>{chats[activeChat].name}</h3>
          <button
            className={`notification-btn ${
              hasNotification ? "has-notification" : ""
            }`}
            onClick={handleNotificationClick}
            aria-label="Toggle notifications"
          >
            <FiBell size={16} />
            {hasNotification && <span className="notification-dot"></span>}
          </button>
        </div>
        <div className="header-right">
          <button
            className="search-btn"
            onClick={() => setIsSearching(!isSearching)}
            aria-label="Toggle search"
          >
            {isSearching ? <FiX size={16} /> : <FiSearch size={16} />}
          </button>
          <button
            className="minimize-btn"
            onClick={handleToggleChat}
            aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
          >
            {isMinimized ? (
              <FiMaximize2 size={16} />
            ) : (
              <FiMinimize2 size={16} />
            )}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {showChatList && (
            <div className="chat-list">
              {Object.entries(chats).map(([id, chat]) => (
                <button
                  key={id}
                  className={`chat-item ${activeChat === id ? "active" : ""}`}
                  onClick={() => handleChatChange(id)}
                >
                  <span className="chat-name">{chat.name}</span>
                  {chat.messages.length > 0 && (
                    <span className="message-count">
                      {chat.messages.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
          {isSearching && (
            <div className="search-container">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="search-input"
              />
              {searchQuery && (
                <span className="search-results">
                  {filteredMessages.length} results
                </span>
              )}
            </div>
          )}
          <div className="chat-messages">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${
                  msg.sender === "user" ? "user" : "system"
                }`}
              >
                <div className="message-content">
                  <p>{msg.text}</p>
                  <span className="timestamp">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message..."
              aria-label="Message input"
            />
            <button type="submit" aria-label="Send message">
              <FiSend size={16} />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
