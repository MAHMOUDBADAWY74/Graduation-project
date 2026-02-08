import PropTypes from "prop-types";
import "./InputField.css";

function InputField({
  label = "",
  labelRender = true,
  className = "",
  type = "text",
  name = "",
  value = "",
  placeholder = `Enter Your ${label}`,
  onChange = () => {},
  error = "",
}) {
  return (
    <div className={`input-field ${className}`}>
      {labelRender && (
        <label
          htmlFor={name} // Linking the label with the input using the name
          className="my-2 ps-2"
        >
          {label}
          {" :"}
        </label>
      )}
      <input
        id={name} // Adding an id to match the label
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={error ? "true" : "false"} // Adding aria-invalid to indicate an error
      />
      {error && (
        <p
          className="alert alert-danger"
          style={{ color: "red" }}
          aria-live="assertive"
        >
          {error}
        </p>
      )}{" "}
      {/* aria-live to announce the error immediately */}
    </div>
  );
}

export default InputField;

InputField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  labelRender: PropTypes.bool,
  className: PropTypes.string,
};
