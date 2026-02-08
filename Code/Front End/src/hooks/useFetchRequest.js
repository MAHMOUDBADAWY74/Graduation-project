import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
export function useFetchRequest() {
  const [error, setError] = useState(null);
  const [requests, setRequests] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://localhost:7159/api/Exchange`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRequests(response.data);
        setError(null);
      } catch (error) {
        setError(error);
        setRequests(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  return { requests, loading, error };
}
