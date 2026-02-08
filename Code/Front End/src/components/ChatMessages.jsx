import PropTypes from "prop-types";
import Loader from "./common/loader/Loader";
import { useSelector } from "react-redux";

const ChatMessages = ({ messages, loading = false }) => {
  const { id } = useSelector((state) => state.auth);
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-3 chat-messages-list">
      {(!Array.isArray(messages) || messages.length === 0) && (
        <div className="mt-5 text-center text-muted">No messages yet</div>
      )}
      {Array.isArray(messages) &&
        messages.map((msg) => {
          const isOwn = String(msg.senderId) === String(id);
          return (
            <div
              key={msg.id}
              className={`mb-3 d-flex ${
                isOwn ? "justify-content-end" : "justify-content-start"
              }`}
            >
              <div
                className={`chat-bubble p-3 shadow-sm rounded-4 position-relative ${
                  isOwn
                    ? " align-self-end my-message"
                    : " align-self-start user-message"
                }`}
                style={{
                  maxWidth: "70%",
                  minWidth: "80px",
                  borderTopRightRadius: isOwn ? 0 : 16,
                  borderTopLeftRadius: isOwn ? 16 : 0,
                  borderBottomRightRadius: 16,
                  borderBottomLeftRadius: 16,
                }}
              >
                <div className="mb-1 fw-bold small" style={{ opacity: 0.8 }}>
                  {isOwn ? "You" : msg.senderName}
                </div>
                <div style={{ wordBreak: "break-word" }}>{msg.text}</div>
                <div
                  className="mt-2 text-muted small text-end"
                  style={{ fontSize: 12, opacity: 0.7 }}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

ChatMessages.propTypes = {
  messages: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};

export default ChatMessages;
