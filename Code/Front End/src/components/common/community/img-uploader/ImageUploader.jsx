import PropTypes from "prop-types";
import { FaCamera } from "react-icons/fa"; // أيقونة الكاميرا
import "./styles.css";

const ImageUploader = ({ setImages }) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newImage = {
      id: URL.createObjectURL(file),
      file,
    };

    // استبدال الصورة الحالية
    setImages([newImage]);
  };

  return (
    <div className="gap-2 image-uploader-container d-flex flex-column align-items-center">
      <label
        className="gap-2 px-3 py-2 m-0 shadow-sm upload-button d-flex align-items-center justify-content-center rounded-pill"
        style={{
          background: "var(--color-bg-beige)",
          border: "1px solid var(--color-card-hover)",
          cursor: "pointer",
          transition: "background 0.2s",
        }}
      >
        <FaCamera size={20} style={{ color: "var(--color-brand)" }} />
        {/* <span style={{ color: "var(--color-brand)", fontWeight: 500, fontSize: 15 }}>Upload Image</span> */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </label>
    </div>
  );
};

ImageUploader.propTypes = {
  images: PropTypes.array.isRequired,
  setImages: PropTypes.func.isRequired,
};

export default ImageUploader;
