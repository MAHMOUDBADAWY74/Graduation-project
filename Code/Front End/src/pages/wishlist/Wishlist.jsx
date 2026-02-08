import { useSelector, useDispatch } from "react-redux";
import { clearWishlist } from "../../store/wishlist/wishlistSlice";
import BookCard from "../../components/common/card/BookCard";
import "./Wishlist.css";
import { FaTrash } from "react-icons/fa";

export default function Wishlist() {
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h2>My Wishlist</h2>
        {wishlistItems.length > 0 && (
          <button
            className="clear-wishlist-btn"
            onClick={() => dispatch(clearWishlist())}
          >
            <FaTrash className="me-2" />
            Clear Wishlist
          </button>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="wishlist-empty">
          <div className="empty-icon">❤️</div>
          <h3>Your wishlist is empty</h3>
          <p>
            Add books to your wishlist by clicking the heart icon on any book
            card
          </p>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((book) => (
            <div key={book.id} className="wishlist-item">
              <BookCard item={book} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
