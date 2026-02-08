import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Post from "../components/common/community/post/Post";
import SideBar from "../components/common/community/side-bar/SideBar";
import AddPost from "../components/common/community/add-post/AddPost";
import { useFetchPosts } from "../hooks/useFetchPosts";
import { useToast } from "../hooks/useToast";
import { useParams, useNavigate } from "react-router-dom";

export default function Community() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [all, setAll] = useState(true);
  const [selectedCommunityId, setSelectedCommunityId] = useState(null); // default
  const { token } = useSelector((state) => state.auth);
  const [communityType, setCommunityType] = useState("");
  const [communityTypes, setCommunityTypes] = useState([]);
  const [localPosts, setLocalPosts] = useState([]);
  const { showError } = useToast();
  const { posts, loading, refetch } = useFetchPosts(
    all,
    selectedCommunityId || id,
    token
  );
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://localhost:7159/api/Community", {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });
        const data = await response.json();
        setCommunityTypes(data);
      } catch (error) {
        showError("Error fetching community types.");
        console.error(error);
      }
    }
    fetchData();
  }, [token]);

  useEffect(() => {
    setLocalPosts(posts);
  }, [posts]);

  const handleCommunityAction = async ({ id, action }) => {
    const community = communityTypes.find((c) => c.id === id);
    if (!community) return;
    const url = `https://localhost:7159/api/Community/${id}/${action}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`Failed to ${action}`);
      setCommunityTypes((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, isMember: action === "join" } : c
        )
      );
    } catch (error) {
      // Optionally show error toast
      // showError(`Failed to ${action} community.`);
      console.error(error);
    }
  };

  const handleDeletePost = (postId) => {
    setLocalPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <div className="gap-3 d-flex">
      <SideBar
        communityTypes={communityTypes}
        onSelectCommunity={(val) => {
          if (val && typeof val === "object" && val.action) {
            handleCommunityAction(val);
          } else if (val === null) {
            setAll(true);
            setSelectedCommunityId(null);
            navigate("/community");
          } else {
            setAll(false);
            setSelectedCommunityId(Number(val));
            navigate(`/community/${val}`);
          }
        }}
      />
      <div className="flex-grow-1 community-content">
        <div className="py-4 container-fluid">
          {/* Select Community Filter */}
          <div className="mb-3">
            <select
              className="w-auto form-select"
              value={selectedCommunityId || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  setAll(true);
                  setSelectedCommunityId(null);
                } else {
                  setAll(false);
                  setSelectedCommunityId(Number(value));
                }
              }}
            >
              <option value="">All Communities</option>
              {communityTypes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Add Post Button */}
          <div
            className="mb-4 post-form-container position-relative"
            style={{ width: "600px" }}
          >
            <button
              type="button"
              className={`btn btn-primary rounded-pill new-post-btn ${
                isOpen ? "active rotate" : ""
              }`}
              style={{ width: "fit-content" }}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              New ➕
            </button>
            <div className={`post-form-wrapper ${isOpen ? "show" : ""}`}>
              {isOpen && (
                <AddPost
                  communityType={communityType}
                  communityTypes={communityTypes}
                  setCommunityType={setCommunityType}
                  setCommunityTypes={setCommunityTypes}
                  onPostSuccess={refetch}
                  setLocalPosts={setLocalPosts}
                />
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="py-5 text-center">
              <div className="spinner-border text-primary" role="status" />
            </div>
          )}

          {/* Posts */}
          <div className="pt-5 mx-auto mx-md-0 posts-container row flex-column">
            {localPosts.map((post) => (
              <div key={post.id}>
                <Post {...post} onDelete={handleDeletePost} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* <ChatBox /> */}
    </div>
  );
}
