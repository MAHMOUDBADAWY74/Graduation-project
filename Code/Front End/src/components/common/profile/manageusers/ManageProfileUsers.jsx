import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useToast } from "../../../../hooks/useToast";

export default function ManageProfileUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get(
          "https://localhost:7159/api/Community/members/my-communities",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(res.data);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [token]);

  const handleBanToggle = async (communityId, userId, isBanned) => {
    const endpoint = isBanned
      ? `https://localhost:7159/api/Community/${communityId}/unban/${userId}`
      : `https://localhost:7159/api/Community/${communityId}/ban/${userId}`;
    try {
      await axios.post(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        }
      );
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isBanned: !isBanned } : user
        )
      );
      showSuccess(
        isBanned ? "User unbanned successfully" : "User banned successfully"
      );
    } catch {
      showError("Failed to update user status");
    }
  };

  // For demo, using user.communityId or fallback to 1
  return (
    <div className="manage-users-grid-container" style={{ padding: 32 }}>
      <h2 style={{ textAlign: "center", marginBottom: 32 }}>Manage Users</h2>
      {loading ? (
        <div className="text-center">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="text-center text-muted">No users found.</div>
      ) : (
        <div
          className="users-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
          }}
        >
          {users.map((user) => (
            <div
              key={user.id}
              className="user-card"
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                padding: 24,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "1px solid #e5e7eb",
              }}
            >
              <img
                src={
                  user.profilePhotoUrl
                    ? `https://localhost:7159/${user.profilePhotoUrl}`
                    : "https://via.placeholder.com/80"
                }
                alt={user.firstName}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: 16,
                }}
              />
              <h4 style={{ margin: 0 }}>
                {user.firstName} {user.lastName}
              </h4>
              <div
                style={{
                  color: "#64748b",
                  fontSize: 15,
                  marginBottom: 8,
                }}
              >
                {user.email}
              </div>

              <button
                className={`btn ${
                  user.isBanned ? "btn-success" : "btn-danger"
                } mt-3`}
                style={{ width: "100%" }}
                onClick={() =>
                  handleBanToggle(user.communityId || 1, user.id, user.isBanned)
                }
              >
                {user.isBanned ? "Unban" : "Ban"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
