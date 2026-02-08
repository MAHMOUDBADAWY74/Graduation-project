import { useParams } from "react-router-dom";
import styles from "./Book.module.css"; // Importing the CSS module
import BookSlider from "./../book-slider/BookSlider";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFetchBook } from "../../../hooks/useFetchBook";
import Loader from "../loader/Loader";
import { useEffect, useState } from "react";

const Book = () => {
  const { id } = useParams();
  const { id: userId } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { book, loading, error } = useFetchBook(id);
  const [recommends, setRecommends] = useState([]);

  const fetchRecommendations = async (title) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: title }),
      });
      if (!response.ok) throw new Error("Failed to fetch recommendations");
      const data = await response.json();
      setRecommends(data);
    } catch (error) {
      setRecommends([]);
      console.error("Error fetching recommendations:", error);
    }
  };

  useEffect(() => {
    if (book && book.title) {
      fetchRecommendations(book.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book && book.title]);

  if (loading) return <Loader />;
  if (error) return <p className=" text-danger"> {error}</p>;
  if (!book) return <p style={{ textAlign: "center" }}>Book not found.</p>;

  return (
    <main>
      <div className={styles.bookDetailsCard} data-aos="fade-up">
        <div>
          <img
            src={
              book.cover
                ? `https://localhost:7159/images/${book.cover}`
                : `https://www.gutenberg.org/cache/epub/${id}/pg${id}.cover.medium.jpg`
            }
            alt={book.title}
            className={styles.bookCover}
            data-aos="zoom-in"
          />
          <div className="gap-3 pt-3 d-flex justify-content-center ">
            <a
              className="button button-second"
              href={`https://www.gutenberg.org/ebooks/${id}.epub3.images`}
            >
              Download
            </a>
            <button
              className="button button-primary"
              onClick={() => navigate(`/bookReading/${userId}/${id}`)}
            >
              Read
            </button>
          </div>
        </div>
        <div className={styles.bookDetails}>
          <div>
            <h2>{book.title}</h2>
            <p>
              <strong>Author:</strong> {book.author}
            </p>
            <p>
              <strong>Category:</strong> {book.category}
            </p>
            <p>
              <strong>Rating:</strong> ⭐ {book.rate}
            </p>
          </div>
          <div data-aos="fade-left" data-aos-delay="300">
            <h4>Summary</h4>
            <p style={{ textAlign: "justify" }}>{book.summary}</p>
          </div>
        </div>
      </div>
      <section className="container">
        <BookSlider books={recommends} />
      </section>
    </main>
  );
};

export default Book;
