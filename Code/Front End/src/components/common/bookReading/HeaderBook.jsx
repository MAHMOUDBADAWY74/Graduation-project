import PropTypes from "prop-types";
import styles from "./HeaderBook.module.css"; // تغيير اسم الملف إلى HeaderBook

export default function HeaderBook({
  fontSize,
  fontFamily,
  textColor,
  bgColor,
  setFontSize,
  setFontFamily,
  setTextColor,
  setBgColor,
}) {
  return (
    <div className={styles.header}>
      <h3>Customize Your Book</h3>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Font Size</h4>
        <input
          type="range"
          min="12"
          max="30"
          value={parseInt(fontSize)}
          onChange={(e) => setFontSize(`${e.target.value}px`)}
          className={styles.range}
        />
        <span>{Number(fontSize)} px</span> {/* لعرض القيمة */}
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Font Family</h4>
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
        >
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Courier New</option>
        </select>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Text Color</h4>
        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
        />
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Background Color</h4>
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
        />
      </div>
    </div>
  );
}

HeaderBook.propTypes = {
  fontSize: PropTypes.string.isRequired,
  fontFamily: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  setFontSize: PropTypes.func.isRequired,
  setFontFamily: PropTypes.func.isRequired,
  setTextColor: PropTypes.func.isRequired,
  setBgColor: PropTypes.func.isRequired,
};

// إضافة القيم الافتراضية
HeaderBook.defaultProps = {
  fontSize: "16px", // الحجم الافتراضي للخط
  fontFamily: "Arial", // العائلة الافتراضية
  textColor: "#000000", // اللون الافتراضي للنص (أسود)
  bgColor: "#ffffff",
};
