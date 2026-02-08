import PropTypes from "prop-types";

export default function Overlay({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="top-0 modal-overlay position-fixed start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1040 }}
      onClick={onClose}
    >
      <div
        className="p-3 modal-content position-relative rounded-3"
        style={{
          backgroundColor: "white",
          width: "400px",
          zIndex: 1050,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <div className="top-0 p-2 close-btn position-absolute end-0">
          <button className="btn btn-danger rounded-5" onClick={onClose}>
            X
          </button>
        </div>
      </div>
    </div>
  );
}

Overlay.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
