import { useEffect, useState, useMemo } from "react";
import InputField from "./InputField";
import "./Form.css";
import PropTypes from "prop-types";

function Form({ fields, onSubmit, resetTrigger }) {
  const [formData, setFormData] = useState({});

  const initialState = useMemo(() => {
    return fields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {});
  }, [fields]);

  useEffect(() => {
    setFormData(initialState);
  }, [initialState, resetTrigger]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="form rounded-4" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <InputField
          key={field.name}
          label={field.label}
          type={field.type}
          name={field.name}
          value={formData[field.name] || ""}
          onChange={handleChange}
          placeHolder={field.placeHolder}
          error={field.error}
        />
      ))}
      <div className="mt-2 justify-content-center d-flex align-items-center">
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
}

Form.propTypes = {
  fields: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  resetTrigger: PropTypes.number, // add this prop
};

export default Form;
