import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useToast } from "../../hooks/useToast";
import "./AddCommunity.css";

const AddCommunity = () => {
  const { token } = useSelector((state) => state.auth);
  const { showSuccess, showError } = useToast();
  const [communities, setCommunities] = useState({
    name: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCommunities({ ...communities, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleAddCommunity = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", communities.name);
      formData.append("description", communities.description);
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      await axios.post("https://localhost:7159/api/Community", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showSuccess("Community added successfully!");
      setCommunities({ name: "", description: "" });
      setImageFile(null);
    } catch (error) {
      console.error("Failed adding community", error);
      showError(error.response?.data || "Failed to add community");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-community">
      <div className="mb-5 heading-container">
        <h2 className="community-heading">
          <span className="heading-text">Add Community</span>
          <div className="heading-underline"></div>
        </h2>
      </div>

      <form onSubmit={handleAddCommunity} className="form-container">
        <div className="mb-3">
          <label className="form-label text-secondary">Name:</label>
          <input
            type="text"
            name="name"
            value={communities.name}
            onChange={handleChange}
            placeholder="Enter community name"
            className="form-control bg-light"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-secondary">Description:</label>
          <textarea
            name="description"
            value={communities.description}
            onChange={handleChange}
            placeholder="Enter community description"
            className="form-control bg-light"
            rows="4"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-secondary">Image:</label>
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            onChange={handleImageChange}
            className="form-control bg-light"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary submit-btn"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Community"}
        </button>
      </form>
    </div>
  );
};

export default AddCommunity;
