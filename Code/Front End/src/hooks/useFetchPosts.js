import { useEffect, useState, useCallback } from "react";

export function useFetchPosts(all, communityId, token) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const url = all
        ? `https://localhost:7159/api/Community/all-posts?pageNumber=1&pageSize=50`
        : `https://localhost:7159/api/Community/${communityId}/posts`;

      const response = await fetch(url, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [all, communityId, token]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refetch: fetchPosts };
}
