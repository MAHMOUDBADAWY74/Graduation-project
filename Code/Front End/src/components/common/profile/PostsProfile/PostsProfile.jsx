import { useEffect, useState } from "react";
import AddPost from "../../community/add-post/AddPost";
import Post from "../../community/post/Post";
import "./styles.css";
import { useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import { useToast } from "../../../../hooks/useToast";

export default function PostsProfile() {
  const [isOpen, setIsOpen] = useState(false); // Toggle AddPost form
  const { profile, me } = useOutletContext() || {};
  const { token } = useSelector((state) => state.auth);
  const [communityType, setCommunityType] = useState("");
  const [communityTypes, setCommunityTypes] = useState([]);
  const { showError } = useToast();

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

  const posts = Array.isArray(profile?.posts) ? profile.posts : [];
  return (
    <div className="community-content">
      <div className="py-2 container-fluid">
        {/* <div className="mb-4 post-form-container position-relative"></div> */}

        <div className="mx-auto posts-container row flex-column position-relative">
          {me && (
            <button
              type="button"
              className={`btn btn-primary rounded-pill new-post-btn ${
                isOpen ? "active rotate" : ""
              }`}
              onClick={() => setIsOpen((prev) => !prev)}
              style={{ width: "fit-content" }}
            >
              New ➕
            </button>
          )}
          {isOpen && (
            <AddPost
              communityType={communityType}
              communityTypes={communityTypes}
              setCommunityType={setCommunityType}
              setCommunityTypes={setCommunityTypes}
            />
          )}{" "}
          <div className={isOpen ? "" : "pt-5"}>
            {posts.length > 0 ? (
              posts.map((post, index) => <Post key={index} {...post} />)
            ) : (
              <div className="text-center text-muted">No posts found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
    //   </div>
  );
}
