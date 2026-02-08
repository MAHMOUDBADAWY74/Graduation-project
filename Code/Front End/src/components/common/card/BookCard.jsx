import PropTypes from "prop-types";
import "../../../styles/global.css";
import "./BookCard.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../store/wishlist/wishlistSlice";

export default function BookCard({ item }) {
  const { title, author, id, cover, newCover } = item;
  const { id: userId } = useSelector((state) => state.auth);
  const wishlist = useSelector((state) => state.wishlist.items);
  const isInWishlist = wishlist.some((book) => book.id === id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (isInWishlist) {
      dispatch(removeFromWishlist(id));
    } else {
      dispatch(addToWishlist(item));
    }
  };

  return (
    <div className="border-0 book-card-responsive card move-up">
      <div className="img-container-responsive position-relative">
        <button
          className="wishlist-btn"
          onClick={handleWishlist}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isInWishlist ? (
            <FaHeart className="wishlist-icon active" />
          ) : (
            <FaRegHeart className="wishlist-icon" />
          )}
        </button>
        <img
          src={
            cover
              ? `https://localhost:7159/images/${cover}`
              : `https://www.gutenberg.org/cache/epub/${id}/pg${id}.cover.medium.jpg`
          }
          alt={title}
          loading="lazy"
          className="rounded-3 book-img-responsive"
        />
      </div>
      <div className="book-title-responsive">{title}</div>
      <p className="book-author-responsive d-none d-md-block">{author}</p>
      <div className="gap-2 mt-2 buttons-container d-flex justify-content-between">
        <button
          className="button button-primary book-btn-responsive"
          onClick={() => navigate(`/book/${id}`)}
        >
          Details
        </button>
        <button
          className="button button-second book-btn-responsive"
          onClick={() => navigate(`/bookReading/${userId}/${id}`)}
        >
          Read
        </button>
      </div>
    </div>
  );
}

BookCard.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    author: PropTypes.string,
    cover: PropTypes.string,
    newCover: PropTypes.string,
  }).isRequired,
};
