import { useState } from "react";
import { Offcanvas, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { FaBook, FaUser, FaUsers } from "react-icons/fa";
import { MdInsights } from "react-icons/md";
import {
  FiMenu,
  FiChevronLeft,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import "./AdminSidebar.css";

export default function AdminSidebar() {
  const [show, setShow] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // for desktop
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null); // for mobile
  const location = useLocation();

  const menuItems = [
    {
      label: "Books",
      icon: <FaBook className="me-2" />,
      key: "books",
      subItems: [
        { path: "/admin/addbook", label: "Add Book" },
        { path: "/admin/managebook", label: "Manage Books" },
      ],
    },
    {
      label: "Users",
      icon: <FaUser className="me-2" />,
      key: "users",
      subItems: [{ path: "/admin/manageusers", label: "Manage Users" }],
    },
    {
      label: "Community",
      icon: <FaUsers className="me-2" />,
      key: "community",
      subItems: [
        { path: "/admin/addcommunity", label: "Add Community" },
        { path: "/admin/managecommunity", label: "Manage Community" },
      ],
    },
    {
      label: "System Insights",
      icon: <MdInsights className="me-2" />,
      key: "insights",
      subItems: [{ path: "/admin/admindashboard", label: "System Insights" }],
    },
  ];

  // Helper to check if any subitem is active
  const isSubItemActive = (subItems) =>
    subItems.some((item) => location.pathname === item.path);

  return (
    <div>
      {/* Mobile Menu Toggle Button */}
      <button
        className="mobile-menu-btn d-lg-none"
        onClick={() => setShow(true)}
        aria-label="Toggle menu"
      >
        <FiMenu size={24} />
      </button>

      {/* Desktop Sidebar */}
      <div
        className={`pt-3 bg-white shadow-lg desktop-sidebar d-none d-lg-flex flex-column vh-100 position-fixed ${
          isCollapsed ? "collapsed" : ""
        }`}
      >
        <div className="px-3 mb-3 d-flex justify-content-end">
          <button
            className="collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <FiChevronLeft className={`${isCollapsed ? "rotate-180" : ""}`} />
          </button>
        </div>
        <Nav className="flex-column">
          {menuItems.map((item) => (
            <div key={item.key}>
              <div
                className={`px-3 py-3 sideBarItem d-flex align-items-center border-bottom border-1 text-decoration-none ${
                  isSubItemActive(item.subItems) ? "active" : ""
                }`}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setOpenDropdown(openDropdown === item.key ? null : item.key)
                }
              >
                <span className="icon">{item.icon}</span>
                <span className={`menu-text ${isCollapsed ? "d-none" : ""}`}>
                  {item.label}
                </span>
                {!isCollapsed && (
                  <span className="ms-auto">
                    {openDropdown === item.key ? (
                      <FiChevronDown />
                    ) : (
                      <FiChevronRight />
                    )}
                  </span>
                )}
              </div>
              {/* Dropdown subitems */}
              {openDropdown === item.key && !isCollapsed && (
                <div className="ps-4">
                  {item.subItems.map((sub) => (
                    <Nav
                      key={sub.path}
                      as={Link}
                      to={sub.path}
                      className={`px-3 py-2 sideBarItem d-flex align-items-center text-decoration-none ${
                        location.pathname === sub.path ? "active" : ""
                      }`}
                    >
                      <span className="menu-text">{sub.label}</span>
                    </Nav>
                  ))}
                </div>
              )}
            </div>
          ))}
        </Nav>
      </div>

      {/* Main Content Wrapper */}
      <div className={`main-content ${isCollapsed ? "expanded" : ""}`}></div>

      {/* Mobile Sidebar */}
      <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        backdrop="static"
        className="mobile-sidebar"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {menuItems.map((item) => (
              <div key={item.key}>
                <div
                  className={`px-3 py-3 sideBarItem d-flex align-items-center text-decoration-none ${
                    isSubItemActive(item.subItems) ? "active" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setOpenMobileDropdown(
                      openMobileDropdown === item.key ? null : item.key
                    )
                  }
                >
                  <span className="icon">{item.icon}</span>
                  <span className="menu-text">{item.label}</span>
                  <span className="ms-auto">
                    {openMobileDropdown === item.key ? (
                      <FiChevronDown />
                    ) : (
                      <FiChevronRight />
                    )}
                  </span>
                </div>
                {openMobileDropdown === item.key && (
                  <div className="ps-4">
                    {item.subItems.map((sub) => (
                      <Nav
                        key={sub.path}
                        as={Link}
                        to={sub.path}
                        className={`px-3 py-2 sideBarItem d-flex align-items-center text-decoration-none ${
                          location.pathname === sub.path ? "active" : ""
                        }`}
                        onClick={() => setShow(false)}
                      >
                        <span className="menu-text">{sub.label}</span>
                      </Nav>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}
