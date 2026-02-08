import "./styles.css";
import PropTypes from "prop-types";

export default function Loader({ size = 100 }) {
  const childSize = size * (4 / 5);

  return (
    <div className="loader-container">
      <div
        className="loader"
        style={{ width: `${size}px`, height: `${size}px` }}
      ></div>
      <div
        className="loader-child"
        style={{ width: `${childSize}px`, height: `${childSize}px` }}
      ></div>
    </div>
  );
}

Loader.propTypes = {
  size: PropTypes.number,
};

Loader.defaultProps = {
  size: 100,
};
