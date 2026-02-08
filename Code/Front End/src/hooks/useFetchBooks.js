import { useState, useEffect } from "react";

export const useFetchBooks = (currentPage, pageSize) => {
  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://localhost:7159/api/Books/paginated?pageIndex=${currentPage}&pageSize=${pageSize}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        const pages = data.totalCount / pageSize;
        setTotalPages(pages);
        setBooks(data.books);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentPage, pageSize]);

  return { books, loading, error, totalPages };
};
