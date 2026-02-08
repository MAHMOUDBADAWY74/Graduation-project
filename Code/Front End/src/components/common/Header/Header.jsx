import { Container, Nav, Navbar, Dropdown } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../store/Auth/authSlice";
import {
  addNotification,
  clearNotifications,
} from "../../../store/notification/notificationSlice";
import logo from "/src/assets/Group 4.svg";
import { FaUserCircle, FaHeart } from "react-icons/fa";
import { FiBell } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
// import { timeAgo } from "../../../utils/util";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoggedIn, token, id, profilePicture, userName } = useSelector(
    (state) => state.auth
  );
  const notifications = useSelector(
    (state) => state.notification.notifications
  );
  const [hasNotification, setHasNotification] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const connectionRef = useRef(null);

  const wishlistItems = useSelector((state) => state.wishlist.items);

  useEffect(() => {
    if (!isLoggedIn) return;

    // Fetch latest notifications on mount
    fetch("https://localhost:7159/api/Community/notifications/latest", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          data.forEach((notif) => dispatch(addNotification(notif)));
          setHasNotification(true);
        }
      })
      .catch(() => {});

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7159/notificationHub", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveNotification", (notification) => {
      setHasNotification(true);
      dispatch(addNotification(notification));
    });

    connection
      .start()
      .then(() => console.log("SignalR Connected Successfully"))
      .catch((err) => console.error("SignalR Connection Error:", err));

    connectionRef.current = connection;

    return () => {
      connection.stop();
    };
  }, [isLoggedIn, token]);

  // للتأكد من تحديث الـ notifications
  useEffect(() => {
    console.log("Updated notifications:", notifications);
  }, [notifications]);

  const handleNotificationClick = () => {
    setHasNotification(false);
    setShowDropdown((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearNotifications());
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <>
      <Navbar expand="lg" className="shadow-sm header fixed-top bg-light">
        <Container>
          <Navbar.Brand>
            <Link to="/home">
              <img
                src={logo}
                alt="logo"
                style={{ height: "40px", color: "var(--color-brand)" }}
              />
            </Link>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link
                as={Link}
                to="/home"
                className={isActive("/home") ? "active" : ""}
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/about-us"
                className={isActive("/about-us") ? "active" : ""}
              >
                About Us
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/contact-us"
                className={isActive("/contact-us") ? "active" : ""}
              >
                Contact Us
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/bookSwap"
                className={isActive("/bookSwap") ? "active" : ""}
              >
                Book Swap
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/community"
                className={isActive("/community") ? "active" : ""}
              >
                Community
              </Nav.Link>

              {isLoggedIn && (
                <>
                  <Nav.Item
                    style={{ position: "relative", marginRight: "10px" }}
                  >
                    <span style={{ position: "relative" }}>
                      <FiBell
                        size={22}
                        style={{ cursor: "pointer" }}
                        onClick={handleNotificationClick}
                      />
                      {hasNotification && (
                        <span
                          style={{
                            position: "absolute",
                            top: 2,
                            right: 2,
                            width: 10,
                            height: 10,
                            background: "#ff4444",
                            borderRadius: "50%",
                            border: "2px solid #fff",
                            zIndex: 2,
                          }}
                        ></span>
                      )}
                    </span>
                    {showDropdown && notifications.length > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: 30,
                          minWidth: 300,
                          background: "#fff",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                          borderRadius: 8,
                          zIndex: 1000,
                          padding: 0,
                          maxHeight: 400,
                          overflowY: "auto",
                        }}
                        onMouseLeave={() => setShowDropdown(false)}
                      >
                        <div
                          style={{
                            padding: "10px 16px",
                            borderBottom: "1px solid #eee",
                            fontWeight: 600,
                          }}
                        >
                          Notifications
                        </div>
                        {notifications.map((notification, idx) => (
                          <div
                            key={notification.id || idx}
                            style={{
                              padding: "12px 16px",
                              borderBottom: "1px solid #f5f5f5",
                              fontSize: 14,
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              background:
                                notification.notificationType === "PostRejected"
                                  ? "#fff3f3"
                                  : notification.notificationType ===
                                    "PostAccepted"
                                  ? "#f3fff3"
                                  : "#fff",
                            }}
                          >
                            <div
                              style={{ width: 40, height: 40, flexShrink: 0 }}
                            >
                              <img
                                src={`https://localhost:7159${notification.actorProfilePicture}`}
                                alt={notification.actorUserName}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                  border:
                                    notification.notificationType ===
                                    "PostRejected"
                                      ? "2px solid #e57373"
                                      : notification.notificationType ===
                                        "PostAccepted"
                                      ? "2px solid #4caf50"
                                      : "2px solid #eee",
                                }}
                              />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  fontWeight: 600,
                                  color:
                                    notification.notificationType ===
                                    "PostRejected"
                                      ? "#e57373"
                                      : notification.notificationType ===
                                        "PostAccepted"
                                      ? "#388e3c"
                                      : undefined,
                                }}
                              >
                                {notification.message}
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  color: "#666",
                                  marginTop: 4,
                                }}
                              >
                                <span style={{ fontWeight: 500 }}>
                                  {notification.actorUserName}
                                </span>
                                {notification.timeAgo
                                  ? ` • ${notification.timeAgo}`
                                  : ""}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Nav.Item>

                  <Nav.Item
                    style={{ position: "relative", marginRight: "15px" }}
                  >
                    <Link to="/wishlist" style={{ textDecoration: "none" }}>
                      <span style={{ position: "relative" }}>
                        <FaHeart
                          size={20}
                          style={{ cursor: "pointer", color: "#e74c3c" }}
                        />
                        {wishlistItems.length > 0 && (
                          <span
                            style={{
                              position: "absolute",
                              top: -8,
                              right: -8,
                              width: 18,
                              height: 18,
                              background: "#6c63ff",
                              borderRadius: "50%",
                              border: "2px solid #fff",
                              zIndex: 2,
                              fontSize: "10px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          >
                            {wishlistItems.length}
                          </span>
                        )}
                      </span>
                    </Link>
                  </Nav.Item>
                </>
              )}

              {!isLoggedIn ? (
                <Dropdown align="end">
                  <Dropdown.Toggle id="dropdown-basic">Account</Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/login">
                      Login
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/register">
                      Sign Up
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="light"
                    id="dropdown-user"
                    className="bg-transparent border-0 d-flex align-items-center"
                    style={{ padding: "6px 10px", borderRadius: "20px" }}
                  >
                    {profilePicture ? (
                      <img
                        src={`https://localhost:7159/${profilePicture}`}
                        alt="Profile"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "2px solid var(--color-card-bg)",
                          boxShadow: "0 2px 4px var(--color-shadow)",
                        }}
                      />
                    ) : (
                      <FaUserCircle
                        size={32}
                        style={{ color: "var(--color-brand)" }}
                      />
                    )}
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    style={{
                      minWidth: "200px",
                      padding: "8px 0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px var(--color-shadow)",
                      border: "1px solid var(--color-field-beige)",
                      backgroundColor: "var(--color-card-bg)",
                    }}
                  >
                    <div
                      className="px-3 py-2 mb-2"
                      style={{
                        borderBottom: "1px solid var(--color-field-beige)",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "600",
                          color: "var(--color-text-dark)",
                        }}
                      >
                        {userName || "User"}
                      </div>
                      <div
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--color-accent)",
                        }}
                      >
                        View your profile
                      </div>
                    </div>
                    <Dropdown.Item
                      as={Link}
                      to={`/profile/${id}`}
                      className="px-3 py-2 d-flex align-items-center"
                      style={{ color: "var(--color-text-dark)" }}
                    >
                      <FaUserCircle
                        className="me-2"
                        size={16}
                        style={{ color: "var(--color-brand)" }}
                      />
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={handleLogout}
                      className="px-3 py-2 d-flex align-items-center"
                      style={{ color: "var(--color-accent-hover)" }}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div style={{ paddingTop: "70px" }}></div>
    </>
  );
}
