import { useState } from "react";
import PropTypes from "prop-types";

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="input-group">
      <input
        type="text"
        className="form-control"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <span className="p-0 bg-white border-0 input-group-text">
        <button
          className="btn btn-primary d-flex align-items-center justify-content-center"
          type="button"
          onClick={handleSend}
          aria-label="Send"
          style={{ height: "38px", width: "38px", padding: 0 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-send"
            viewBox="0 0 16 16"
          >
            <path d="M15.964 0.686a.5.5 0 0 0-.65-.65l-15 6a.5.5 0 0 0 0 .928l15 6a.5.5 0 0 0 .65-.65l-2-6a.5.5 0 0 0 0-.556l2-6zM6.5 8.5v-1h7.793l-1.147 3.44L6.5 8.5zm0-1.5v-1h7.793l-1.147 3.44L6.5 7zm-1 2.5V6.5l-4.793 1.917L5.5 9.5z" />
          </svg>
        </button>
      </span>
    </div>
  );
};

ChatInput.propTypes = {
  onSend: PropTypes.func.isRequired,
};

export default ChatInput;
