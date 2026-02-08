import axios from "axios";
import { useEffect, useState } from "react";

export function useFetchBook(id) {
  const [error, setError] = useState(null);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://localhost:7159/api/Books/${id}`
        );
        setBook(response.data);
        setError(null);
      } catch (error) {
        setError(error);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  return { book, loading, error };
}
