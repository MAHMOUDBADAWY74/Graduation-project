import { useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { FiMenu, FiChevronLeft } from "react-icons/fi";
import { FaUserPlus, FaUserMinus } from "react-icons/fa";
import PropTypes from "prop-types";
import { useToast } from "../../../../hooks/useToast";
import "./styles.css";
import { useSelector } from "react-redux";

export default function SideBar({ communityTypes = [], onSelectCommunity }) {
  const [show, setShow] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { showSuccess, showError } = useToast();
  const { token } = useSelector((state) => state.auth);

  function handleJoinLeave(community, action) {
    const url = `https://localhost:7159/api/Community/${community.id}/${action}`;
    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to ${action}`);
        if (action === "join") showSuccess(`You joined ${community.name}`);
        else showSuccess(`You left ${community.name}`);
        if (typeof onSelectCommunity === "function") {
          onSelectCommunity({ id: community.id, action });
        }
      })
      .catch((error) => {
        showError(`Failed to ${action} community.`);
        console.error(error);
      });
  }

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
        className={`pt-4 bg-white shadow-lg desktop-sidebar d-none d-lg-flex flex-column vh-100  ${
          isCollapsed ? "collapsed" : ""
        }`}
      >
        <div className="px-3 mb-4 d-flex justify-content-end">
          <button
            className="collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <FiChevronLeft
              className={`${isCollapsed ? "rotate-180" : ""}`}
              size={24}
            />
          </button>
        </div>
        {/* Communities as filtration */}
        <div className="px-3 sidebar-communities">
          <ul className="list-unstyled">
            <li className="mb-3">
              <button
                className="sideBarItem w-100 d-flex align-items-center"
                onClick={() => onSelectCommunity && onSelectCommunity(null)}
              >
                {isCollapsed ? (
                  <span className="icon">🌐</span>
                ) : (
                  <>
                    <span className="icon">🌐</span>
                    <span className="menu-text">All Communities</span>
                  </>
                )}
              </button>
            </li>
            {communityTypes.length === 0 && (
              <li className="px-3 text-muted">
                <span className={isCollapsed ? "d-none" : ""}>
                  No communities
                </span>
              </li>
            )}
            {communityTypes.map((community) => (
              <li className="mb-3" key={community.id}>
                <div className="d-flex align-items-center justify-content-between">
                  <button
                    className="sideBarItem w-100 d-flex align-items-center"
                    onClick={() =>
                      onSelectCommunity && onSelectCommunity(community.id)
                    }
                    title={isCollapsed ? community.name : ""}
                  >
                    <img
                      src={`https://localhost:7159/${community.imageUrl}`}
                      alt={community.name}
                      style={{
                        width: isCollapsed ? 40 : 32,
                        height: isCollapsed ? 40 : 32,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1px solid #e2e8f0",
                        marginRight: isCollapsed ? 0 : 12,
                      }}
                    />
                    {!isCollapsed && (
                      <span className="menu-text">{community.name}</span>
                    )}
                  </button>
                  {!isCollapsed && (
                    <button
                      className="btn-side-bar join-leave-btn"
                      title={community.isMember ? "Leave" : "Join"}
                      onClick={() =>
                        handleJoinLeave(
                          community,
                          community.isMember ? "leave" : "join"
                        )
                      }
                      style={{ border: "none", backgroundColor: "transparent" }}
                    >
                      {community.isMember ? (
                        <FaUserMinus size={20} color="#b91c1c" />
                      ) : (
                        <FaUserPlus size={20} color="#2563eb" />
                      )}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        backdrop="static"
        className="mobile-sidebar"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Communities</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="list-unstyled">
            <li className="mb-3">
              <button
                className="sideBarItem w-100 d-flex align-items-center"
                onClick={() => {
                  setShow(false);
                  onSelectCommunity && onSelectCommunity(null);
                }}
              >
                <span className="icon">🌐</span>
                <span className="menu-text">All Communities</span>
              </button>
            </li>
            {communityTypes.length === 0 && (
              <li className="text-muted">No communities</li>
            )}
            {communityTypes.map((community) => (
              <li className="mb-3" key={community.id}>
                <div className="d-flex align-items-center justify-content-between">
                  <button
                    className="sideBarItem w-100 d-flex align-items-center"
                    onClick={() => {
                      setShow(false);
                      onSelectCommunity && onSelectCommunity(community.id);
                    }}
                  >
                    <img
                      src={`https://localhost:7159/${community.imageUrl}`}
                      alt={community.name}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1px solid #e2e8f0",
                        marginRight: 12,
                      }}
                    />
                    <span className="menu-text">{community.name}</span>
                  </button>
                  <button
                    className="btn-side-bar join-leave-btn"
                    onClick={() =>
                      handleJoinLeave(
                        community,
                        community.isMember ? "leave" : "join"
                      )
                    }
                    style={{ border: "none", backgroundColor: "transparent" }}
                  >
                    {community.isMember ? (
                      <FaUserMinus size={20} color="#b91c1c" />
                    ) : (
                      <FaUserPlus size={20} color="#2563eb" />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

SideBar.propTypes = {
  communityTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
      isMember: PropTypes.bool,
    })
  ),
  onSelectCommunity: PropTypes.func,
};
