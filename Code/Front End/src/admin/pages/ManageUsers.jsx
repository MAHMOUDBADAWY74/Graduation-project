import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FiEdit2 } from "react-icons/fi";
import { useToast } from "../../hooks/useToast";
import "./ManageUsersNew.css";
import "../../styles/colors.css";

const API_URL = "https://localhost:7159/api/Admin/users";
const COMMUNITY_API_URL = "https://localhost:7159/api/Community";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [editRoleUserId, setEditRoleUserId] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState({});
  const token = useSelector((state) => state.auth.token);
  const { showSuccess, showError } = useToast();

  // Fetch users
  useEffect(() => {
    if (!token) return;
    axios
      .get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setUsers(response.data))
      .catch((error) => {
        showError("Error fetching users", "error");
        console.error("Error fetching users:", error);
      });
  }, [token]);

  // Fetch communities
  useEffect(() => {
    if (!token) return;
    axios
      .get(COMMUNITY_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setCommunities(response.data))
      .catch((error) => {
        showError("Error fetching communities", "error");
        console.error("Error fetching communities:", error);
      });
  }, [token]);

  // Handle assign moderator
  const handleAssignModerator = async (userId, communityId) => {
    if (!communityId) {
      showError("Please select a community", "error");
      return;
    }
    try {
      await axios.post(
        `${COMMUNITY_API_URL}/moderators/assign`,
        {
          communityId: parseInt(communityId),
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(
        users.map((user) =>
          user.id === userId
            ? {
                ...user,
                communityId: parseInt(communityId),
                communityName:
                  communities.find((c) => c.id === parseInt(communityId))
                    ?.name || null,
              }
            : user
        )
      );
      setSelectedCommunity({ ...selectedCommunity, [userId]: "" });
      showSuccess("Moderator assigned successfully");
    } catch (error) {
      showError("Error assigning moderator", "error");
      console.error("Error assigning moderator:", error);
    }
  };

  // Handle remove moderator
  const handleRemoveModerator = async (userId, communityId) => {
    try {
      await axios.post(
        `${COMMUNITY_API_URL}/moderators/remove?communityId=${+communityId}&userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(
        users.map((user) =>
          user.id === userId
            ? { ...user, communityId: null, communityName: null }
            : user
        )
      );
      showSuccess("Moderator removed successfully");
    } catch (error) {
      showError("Error removing moderator", "error");
      console.error("Error removing moderator:", error);
    }
  };

  // Handle block user from site
  const handleBlockSite = async (userId) => {
    try {
      await axios.post(
        `https://localhost:7159/api/Admin/ban-site/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, isBlocked: true } : user
        )
      );
      showSuccess("User blocked from site successfully");
    } catch (error) {
      showError("Error blocking user from site", "error");
      console.error("Error blocking user from site:", error);
    }
  };

  // Handle unblock user from site
  const handleUnblockSite = async (userId) => {
    try {
      await axios.post(
        `https://localhost:7159/api/Admin/unban-site/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, isBlocked: false } : user
        )
      );
      showSuccess("User unblocked from site successfully");
    } catch (error) {
      showError("Error unblocking user from site", "error");
      console.error("Error unblocking user from site:", error);
    }
  };

  return (
    <div
      className="manageUsers"
      style={{
        padding: "40px 0",
        minHeight: "100vh",
        background: "var(--color-bg-light)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: 32,
          fontWeight: 800,
          fontSize: 32,
          color: "var(--color-brand)",
          letterSpacing: 1,
        }}
      >
        Manage Users
      </h2>
      <div
        className="users-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "32px",
          justifyContent: "center",
          alignItems: "stretch",
          padding: "0 16px",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              background: "var(--color-card-bg)",
              borderRadius: "18px",
              boxShadow: "0 4px 24px var(--color-shadow)",
              padding: "32px 24px 24px 24px",
              minHeight: "340px",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: "1.5px solid var(--color-bg-light-alt)",
              transition: "box-shadow 0.2s, transform 0.2s",
              cursor: "pointer",
              overflow: "hidden",
            }}
            className="user-card"
          >
            <div>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--color-text-dark)",
                  marginBottom: 8,
                  wordBreak: "break-word",
                }}
              >
                {user.username}
              </h3>
              <p
                style={{
                  color: "var(--color-accent)",
                  marginBottom: 8,
                  fontSize: 15,
                  wordBreak: "break-all",
                }}
              >
                <strong>Email:</strong> {user.email}
              </p>
              <div className="role-edit">
                <span
                  style={{
                    marginRight: 12,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <strong>Role:</strong> {user.role}
                  <FiEdit2
                    style={{
                      width: 18,
                      height: 18,
                      marginLeft: 8,
                      cursor: "pointer",
                      verticalAlign: "middle",
                      color: "var(--color-brand)",
                    }}
                    title="Edit Role"
                    onClick={() => {
                      setEditRoleUserId(user.id);
                      setNewRole(user.role);
                    }}
                  />
                </span>
                {user.communityId && (
                  <span className="community-label">
                    <strong>Community:</strong> {user.communityName}
                  </span>
                )}
              </div>
              {editRoleUserId === user.id && (
                <div
                  style={{
                    marginBottom: 8,
                    marginTop: 4,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 6,
                      border: "1px solid var(--color-bg-light-alt)",
                      marginRight: 8,
                      minWidth: 120,
                    }}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Sender">Sender</option>
                    <option value="Receiver">Receiver</option>
                    <option value="User">User</option>
                  </select>
                  <button
                    style={{
                      padding: "4px 14px",
                      borderRadius: 6,
                      background: "var(--color-brand)",
                      color: "var(--color-text-light)",
                      border: "none",
                      fontWeight: 600,
                      marginRight: 4,
                      minWidth: 70,
                    }}
                    onClick={async () => {
                      try {
                        await axios.put(
                          `${API_URL}/${user.id}/roles`,
                          { newRole },
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        );
                        setUsers(
                          users.map((u) =>
                            u.id === user.id ? { ...u, role: newRole } : u
                          )
                        );
                        setEditRoleUserId(null);
                        showSuccess("Role updated successfully", "success");
                      } catch {
                        showError("Failed to update role", "error");
                      }
                    }}
                  >
                    Save
                  </button>
                  <button
                    style={{
                      padding: "4px 14px",
                      borderRadius: 6,
                      background: "var(--color-bg-light-alt)",
                      color: "var(--color-text-dark)",
                      border: "none",
                      fontWeight: 600,
                      minWidth: 70,
                    }}
                    onClick={() => setEditRoleUserId(null)}
                  >
                    Cancel
                  </button>
                </div>
              )}
              <div style={{ marginBottom: 8 }}>
                <span
                  className={`user-status${user.isBlocked ? " blocked" : ""}`}
                >
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>
              {!user.communityId ? (
                <div
                  style={{
                    marginBottom: 8,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <select
                    value={selectedCommunity[user.id] || ""}
                    onChange={(e) =>
                      setSelectedCommunity({
                        ...selectedCommunity,
                        [user.id]: e.target.value,
                      })
                    }
                    style={{
                      padding: "4px 8px",
                      borderRadius: 6,
                      border: "1px solid var(--color-bg-light-alt)",
                      marginRight: 8,
                      width: "180px",
                      minWidth: 120,
                    }}
                  >
                    <option value="">Select a community</option>
                    {communities.map((community) => (
                      <option key={community.id} value={community.id}>
                        {community.name}
                      </option>
                    ))}
                  </select>
                  <button
                    style={{
                      padding: "4px 14px",
                      borderRadius: 6,
                      background: "var(--color-brand)",
                      color: "var(--color-text-light)",
                      border: "none",
                      fontWeight: 600,
                      minWidth: 120,
                    }}
                    onClick={() =>
                      handleAssignModerator(user.id, selectedCommunity[user.id])
                    }
                  >
                    Assign Moderator
                  </button>
                </div>
              ) : (
                <div style={{ marginBottom: 8 }}>
                  <button
                    style={{
                      padding: "4px 14px",
                      borderRadius: 6,
                      background: "var(--color-accent)",
                      color: "var(--color-text-light)",
                      border: "none",
                      fontWeight: 600,
                      minWidth: 120,
                    }}
                    onClick={() =>
                      handleRemoveModerator(user.id, user.communityId)
                    }
                  >
                    Remove Moderator
                  </button>
                </div>
              )}
            </div>
            <div style={{ marginTop: 18 }}>
              <button
                className={user.isBlocked ? "unblock-btn" : "block-btn"}
                style={{
                  width: "100%",
                  marginTop: 12,
                  fontWeight: 700,
                  fontSize: 15,
                  borderRadius: 6,
                  border: "none",
                  padding: "10px 0",
                  background: user.isBlocked
                    ? "var(--color-accent)"
                    : "var(--color-brand)",
                  color: "var(--color-text-light)",
                  transition: "background 0.2s",
                }}
                onClick={() =>
                  user.isBlocked
                    ? handleUnblockSite(user.id)
                    : handleBlockSite(user.id)
                }
                title={user.isBlocked ? "Unblock from site" : "Block from site"}
              >
                {user.isBlocked ? "Unblock from Site" : "Block from Site"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;
