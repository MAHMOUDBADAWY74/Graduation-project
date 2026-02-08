import PropTypes from "prop-types";
import { useState } from "react";
import { useSelector } from "react-redux";
import InputField from "../../../forms/InputField";
import styles from "./AddPost.module.css";
import ImageUploader from "../img-uploader/ImageUploader";
import { useToast } from "../../../../hooks/useToast";
import { MdClose } from "react-icons/md";

export default function AddPost({
  communityType,
  communityTypes,
  setCommunityType,
  setCommunityTypes,
  onPostSuccess, // ✅ NEW PROP
  setLocalPosts, // ✅ NEW PROP
}) {
  const profilePicture = useSelector((state) => state.auth.profilePicture);
  const { token } = useSelector((state) => state.auth);
  const { showSuccess, showError } = useToast();

  const [images, setImages] = useState([]);
  const [post, setPost] = useState("");

  const selectedCommunity = communityTypes.find(
    (c) => c.id.toString() === communityType
  );

  const removeImage = () => {
    setImages([]);
  };

  const handleJoin = async () => {
    try {
      const response = await fetch(
        `https://localhost:7159/api/Community/${+communityType}/join`,
        {
          method: "POST",
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to join");

      showSuccess(`You joined ${selectedCommunity.name} successfully!`);

      setCommunityTypes((prev) =>
        prev.map((c) =>
          c.id.toString() === communityType ? { ...c, isMember: true } : c
        )
      );
    } catch (error) {
      showError("Failed to join community.");
      console.error(error);
    }
  };

  const handleLeave = async () => {
    try {
      const response = await fetch(
        `https://localhost:7159/api/Community/${+communityType}/leave`,
        {
          method: "POST",
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to leave");

      showSuccess(`You left ${selectedCommunity.name} successfully!`);

      setCommunityTypes((prev) =>
        prev.map((c) =>
          c.id.toString() === communityType ? { ...c, isMember: false } : c
        )
      );
    } catch (error) {
      showError("Failed to leave community.");
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!post.trim()) return showError("Please write something in the post.");
    if (!selectedCommunity) return showError("Please select a community.");

    const formData = new FormData();
    formData.append("Content", post);
    formData.append("CommunityId", communityType);
    if (images[0]) {
      formData.append("ImageFile", images[0].file);
    }

    try {
      const response = await fetch(
        "https://localhost:7159/api/Community/Posts",
        {
          method: "POST",
          headers: {
            Authorization: `bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        let errorMsg = "Failed to create post. Please try again.";
        try {
          const data = await response.json();
          if (data) {
            setLocalPosts((prev) => [data, ...prev]);
          }
          if (data && data.error) {
            errorMsg = data.error;
          }
        } catch {
          // fallback to text if not JSON
          const errorText = await response.text();
          if (errorText) errorMsg = errorText;
        }
        showError(errorMsg);
        return;
      }

      await response.json();
      showSuccess("Post created successfully!");
      setPost("");
      setImages([]);
      setCommunityType("");

      if (onPostSuccess) onPostSuccess();
    } catch (error) {
      showError("Failed to create post. Please try again.");
      console.error(error);
    }
  };

  return (
    <form
      className={`px-3 pt-4 pb-2 ${styles.addPost} rounded-3`}
      onSubmit={handleSubmit}
    >
      <div className={styles.addPostHeader}>
        <div className="d-flex justify-content-center align-items-center">
          <img
            src={`https://localhost:7159${profilePicture}`}
            className="rounded-circle me-2"
            alt="Profile"
            style={{ width: "40px", height: "40px" }}
          />
          <InputField
            type="text"
            placeHolder="What's on your mind?"
            className="m-0 w-100"
            labelRender={false}
            name="post"
            value={post}
            onChange={(e) => setPost(e.target.value)}
          />
        </div>
      </div>

      <div className="gap-2 mb-3 d-flex justify-content-between align-items-center">
        <select
          style={{ width: "200px" }}
          className="form-select"
          value={communityType}
          onChange={(e) => setCommunityType(e.target.value)}
        >
          <option value="">Select Community</option>
          {communityTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>

        {selectedCommunity && !selectedCommunity.isMember && (
          <button
            type="button"
            className="py-2 btn btn-outline-primary"
            onClick={handleJoin}
          >
            Join
          </button>
        )}

        {selectedCommunity && selectedCommunity.isMember && (
          <>
            <button className="py-2 btn btn-success" disabled>
              Joined
            </button>
            <button
              type="button"
              className="py-2 btn btn-outline-danger ms-2"
              onClick={handleLeave}
            >
              Leave
            </button>
          </>
        )}
        <div className="gap-2 mt-3 d-flex">
          <ImageUploader images={images} setImages={setImages} />

          <button className="w-auto py-2 btn btn-primary" type="submit">
            Post
          </button>
        </div>
      </div>

      <div>
        {images.length > 0 && (
          <div className="mx-auto image-preview">
            <div className="image-container">
              <img src={images[0].id} alt="Preview" className="preview-img" />
              <button
                className="remove-button"
                onClick={removeImage}
                title="Remove image"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  border: "none",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 1px 4px var(--color-shadow)",
                  cursor: "pointer",
                  fontSize: 18,
                  position: "absolute",
                  top: 8,
                  right: 8,
                }}
              >
                <MdClose size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}

// ✅ PropTypes Definition
AddPost.propTypes = {
  communityType: PropTypes.string.isRequired,
  communityTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      isMember: PropTypes.bool,
    })
  ).isRequired,
  setCommunityType: PropTypes.func.isRequired,
  setCommunityTypes: PropTypes.func.isRequired,
  onPostSuccess: PropTypes.func, // ✅ NEW
};
