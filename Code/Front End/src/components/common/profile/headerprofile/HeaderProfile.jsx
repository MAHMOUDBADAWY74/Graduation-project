import { Container } from "react-bootstrap";
import "./styles.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Camera } from "react-bootstrap-icons";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import axios from "axios";

export default function HeaderProfile({ profile, me }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, role } = useSelector((state) => state.auth);
  const { coverPhotoUrl, firstName, lastName, profilePhotoUrl, userId } =
    profile || {};

  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("CoverPhotoUpdate", file);
    if (file) {
      try {
        const response = await axios.put(
          "https://localhost:7159/api/Profile/cover-photo",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
      } catch (error) {
        console.log("🟩 error: ", error);
      }
    }
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("ProfilePhotoUpdate", file);
    if (file) {
      try {
        const response = await axios.put(
          "https://localhost:7159/api/Profile/profile-photo",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
      } catch (error) {
        console.log("🟩 error: ", error);
      }
    }
  };

  return (
    <div className="header-profile">
      <Container>
        <div className="container-img position-relative">
          <img
            src={
              coverPhotoUrl
                ? `https://localhost:7159/${coverPhotoUrl}`
                : "https://via.placeholder.com/300x200"
            }
            alt="Cover"
            className="w-100"
          />

          {me && (
            <div className="cover-image-overlay">
              <label htmlFor="cover-image-input" className="cover-image-button">
                <Camera size={20} />
                <span>Change Cover</span>
              </label>
              <input
                type="file"
                id="cover-image-input"
                accept="image/*"
                onChange={handleCoverImageChange}
                style={{ display: "none" }}
              />
            </div>
          )}
        </div>

        <div className="user-info">
          <div className="gap-3 d-flex">
            <div className="photo-profile position-relative">
              <img
                src={
                  profilePhotoUrl
                    ? `https://localhost:7159/${profilePhotoUrl}`
                    : "https://via.placeholder.com/120"
                }
                alt="Profile"
              />
              {me && (
                <div className="profile-image-overlay">
                  <label
                    htmlFor="profile-image-input"
                    className="profile-image-button"
                  >
                    <Camera size={16} />
                  </label>
                  <input
                    type="file"
                    id="profile-image-input"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    style={{ display: "none" }}
                  />
                </div>
              )}
            </div>
            <div className="user-details">
              <h3 className="username d-flex align-items-center justify-content-between">
                <span>
                  {firstName || lastName
                    ? `${firstName.toString().toUpperCase() || ""} ${
                        lastName.toUpperCase() || ""
                      }`.trim()
                    : "User"}
                </span>
                {!me && (
                  <button
                    className="w-auto mt-3 btn btn-primary ms-3"
                    style={{ fontSize: "0.95rem", padding: "6px 16px" }}
                    onClick={() => navigate(`/chat/${userId}`)}
                  >
                    Message
                  </button>
                )}
              </h3>
            </div>
          </div>
        </div>

        <div className="nav-profile">
          <ul>
            <li
              className={
                location.pathname.endsWith("/posts") ? "active-nav" : ""
              }
            >
              <Link to="posts">Posts</Link>
            </li>
            <li
              className={
                location.pathname.endsWith("/about") ? "active-nav" : ""
              }
            >
              <Link to="about">About</Link>
            </li>
            <li
              className={
                location.pathname.endsWith("/dashboard") ? "active-nav" : ""
              }
            >
              <Link to="dashboard">Dashboard</Link>
            </li>
            {me && (role === "Moderator" || role === "Admin") && (
              <li
                className={
                  location.pathname.endsWith("/manage") ? "active-nav" : ""
                }
              >
                <Link to="manage">Manage</Link>
              </li>
            )}
          </ul>
        </div>
        {/* {me && role === "Moderator" && (
          <button
            className="w-auto mt-3 btn btn-warning ms-3"
            style={{ fontSize: "0.95rem", padding: "6px 16px" }}
            onClick={() => navigate("/admin/managecommunity")}
          >
            Manage
          </button>
        )} */}
      </Container>
    </div>
  );
}

HeaderProfile.propTypes = {
  profile: PropTypes.shape({
    age: PropTypes.number,
    bio: PropTypes.string,
    coverPhotoUrl: PropTypes.string,
    favoriteBookTopics: PropTypes.arrayOf(PropTypes.string),
    firstName: PropTypes.string.isRequired,
    gender: PropTypes.string,
    hobbies: PropTypes.arrayOf(PropTypes.string),
    lastName: PropTypes.string.isRequired,
    posts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        content: PropTypes.string.isRequired,
        userId: PropTypes.string.isRequired,
        userName: PropTypes.string.isRequired,
      })
    ),
    profilePhotoUrl: PropTypes.string,
    userId: PropTypes.string.isRequired,
  }),
  me: PropTypes.bool,
};
