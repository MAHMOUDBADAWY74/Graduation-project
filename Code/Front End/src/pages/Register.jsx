import axios from "axios";
import { useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { login } from "../store/Auth/authSlice";
import Joi from "joi";

const registerSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(2).max(30).required(),
  username: Joi.string().alphanum().min(3).max(20).required(),
  gender: Joi.string().valid("male", "female").required(),
  dateOfBirth: Joi.date().less("now").required(),
});

export default function Register() {
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    username: "",
    gender: "",
    dateOfBirth: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = registerSchema.validate(user, { abortEarly: false });
    if (error) {
      showError(error.details[0].message);
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post(
        "https://localhost:7159/api/Account/Register",
        user
      );

      showSuccess("Registered Successfully!");
      dispatch(login(response.data));

      setUser({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        username: "",
        gender: "",
        dateOfBirth: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.log(error.response);
      showError(error.response?.data || "Registration Failed!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="overflow-hidden login justify-content-center align-items-center">
      <Form className="p-5 mx-auto form-container" onSubmit={handleSubmit}>
        <p className="mb-4 text-center fw-bold fs-4">Create New Account</p>

        <Form.Group className="mb-4" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            value={user.email}
            onChange={handleChange}
            required
            className="form-control"
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            name="firstName"
            type="text"
            placeholder="Enter your first name"
            value={user.firstName}
            onChange={handleChange}
            required
            className="form-control"
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            name="lastName"
            type="text"
            placeholder="Enter your last name"
            value={user.lastName}
            onChange={handleChange}
            required
            className="form-control"
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Username</Form.Label>
          <Form.Control
            name="username"
            type="text"
            placeholder="Enter a username"
            value={user.username}
            onChange={handleChange}
            required
            className="form-control"
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Gender</Form.Label>
          <Form.Select
            name="gender"
            value={user.gender}
            onChange={handleChange}
            required
            className="form-control"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            name="dateOfBirth"
            type="date"
            placeholder="Select your date of birth"
            value={user.dateOfBirth}
            onChange={handleChange}
            required
            className="form-control"
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            type="password"
            placeholder="Enter your Password"
            value={user.password}
            onChange={handleChange}
            required
            className="form-control"
          />
        </Form.Group>

        <Button
          className="w-100 btn-primary"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner
                animation="border"
                size="sm"
                role="status"
                className="me-2"
              />
              Loading...
            </>
          ) : (
            "Register now"
          )}
        </Button>

        <p className="mt-4 text-center">
          <span className="text-black-50">{`Already have an account?`}</span>{" "}
          <Link to="/login" className="text-primary">
            Login now
          </Link>
        </p>
      </Form>

      <div className="d-xl-block d-none">
        <img src="/src/assets/forms.jpg" alt="" className="" />
      </div>
    </div>
  );
}
