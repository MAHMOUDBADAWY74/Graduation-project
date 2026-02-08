import PropTypes from "prop-types";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ChatSidebar = ({ users, selectedUser, onSelectUser, setMessages }) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const filteredUsers =
    search.length > 0 && isSearching
      ? searchResults
      : users.filter((user) => {
          const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
          return name.toLowerCase().includes(search.toLowerCase());
        });

  async function handleOpenChat(user) {
    onSelectUser(user.userId);
    navigate(`/chat/${user.userId}`);
    // Fetch messages for the selected user
    try {
      const response = await fetch(
        `https://localhost:7159/api/Chat/messages/${user.userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages for user:", err);
    }
  }

  async function handleSearch(term) {
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://localhost:7159/api/Account/search?term=${encodeURIComponent(
          term
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to search users");
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setSearchResults([]);
      console.error("Error searching users:", err);
    }
  }

  return (
    <div className="chat-sidebar-list h-100 d-flex flex-column">
      <div className="p-2 border-bottom bg-light">
        <input
          type="text"
          className="form-control"
          placeholder="Search users..."
          value={search}
          onChange={async (e) => {
            setSearch(e.target.value);
            if (e.target.value.trim().length > 0) {
              await handleSearch(e.target.value);
            } else {
              setIsSearching(false);
              setSearchResults([]);
            }
          }}
        />
      </div>
      <div className="overflow-auto flex-grow-1">
        {filteredUsers.length === 0 && (
          <div className="mt-3 text-center text-muted">No users found</div>
        )}
        {filteredUsers.map((user) => {
          const name =
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            user.userName ||
            "Unknown";
          const profilePic = user.profilePicture
            ? user.profilePicture.startsWith("http")
              ? user.profilePicture
              : `https://localhost:7159${user.profilePicture}`
            : "https://via.placeholder.com/40x40?text=User";
          return (
            <button
              key={user.userId}
              className={`list-group-item ps-2 pt-2 list-group-item-action d-flex align-items-center$${
                selectedUser === user.userId ? " active" : ""
              }`}
              onClick={() => handleOpenChat(user)}
            >
              <img
                src={profilePic}
                alt={name}
                className="rounded-circle me-2"
                width={40}
                height={40}
              />
              <div className="flex-grow-1 text-start">
                <div className="fw-bold">{name || user.userName}</div>
                <div
                  className="text-muted small text-truncate"
                  style={{ maxWidth: 120 }}
                >
                  {/* Optionally show last message here if available */}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

ChatSidebar.propTypes = {
  users: PropTypes.array.isRequired,
  selectedUser: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null]),
  ]),
  onSelectUser: PropTypes.func.isRequired,
  setMessages: PropTypes.func.isRequired,
};

export default ChatSidebar;
