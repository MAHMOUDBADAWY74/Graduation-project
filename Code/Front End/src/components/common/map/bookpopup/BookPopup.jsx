// BookPopup.jsx
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { timeAgo } from "../../../../utils/util";

function BookPopup({
  title,
  author,
  onAccept,
  senderProfilePhoto,
  senderUserId,
  senderUserName,
  requestDate,
}) {
  return (
    <div
      style={{
        textAlign: "left",
        width: "250px",
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "12px",
          borderBottom: "1px solid #eee",
          paddingBottom: "8px",
        }}
      >
        <Link to={`/profile/${senderUserId}`}>
          <img
            src={`https://localhost:7159${senderProfilePhoto}`}
            alt={senderUserName}
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              marginRight: "12px",
              objectFit: "cover",
              border: "2px solid #fff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
        </Link>
        <div>
          <Link
            to={`/profile/${senderUserId}`}
            style={{ textDecoration: "none" }}
          >
            <span
              style={{
                fontSize: "1em",
                fontWeight: "600",
                color: "#333",
                display: "block",
              }}
            >
              {senderUserName}
            </span>
          </Link>
          {requestDate && (
            <span
              style={{
                fontSize: "0.8em",
                color: "#777",
                display: "block",
              }}
            >
              {timeAgo(requestDate)}
            </span>
          )}
        </div>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <h6
          style={{
            marginBottom: "5px",
            fontWeight: "bold",
            fontSize: "1.1em",
            color: "#333",
          }}
        >
          {title}
        </h6>
        <p
          style={{
            margin: "0 0 10px",
            fontSize: "0.9em",
            color: "#555",
          }}
        >
          By {author}
        </p>
      </div>

      <button
        className="btn btn-success"
        style={{
          width: "100%",
          borderRadius: "6px",
          fontWeight: "500",
          padding: "8px 12px",
        }}
        onClick={onAccept}
      >
        Accept Exchange
      </button>
    </div>
  );
}

BookPopup.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  onAccept: PropTypes.func.isRequired,
  senderProfilePhoto: PropTypes.string,
  senderUserId: PropTypes.string,
  senderUserName: PropTypes.string,
  requestDate: PropTypes.string,
};

export default BookPopup;
