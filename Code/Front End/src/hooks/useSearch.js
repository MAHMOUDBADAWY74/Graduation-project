import { useState } from "react";

export const useSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (query) => {
    if (!query) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://your-api.com/search?query=${encodeURIComponent(query)}`
      );

      if (!response.ok) throw new Error("Failed to fetch search results");

      const data = await response.json();
      setResults(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, search };
};
