// src/BookReaderFeatures.jsx
import PropTypes from "prop-types";
import { HighlightColorPicker } from "./HighlightFeatures";
import { FontSelector } from "./FontSelector";
import "./BookReaderFeatures.css";
import { MdLightMode, MdDarkMode, MdFormatColorFill } from "react-icons/md";

export function BookReaderFeatures(props) {
  const {
    theme,
    handleThemeChange,
    customFonts,
    fontFamily,
    handleFontChange,
    setShowSidebar,
    highlightColors,
    highlightColor,
    setHighlightColor,
  } = props;

  return (
    <div className="bookreader-features-bar">
      {/* Theme buttons */}
      <button
        onClick={() => handleThemeChange("light")}
        className={`bookreader-btn${theme === "light" ? " active-light" : ""}`}
        title="Light Mode"
        style={{ display: "flex", alignItems: "center", gap: 4 }}
      >
        <MdLightMode size={18} /> Light
      </button>
      <button
        onClick={() => handleThemeChange("dark")}
        className={`bookreader-btn${theme === "dark" ? " active-dark" : ""}`}
        title="Dark Mode"
        style={{ display: "flex", alignItems: "center", gap: 4 }}
      >
        <MdDarkMode size={18} /> Dark
      </button>
      <FontSelector
        customFonts={customFonts}
        fontFamily={fontFamily}
        onFontChange={handleFontChange}
      />
      <button
        onClick={() => setShowSidebar((v) => !v)}
        className="bookreader-btn highlight"
        title="Show Highlights"
        style={{ display: "flex", alignItems: "center", gap: 4 }}
      >
        <MdFormatColorFill size={18} /> Highlights
      </button>
      <HighlightColorPicker
        highlightColors={highlightColors}
        highlightColor={highlightColor}
        setHighlightColor={setHighlightColor}
      />
    </div>
  );
}

BookReaderFeatures.propTypes = {
  theme: PropTypes.string.isRequired,
  handleThemeChange: PropTypes.func.isRequired,
  customFonts: PropTypes.array.isRequired,
  fontFamily: PropTypes.string.isRequired,
  handleFontChange: PropTypes.func.isRequired,
  setShowSidebar: PropTypes.func.isRequired,
  highlightColors: PropTypes.array.isRequired,
  highlightColor: PropTypes.string.isRequired,
  setHighlightColor: PropTypes.func.isRequired,
};
