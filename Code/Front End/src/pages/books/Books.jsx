import { Suspense, lazy, useState, useEffect } from "react";
import { useFetchBooks } from "../../hooks/useFetchBooks";
import "./styles.css";
import Loader from "./../../components/common/loader/Loader";
import { useToast } from "../../hooks/useToast";

const BookCard = lazy(() => import("./../../components/common/card/BookCard"));

const Books = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { books, loading, error, totalPages } = useFetchBooks(currentPage, 12);
  const [searchInput, setSearchInput] = useState("");
  const [isPageChanging, setIsPageChanging] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchPage, setSearchPage] = useState(1);
  const [searchTotalPages, setSearchTotalPages] = useState(1);
  const { showError } = useToast();

  // Debounced search effect with pagination
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchInput.trim()) {
        setSearchLoading(true);
        setSearchError(null);
        try {
          const response = await fetch(
            `https://localhost:7159/api/Books/search?term=${encodeURIComponent(
              searchInput
            )}`
          );
          if (!response.ok) throw new Error("Search failed");
          const data = await response.json();
          setSearchResults(data.items || data);
          setSearchTotalPages(data.totalPages || 1);
        } catch {
          setSearchError("Error searching books.");
          setSearchResults([]);
          setSearchTotalPages(1);
          showError("Error searching books.");
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSearchResults([]);
        setSearchTotalPages(1);
        setSearchPage(1);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchInput, searchPage, showError]);

  // Reset search page to 1 when search input changes
  useEffect(() => {
    setSearchPage(1);
  }, [searchInput]);

  const isSearching = searchInput.trim().length > 0;
  const booksToDisplay = isSearching ? searchResults || [] : books;
  const page = isSearching ? searchPage : currentPage;
  const total = isSearching ? searchTotalPages : totalPages;

  const handlePageChange = (newPage) => {
    if (isPageChanging || newPage < 1 || newPage > total) return;
    setIsPageChanging(true);
    if (isSearching) {
      setSearchResults(null); // Clear previous search results for loading state
      setSearchPage(newPage);
    } else {
      setCurrentPage(newPage);
      // Optionally clear books if you want to show loading state
      // This requires useFetchBooks to handle null gracefully
      // setBooks(null); // Uncomment if you want to clear books
    }
    setTimeout(() => {
      setIsPageChanging(false);
    }, 1000);
  };

  return (
    <div>
      {/* === Hero Section with Search === */}
      <section
        className="text-center text-white hero d-flex align-items-center justify-content-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1512820790803-83ca734da794")',
          backgroundSize: "cover",

          backgroundPosition: "center",
          height: "300px",
          position: "relative",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            padding: "30px",
            borderRadius: "8px",
            backdropFilter: "blur(4px)",
          }}
        >
          <h3 className="mb-4 ">
            {`Let's go to start your journey with your books!`}
          </h3>
          <form>
            <input
              type="text"
              className="input-field"
              placeholder="Search for a book..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ maxWidth: "400px", margin: "0 auto" }}
            />
          </form>
        </div>
      </section>

      {/* === Control Bar: Filter and Pagination UI === */}
      <div className="container gap-3 p-3 d-flex flex-column flex-md-row justify-content-between align-items-center bg-light border-bottom">
        {/* Filter by Category */}
        <div className="gap-2 d-flex align-items-center">
          <label htmlFor="category" className="mb-0 fw-semibold">
            Filter by:
          </label>
          <select
            name="category"
            id="category"
            className="form-select"
            style={{ width: "200px" }}
          >
            <option value="All">All</option>
            <option value="Science">Science</option>
            <option value="Drama">Drama</option>
            <option value="Sport">Sport</option>
          </select>
        </div>

        {/* Pagination Controls */}
        <nav>
          <ul className="gap-1 mb-0 pagination">
            {/* Previous Button */}
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || isPageChanging}
              >
                &laquo;
              </button>
            </li>
            {/* Dynamic Pages */}
            {(() => {
              const startPage = Math.max(page - 2, 1);
              const endPage = Math.min(page + 2, total);
              const pages = [];
              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <li
                    key={i}
                    className={`page-item ${page === i ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(i)}
                      disabled={isPageChanging}
                    >
                      {i}
                    </button>
                  </li>
                );
              }
              return pages;
            })()}
            {/* Ellipsis if there are more pages */}
            {page + 2 < total && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
            {/* Next Button */}
            <li className={`page-item ${page === total ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === total || isPageChanging}
              >
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* === Books Grid (Cards) === */}
      <div
        className="container my-4 position-relative"
        style={{ height: "100%", minHeight: "600px" }}
      >
        {(loading || searchLoading) && <Loader />}
        {error || searchError ? (
          <p>Error loading books.</p>
        ) : booksToDisplay.length === 0 ? (
          <p className="text-center">No books found.</p>
        ) : (
          <div className="flex-wrap gap-4 mx-auto d-flex ">
            <Suspense fallback={<Loader />}>
              {booksToDisplay.map((book) => (
                <div
                  key={book.id}
                  className="mx-auto mb-4 "
                  style={{ width: "260px" }}
                >
                  <BookCard item={book} />
                </div>
              ))}
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;
