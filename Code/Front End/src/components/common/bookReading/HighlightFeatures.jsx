// src/HighlightFeatures.jsx
import PropTypes from "prop-types";
import "./HighlightColorPicker.css";
import { MdVisibility, MdDelete, MdClose } from "react-icons/md";

export function HighlightSidebar({
  showSidebar,
  setShowSidebar,
  highlights,
  showHighlight,
  removeHighlight,
}) {
  if (!showSidebar) return null;
  return (
    <div
      style={{
        width: 320,
        background: "#f8f9fa",
        borderRight: "1px solid #ddd",
        padding: 16,
        overflowY: "auto",
      }}
    >
      <h3>Highlights</h3>
      {highlights.length === 0 && (
        <div style={{ color: "#888" }}>No highlights yet.</div>
      )}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {highlights.map((h) => (
          <li
            key={h.cfiRange}
            style={{
              marginBottom: 16,
              background: "#fff",
              borderRadius: 6,
              boxShadow: "0 1px 4px #0001",
              padding: 8,
            }}
          >
            <div style={{ marginBottom: 4 }}>
              <span
                style={{
                  background: h.color,
                  borderRadius: 4,
                  padding: "2px 8px",
                  color: "#222",
                }}
              >
                {h.text}
              </span>
            </div>
            <button
              onClick={() => showHighlight(h.cfiRange)}
              style={{
                marginRight: 8,
                fontSize: 13,
                border: "none",
                borderRadius: 6,
                background: "#e3f2fd",
                color: "#1976d2",
                padding: "6px 14px",
                cursor: "pointer",
                boxShadow: "0 1px 2px #0001",
                transition: "background 0.2s",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <MdVisibility size={18} style={{ marginRight: 4 }} /> Show
            </button>
            <button
              onClick={() => removeHighlight(h.cfiRange)}
              style={{
                fontSize: 13,
                border: "none",
                borderRadius: 6,
                background: "#ffebee",
                color: "#c62828",
                padding: "6px 14px",
                cursor: "pointer",
                boxShadow: "0 1px 2px #0001",
                transition: "background 0.2s",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <MdDelete size={18} style={{ marginRight: 4 }} /> Remove
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={() => setShowSidebar(false)}
        style={{
          marginTop: 16,
          border: "none",
          borderRadius: 8,
          background: "#ececec",
          color: "#444",
          padding: "8px 20px",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 1px 2px #0001",
          transition: "background 0.2s",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <MdClose size={18} style={{ marginRight: 4 }} /> Close
      </button>
    </div>
  );
}

export function HighlightColorPicker({
  highlightColors,
  highlightColor,
  setHighlightColor,
}) {
  return (
    <div className="highlight-color-picker">
      {highlightColors.map((c) => (
        <button
          key={c.color}
          onClick={() => setHighlightColor(c.color)}
          className={`highlight-color-btn${
            highlightColor === c.color ? " selected" : ""
          }`}
          style={{ background: c.color }}
          title={c.name}
        />
      ))}
    </div>
  );
}

export function FontSelector({ customFonts, fontFamily, onFontChange }) {
  return (
    <select
      value={fontFamily}
      onChange={(e) => onFontChange(e.target.value)}
      style={{ padding: 6, borderRadius: 4, border: "1px solid #ccc" }}
      title="Font family"
    >
      {customFonts.map((f) => (
        <option key={f.fontFamily} value={f.fontFamily}>
          {f.name}
        </option>
      ))}
    </select>
  );
}

export function SearchBox({
  searchTerm,
  setSearchTerm,
  onSearch,
  searchResults,
  onResultClick,
}) {
  return (
    <>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
        style={{
          padding: 6,
          borderRadius: 4,
          border: "1px solid #ccc",
          width: 120,
        }}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
      <button
        onClick={onSearch}
        style={{
          padding: 6,
          borderRadius: 4,
          border: "1px solid #ccc",
        }}
      >
        Search
      </button>
      {searchResults.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: 50,
            right: 20,
            zIndex: 20,
            background: "#fff",
            color: "#222",
            border: "1px solid #ccc",
            borderRadius: 6,
            maxHeight: 300,
            overflowY: "auto",
            minWidth: 220,
          }}
        >
          <div
            style={{
              padding: 8,
              borderBottom: "1px solid #eee",
              fontWeight: 600,
            }}
          >
            Search Results
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {searchResults.map((r, i) => (
              <li
                key={i}
                style={{
                  padding: 8,
                  borderBottom: "1px solid #f0f0f0",
                  cursor: r.cfi ? "pointer" : "default",
                }}
                onClick={() => onResultClick(r.cfi)}
              >
                {r.excerpt || r.cfi || "No excerpt"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

HighlightSidebar.propTypes = {
  showSidebar: PropTypes.bool.isRequired,
  setShowSidebar: PropTypes.func.isRequired,
  highlights: PropTypes.arrayOf(
    PropTypes.shape({
      cfiRange: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
  showHighlight: PropTypes.func.isRequired,
  removeHighlight: PropTypes.func.isRequired,
};

HighlightColorPicker.propTypes = {
  highlightColors: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  highlightColor: PropTypes.string.isRequired,
  setHighlightColor: PropTypes.func.isRequired,
};

FontSelector.propTypes = {
  customFonts: PropTypes.arrayOf(
    PropTypes.shape({
      fontFamily: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  fontFamily: PropTypes.string.isRequired,
  onFontChange: PropTypes.func.isRequired,
};

SearchBox.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  searchResults: PropTypes.arrayOf(
    PropTypes.shape({
      cfi: PropTypes.string,
      excerpt: PropTypes.string,
    })
  ).isRequired,
  onResultClick: PropTypes.func.isRequired,
};
