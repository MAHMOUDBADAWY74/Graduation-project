import PropTypes from "prop-types";

export default function SwapRequest({ title, author, category, copy, phone }) {
  return (
    <div>
      <h2>Swap Request</h2>
      <p>Title: {title}</p>
      <p>Author: {author}</p>
      <p>Category: {category}</p>
      <p>Copy: {copy}</p>
      <p>Phone: {phone}</p>
    </div>
  );
}

SwapRequest.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  copy: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
};
