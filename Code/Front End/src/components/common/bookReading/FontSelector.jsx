import PropTypes from "prop-types";
import "./FontSelector.css";

export function FontSelector({ customFonts, fontFamily, onFontChange }) {
  return (
    <select
      value={fontFamily}
      onChange={(e) => onFontChange(e.target.value)}
      className="bookreader-font-selector"
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

FontSelector.propTypes = {
  customFonts: PropTypes.array.isRequired,
  fontFamily: PropTypes.string.isRequired,
  onFontChange: PropTypes.func.isRequired,
};
