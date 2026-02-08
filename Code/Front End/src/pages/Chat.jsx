import { useState, useEffect, useCallback, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import ChatSidebar from "../components/ChatSidebar";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";
import "../styles/Chat.css";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import axios from "axios";

const HUB_URL = "https://localhost:7159/chatHub";

const Chat = () => {
  const { userId } = useParams();
  const { id: loggedInUserId, token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(userId || null);
  const [connection, setConnection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const connectionRef = useRef(null); // لتخزين الـ connection

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://localhost:7159/api/Chat/conversations",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok)
          throw new Error(`Failed to fetch conversations: ${response.status}`);
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConversations();
  }, [token]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://localhost:7159/api/Chat/messages/${selectedUser}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok)
          throw new Error(`Failed to fetch messages: ${response.status}`);
        const data = await response.json();
        const formattedMessages = data.map((msg, index) => ({
          id: msg.id || index + 1,
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          text: msg.message,
          senderName: msg.sender
            ? `${msg.sender.firstName} ${msg.sender.lastName}`
            : "Unknown",
          receiverName: msg.receiver
            ? `${msg.receiver.firstName} ${msg.receiver.lastName}`
            : "Unknown",
          isRead: msg.isRead,
          timestamp: msg.createdAt
            ? new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : null,
        }));
        setMessages(formattedMessages);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [selectedUser, token]);

  useEffect(() => {
    if (!token) {
      console.warn("No token available, skipping SignalR connection setup.");
      setConnectionError("Authentication required. Please log in.");
      return;
    }

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => {
          console.log("Using token for SignalR:", token);
          return token;
        },
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connectionRef.current = newConnection;
    setConnection(newConnection);

    return () => {
      console.log("Cleaning up SignalR connection...");
      connectionRef.current
        ?.stop()
        .catch((e) => console.error("Error stopping connection:", e));
    };
  }, [token]);

  // Setup SignalR connection
  useEffect(() => {
    if (!token) {
      console.warn("No token available, skipping SignalR connection setup.");
      setConnectionError("Authentication required. Please log in.");
      return;
    }

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => {
          console.log("Using token for SignalR:", token);
          return token;
        },
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connectionRef.current = newConnection;
    setConnection(newConnection);

    // Start connection
    const startConnection = async () => {
      try {
        console.log("Attempting to start SignalR connection...");
        if (
          connectionRef.current.state ===
          signalR.HubConnectionState.Disconnected
        ) {
          await connectionRef.current.start();
          console.log("SignalR Connected successfully!");
          setConnectionError(null);

          connectionRef.current.on("ReceiveMessage", (senderId, message) => {
            console.log("Received message:", { senderId, message });
            setMessages((prev) => [
              ...prev,
              {
                id: prev.length + 1,
                senderId,
                receiverId: userId,
                text: message,
                senderName:
                  users.find((u) => u.userId === senderId)?.userName ||
                  "Unknown",
                timestamp: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            ]);
          });

          connectionRef.current.onreconnecting((error) => {
            console.warn("SignalR reconnecting:", error?.message);
            setConnectionError("Reconnecting...");
          });

          connectionRef.current.onreconnected((connectionId) => {
            console.log("SignalR reconnected with ID:", connectionId);
            setConnectionError(null);
          });

          connectionRef.current.onclose((error) => {
            console.error(
              "SignalR connection closed:",
              error?.message || error
            );
            setConnectionError("Connection lost. Please check your network.");
          });
        }
      } catch (e) {
        console.error("SignalR Connection failed:", e);
        setConnectionError(`Connection failed: ${e.message}`);
      }
    };

    startConnection();

    return () => {
      console.log("Cleaning up SignalR connection...");
      connectionRef.current
        ?.stop()
        .catch((e) => console.error("Error stopping connection:", e));
    };
  }, [token, userId, users]);
  const getCurrentUserName = useCallback((users, userId) => {
    const user = users.find((u) => String(u.userId) === String(userId));
    return user ? user.userName : "You";
  }, []);
  // Send message via API instead of SignalR invoke
  const handleSendMessage = useCallback(
    async (text) => {
      if (!text.trim()) {
        console.warn("Empty message, not sending.");
        return;
      }
      try {
        await axios.post(
          "https://localhost:7159/api/Chat/send",
          { receiverId: selectedUser, message: text },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            senderId: loggedInUserId,
            receiverId: selectedUser,
            senderName: getCurrentUserName(users, loggedInUserId),
            text,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      } catch (err) {
        console.error("Send message failed:", err);
        setConnectionError(`Failed to send message: ${err.message}`);
      }
    },
    [selectedUser, loggedInUserId, users, getCurrentUserName, token]
  );
  return (
    <div className="container-fluid chat-page">
      <div className="row h-100">
        {/* Sidebar */}
        <div
          className="p-0 col-12 col-md-3 border-end chat-sidebar"
          style={{
            background: "#fff",
            boxShadow: "2px 0 8px rgba(0,0,0,0.03)",
            zIndex: 2,
          }}
        >
          {isLoading ? (
            <div>Loading conversations...</div>
          ) : (
            <ChatSidebar
              users={users}
              selectedUser={selectedUser}
              onSelectUser={setSelectedUser}
              setMessages={setMessages}
            />
          )}
        </div>
        {/* Main Chat Area */}
        <div
          className="p-0 col-12 col-md-9 d-flex flex-column chat-main"
          style={{
            background: "var(--color-bg-beige)",
            borderRadius: "0 18px 18px 0",
            boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 d-flex align-items-center border-bottom"
            style={{
              background: "#fff",
              borderTopRightRadius: 18,
            }}
          >
            {/* Connection status indicator */}
            <div style={{ marginRight: 16 }}>
              {connection ? (
                connection.state === signalR.HubConnectionState.Connected ? (
                  <span style={{ color: "green", fontWeight: 600 }}>
                    ● Connected
                  </span>
                ) : connection.state ===
                  signalR.HubConnectionState.Connecting ? (
                  <span style={{ color: "orange", fontWeight: 600 }}>
                    ● Connecting...
                  </span>
                ) : (
                  <span style={{ color: "red", fontWeight: 600 }}>
                    ● Disconnected
                  </span>
                )
              ) : (
                <span style={{ color: "gray", fontWeight: 600 }}>
                  ● Not initialized
                </span>
              )}
            </div>
            {users.find((u) => u.userId === selectedUser)?.profilePicture ? (
              <img
                src={`https://localhost:7159${
                  users.find((u) => u.userId === selectedUser)?.profilePicture
                }`}
                alt="User"
                width={44}
                height={44}
                className="border rounded-circle me-3"
                style={{
                  objectFit: "cover",
                  background: "#f5f2e9",
                }}
              />
            ) : (
              <FaUserAlt
                size={44}
                className="border rounded-circle me-3"
                style={{
                  padding: "10px",
                  background: "#f5f2e9",
                }}
              />
            )}
            <div>
              <div
                className="fw-bold"
                style={{
                  fontSize: 18,
                  color: "var(--color-brand)",
                }}
              >
                {users.find((u) => u.userId === selectedUser)?.userName ||
                  "Select a user"}
              </div>
              <div className="small text-muted">
                {users.find((u) => u.userId === selectedUser)?.email || ""}
              </div>
            </div>
          </div>
          {/* Connection Error */}
          {/* {connectionError && (
            <div className="m-2 alert alert-danger">
              {connectionError}
              <button
                className="btn btn-sm btn-primary ms-2"
                onClick={() =>
                  connection
                    ?.start()
                    .catch((e) => console.error("Retry failed:", e))
                }
              >
                Retry
              </button>
            </div>
          )} */}
          {/* Messages + Input */}
          <div className="flex-grow-1 d-flex flex-column">
            {selectedUser ? (
              isLoading ? (
                <div>Loading messages...</div>
              ) : (
                <>
                  <div
                    className="overflow-auto flex-grow-1 chat-messages-area"
                    style={{
                      background: "var(--color-bg-beige)",
                    }}
                  >
                    <ChatMessages messages={messages} userId={loggedInUserId} />
                  </div>
                  <div
                    className="p-2 chat-input-area border-top"
                    style={{
                      background: "#fff",
                      borderBottomRightRadius: 18,
                    }}
                  >
                    <ChatInput onSend={handleSendMessage} />
                  </div>
                </>
              )
            ) : (
              <div
                className="flex-grow-1 d-flex align-items-center justify-content-center text-muted"
                style={{ fontSize: 20 }}
              >
                Start chat with your friends
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
