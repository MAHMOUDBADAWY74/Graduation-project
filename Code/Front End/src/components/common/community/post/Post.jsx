import { useState, useEffect } from "react";
import { Card, Button, Form, Spinner, Alert } from "react-bootstrap";
import PropTypes from "prop-types";
import { Chat } from "react-bootstrap-icons";
import "./styles.css";
import PostSlider from "../slider/PostSlider";
import { timeAgo } from "../../../../utils/util";
import { Link } from "react-router-dom";
import {
  BiDownvote,
  BiSolidDownvote,
  BiSolidUpvote,
  BiUpvote,
} from "react-icons/bi";
import { FaRegImage, FaPaperPlane, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useToast } from "../../../../hooks/useToast";

export default function Post({
  userName,
  createdAt,
  isLiked,
  isUnliked,
  likeCount,
  unlikeCount,
  commentCount,
  profilePicture,
  communityName,
  content,
  imageUrl,
  id,
  userId,
  onDelete, // optional callback for parent to remove post from UI
}) {
  const [liked, setLiked] = useState(isLiked);
  const [unliked, setUnliked] = useState(isUnliked);
  const [likes, setLikes] = useState(likeCount);
  const [unlikes, setUnlikes] = useState(unlikeCount);
  const [commentsCount, setCommentsCount] = useState(commentCount);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentImage, setCommentImage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsError, setCommentsError] = useState(null);
  const { id: currentUserId, token } = useSelector((state) => state.auth);
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLike = async () => {
    try {
      const response = await fetch(
        `https://localhost:7159/api/Community/posts/${id}/like`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        if (liked) {
          setLiked(false);
          setLikes(likes - 1);
        } else {
          setLiked(true);
          setLikes(likes + 1);
          if (unliked) {
            setUnliked(false);
            setUnlikes(unlikes - 1);
          }
        }
      }
    } catch {
      // Optionally handle error
    }
  };

  const handleDislike = async () => {
    try {
      const response = await fetch(
        `https://localhost:7159/api/Community/posts/${id}/unlike`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        if (unliked) {
          setUnliked(false);
          setUnlikes(unlikes - 1);
        } else {
          setUnliked(true);
          setUnlikes(unlikes + 1);
          if (liked) {
            setLiked(false);
            setLikes(likes - 1);
          }
        }
      }
    } catch {
      // Optionally handle error
    }
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    setCommentsError(null);
    try {
      const response = await fetch(
        `https://localhost:7159/api/Community/posts/${id}/comments`,
        {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      setComments(data);
    } catch (error) {
      setCommentsError(error.message);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleShowComments = () => {
    if (!showComments) {
      fetchComments();
    }
    setShowComments((prev) => !prev);
  };

  const handleCommentImageChange = (e) => {
    setCommentImage(e.target.files[0]);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (commentText.trim() === "") return;
    const formData = new FormData();
    formData.append("PostId", id);
    formData.append("Content", commentText);
    if (commentImage) {
      formData.append("imageFile", commentImage);
    }
    try {
      const response = await fetch(
        "https://localhost:7159/api/Community/posts/comments",
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (response.ok) {
        setCommentText("");
        setCommentImage(null);
        setCommentsCount((prev) => prev + 1);
        fetchComments(); // Refresh comments
      } else {
        const data = await response.json();
        if (data && data.error) {
          showError(data.error);
        } else {
          showError(
            "An error occurred while adding the comment. Please try again."
          );
        }
      }
    } catch {
      showError(
        "An error occurred while adding the comment. Please try again."
      );
    }
  };

  const handleDelete = async () => {
    // Remove confirm dialog
    try {
      const response = await fetch(
        `https://localhost:7159/api/Community/posts/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        if (onDelete) onDelete(id);
        showSuccess("Post deleted successfully.");
        window.location.reload(); // fallback: reload page
      } else {
        showError("Failed to delete post.");
      }
    } catch {
      showError("Failed to delete post.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    // Remove confirm dialog
    try {
      const response = await fetch(
        `https://localhost:7159/api/Community/comments/${commentId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        setCommentsCount((prev) => prev - 1);
        showSuccess("Comment deleted successfully.");
      } else {
        showError("Failed to delete comment.");
      }
    } catch {
      showError("Failed to delete comment.");
    }
  };

  return (
    <Card
      className={`post-card ${
        isVisible ? "fade-in" : ""
      } mx-auto my-3 shadow-sm rounded-4`}
      style={{
        width: "100%",
        maxWidth: "600px",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Card.Body className="p-3 p-md-4">
        <div className="info d-flex align-items-center">
          <div className="profile-image-container">
            <Link to={`/profile/${userId}`}>
              <img
                src={`https://localhost:7159/${profilePicture}`}
                alt="Profile"
                className="rounded-circle profile-image"
                style={{
                  width: "45px",
                  height: "45px",
                  objectFit: "cover",
                  transition: "transform 0.2s ease",
                }}
              />
            </Link>
          </div>
          <div className="ms-3 flex-grow-1">
            <Link to={`/profile/${userId}`}>
              <h6 className="mb-0 fw-bold">{userName}</h6>
            </Link>
            <div className="gap-2 d-flex align-items-center">
              <small className="text-muted" style={{ fontSize: "12px" }}>
                {timeAgo(createdAt)}
              </small>
              <small className="text-muted" style={{ fontSize: "12px" }}>
                {communityName}
              </small>
            </div>
          </div>
          {/* Delete icon if post belongs to current user */}
          {String(currentUserId) === String(userId) && (
            <button
              className="w-auto p-0 bg-transparent border-0 text-danger ms-2"
              title="Delete Post"
              onClick={handleDelete}
              style={{ fontSize: 20 }}
            >
              <FaTrash />
            </button>
          )}
        </div>

        <div className="py-3 content">
          <p className="px-2 mb-3">{content}</p>
          {imageUrl && (
            <div className="post-image-container">
              <PostSlider>
                <img
                  src={`https://localhost:7159/${imageUrl}`}
                  alt="Post"
                  className="img-fluid w-100 rounded-4"
                  style={{ objectFit: "cover" }}
                />
              </PostSlider>
            </div>
          )}
        </div>

        <div className="gap-2 mt-2 interaction-buttons d-flex justify-content-between align-items-center">
          <div className="gap-2 d-flex">
            <Button
              variant={liked ? "primary" : "outline-primary"}
              size="sm"
              onClick={handleLike}
              className="gap-2 d-flex align-items-center interaction-button"
              style={{ width: "fit-content" }}
            >
              {liked ? <BiSolidUpvote /> : <BiUpvote />}
              <span>{likes}</span>
            </Button>

            <Button
              variant={unliked ? "danger" : "outline-danger"}
              size="sm"
              onClick={handleDislike}
              className="gap-2 d-flex align-items-center interaction-button"
              style={{ width: "fit-content" }}
            >
              {unliked ? <BiSolidDownvote /> : <BiDownvote />}
              <span>{unlikes}</span>
            </Button>
          </div>

          <Button
            variant="outline-secondary"
            size="sm"
            className="gap-2 d-flex align-items-center interaction-button"
            onClick={handleShowComments}
          >
            <Chat /> {commentCount} Comments
          </Button>
        </div>

        <div className="mt-3 comments-section">
          {showComments && (
            <div>
              {loadingComments && <Spinner animation="border" size="sm" />}
              {commentsError && <Alert variant="danger">{commentsError}</Alert>}
              {!loadingComments && !commentsError && (
                <>
                  <Form
                    onSubmit={handleCommentSubmit}
                    className="gap-2 comment-form d-flex align-items-center"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="rounded-pill"
                      style={{ minWidth: 0 }}
                    />
                    {/* Hidden file input */}
                    <input
                      type="file"
                      accept="image/*"
                      id={`comment-image-input-${id}`}
                      style={{ display: "none" }}
                      onChange={handleCommentImageChange}
                    />
                    {/* Icon button for image upload */}
                    <label
                      htmlFor={`comment-image-input-${id}`}
                      className="mb-0"
                      style={{ cursor: "pointer" }}
                    >
                      <span
                        className="p-2 btn btn-light d-flex align-items-center justify-content-center"
                        style={{ borderRadius: "50%" }}
                      >
                        <FaRegImage size={18} />
                      </span>
                    </label>
                    {/* Show image preview if selected */}
                    {commentImage && (
                      <img
                        src={URL.createObjectURL(commentImage)}
                        alt="preview"
                        style={{
                          width: 32,
                          height: 32,
                          objectFit: "cover",
                          borderRadius: 8,
                          marginRight: 4,
                        }}
                      />
                    )}
                    {/* Icon button for submit */}
                    <Button
                      variant="primary"
                      size="sm"
                      type="submit"
                      className="p-2 d-flex align-items-center justify-content-center rounded-circle"
                      style={{ width: 36, height: 36 }}
                      disabled={!commentText.trim()}
                    >
                      <FaPaperPlane size={16} />
                    </Button>
                  </Form>

                  {comments.length > 0 && (
                    <div className="mt-3 comments-list">
                      <h6 className="mb-3">Comments</h6>
                      <ul className="list-unstyled">
                        {comments.map((comment, index) => (
                          <li
                            key={comment.id || index}
                            className="px-3 py-2 mb-2 comment-item bg-light rounded-3"
                            style={{
                              animation: `fadeIn 0.3s ease-in-out ${
                                index * 0.1
                              }s`,
                            }}
                          >
                            <div className="d-flex">
                              {comment.profilePicture && (
                                <img
                                  src={`https://localhost:7159/${comment.profilePicture}`}
                                  alt="Profile"
                                  className="rounded-circle me-2"
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    objectFit: "cover",
                                  }}
                                />
                              )}
                              <div className="flex-grow-1">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div>
                                    <small className="fw-bold text-secondary d-block">
                                      {comment.userName}
                                    </small>
                                    <small
                                      className="text-muted"
                                      style={{ fontSize: "11px" }}
                                    >
                                      {timeAgo(comment.createdAt)}
                                    </small>
                                  </div>
                                  {/* Delete icon for comment author or post owner */}
                                  {(String(currentUserId) ===
                                    String(comment.userId) ||
                                    String(currentUserId) ===
                                      String(userId)) && (
                                    <button
                                      className="w-auto p-0 bg-transparent text-danger ms-2"
                                      title="Delete Comment"
                                      onClick={() =>
                                        handleDeleteComment(comment.id)
                                      }
                                      style={{ fontSize: 22 }}
                                    >
                                      <FaTrash />
                                    </button>
                                  )}
                                </div>
                                <div className="mt-2">
                                  <span className="comment-text ps-2">
                                    {comment.text || comment.content}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

Post.propTypes = {
  userName: PropTypes.string.isRequired,
  createdAt: PropTypes.string,
  isLiked: PropTypes.bool,
  isUnliked: PropTypes.bool,
  likeCount: PropTypes.number,
  unlikeCount: PropTypes.number,
  commentCount: PropTypes.number,
  content: PropTypes.string.isRequired,
  communityName: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  profilePicture: PropTypes.string,
  userId: PropTypes.string,
  id: PropTypes.number,
  onDelete: PropTypes.func, // added for parent callback
};

Post.defaultProps = {
  createdAt: new Date().toISOString(),
  isLiked: false,
  isUnliked: false,
  likeCount: 0,
  unlikeCount: 0,
  commentCount: 0,
  imageUrl: "",
};
