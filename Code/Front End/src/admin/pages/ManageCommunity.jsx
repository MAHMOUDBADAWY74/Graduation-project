import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux"; // <-- import useSelector
import { useToast } from "../../hooks/useToast";
import "./ManageCommunity.css";
import { timeAgo } from "../../utils/util";

const API_URL = "https://localhost:7159/api/Community";

const ManageCommunity = () => {
  const [communities, setCommunities] = useState([]);
  const [editCommunity, setEditCommunity] = useState(null);
  const [updateCommunity, setUpdateCommunity] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get token from authSlice in Redux store
  const token = useSelector((state) => state.auth.token);
  const { showSuccess, showError } = useToast();

  // Get all communities
  useEffect(() => {
    if (!token) return;
    axios
      .get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCommunities(response.data);
      })
      .catch((error) => {
        console.error("Failed fetching data", error);
      });
  }, [token]);

  // Edit community
  const handleEdit = (community) => {
    setEditCommunity(community.id);
    setUpdateCommunity({
      name: community.name,
      description: community.description,
    });
  };

  const handleUpdate = (e) => {
    setUpdateCommunity({ ...updateCommunity, [e.target.name]: e.target.value });
  };

  // Save edits
  // const handleSave = async () => {
  //   try {
  //     await axios.put(`${API_URL}/${editCommunity}`, updateCommunity, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setCommunities(
  //       communities.map((community) =>
  //         community.id === editCommunity
  //           ? { ...community, ...updateCommunity }
  //           : community
  //       )
  //     );
  //     setEditCommunity(null);
  //     alert("Community updated");
  //   } catch (error) {
  //     console.error("Error updating community", error);
  //   }
  // };

  const handleCancel = () => {
    setEditCommunity(null);
  };

  // Delete community
  const handleDelete = (id) => {
    axios
      .delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setCommunities(communities.filter((community) => community.id !== id));
        showSuccess("Community deleted successfully");
      })
      .catch((error) => {
        showError(error.response?.data || "Error deleting community");
        console.error("Error deleting community:", error);
      });
  };

  // Edit community API call (multipart/form-data)
  // Updated handleSave to work with the edit form state
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // If you want to support image upload, add an image input and handle it here
      const formData = new FormData();
      formData.append("Name", updateCommunity.name);
      formData.append("Description", updateCommunity.description);
      // If you have an image: formData.append("ImageFile", imageFile || "");
      await axios.put(`${API_URL}/${editCommunity}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setCommunities(
        communities.map((community) =>
          community.id === editCommunity
            ? { ...community, ...updateCommunity }
            : community
        )
      );
      setEditCommunity(null);
      setSuccess("Community updated successfully!");
    } catch (error) {
      setError(error.response?.data || "Failed to edit community");
      console.error("Failed editing community", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="managecommunities">
      <h2 style={{ textAlign: "center", marginBottom: 32 }}>
        Manage Communities
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "32px",
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        {communities.map((community) => (
          <div
            key={community.id}
            style={{
              background: "linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)",
              borderRadius: "16px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              padding: "32px 28px 24px 28px",
              width: "340px",
              minHeight: "340px",
              marginBottom: "24px",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: "1.5px solid #e0e7ff",
              transition: "box-shadow 0.2s, transform 0.2s",
            }}
            className="community-card"
          >
            <div>
              <h3
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#1e293b",
                  marginBottom: 8,
                  letterSpacing: 0.5,
                }}
              >
                {community.name}
              </h3>
              <p style={{ color: "#475569", marginBottom: 12 }}>
                <strong>Description:</strong> {community.description}
              </p>
              <div style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>
                <span style={{ marginRight: 12 }}>
                  <strong>Created:</strong> {timeAgo(community.createdAt)}
                </span>
                <span>
                  <strong>Admin:</strong> {community.adminName}
                </span>
              </div>
              <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
                <div
                  style={{
                    background: "#e0e7ff",
                    borderRadius: 8,
                    padding: "6px 14px",
                    fontWeight: 600,
                    color: "#3730a3",
                    fontSize: 15,
                  }}
                >
                  👥 {community.memberCount} Members
                </div>
                <div
                  style={{
                    background: "#fef9c3",
                    borderRadius: 8,
                    padding: "6px 14px",
                    fontWeight: 600,
                    color: "#b45309",
                    fontSize: 15,
                  }}
                >
                  📝 {community.postCount} Posts
                </div>
              </div>
              {community.isMember && (
                <div
                  style={{
                    background: "#bbf7d0",
                    color: "#166534",
                    borderRadius: 8,
                    padding: "4px 10px",
                    fontSize: 13,
                    display: "inline-block",
                    marginBottom: 8,
                  }}
                >
                  You are a member
                </div>
              )}
            </div>
            <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
              <button
                className="edit-community-btn"
                style={{ flex: 1, fontWeight: 600, fontSize: 15 }}
                onClick={() => handleEdit(community)}
              >
                Edit
              </button>
              <button
                className="delete-community-btn"
                style={{ flex: 1, fontWeight: 600, fontSize: 15 }}
                onClick={() => handleDelete(community.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editCommunity && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(30, 41, 59, 0.25)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="edit-form"
            style={{
              maxWidth: 400,
              width: "90%",
              background: "#f8fafc",
              border: "1.5px solid #e0e7ff",
              borderRadius: 12,
              boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
              padding: 32,
              position: "relative",
            }}
          >
            <button
              onClick={handleCancel}
              style={{
                position: "absolute",
                top: 12,
                right: 16,
                background: "transparent",
                border: "none",
                fontSize: 22,
                color: "#64748b",
                cursor: "pointer",
                fontWeight: 700,
              }}
              aria-label="Close"
            >
              ×
            </button>
            <h3
              style={{
                textAlign: "center",
                color: "#1e293b",
                fontWeight: 700,
                marginBottom: 18,
              }}
            >
              Edit Community
            </h3>
            <label style={{ fontWeight: 600, color: "#334155" }}>
              Community Name:
            </label>
            <input
              type="text"
              name="name"
              value={updateCommunity.name}
              onChange={handleUpdate}
              style={{ marginBottom: 12 }}
            />
            <label style={{ fontWeight: 600, color: "#334155" }}>
              Description:
            </label>
            <input
              type="text"
              name="description"
              value={updateCommunity.description}
              onChange={handleUpdate}
              style={{ marginBottom: 18 }}
            />
            <div className="form-buttons" style={{ justifyContent: "center" }}>
              <button
                className="save-community-btn"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                className="cancel-community-btn"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
            {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
            {success && (
              <div style={{ color: "green", marginTop: 8 }}>{success}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCommunity;
