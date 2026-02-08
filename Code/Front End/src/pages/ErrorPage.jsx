import { Container } from "react-bootstrap";
import { Link, useRouteError } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <FaExclamationTriangle
          className="mb-4 text-warning"
          style={{ fontSize: "5rem" }}
        />
        <h1 className="mb-3 display-1 fw-bold text-danger">
          {error.status || "404"}
        </h1>
        <h2 className="mb-3 fs-1 text-secondary">
          {error.statusText || "Page Not Found"}
        </h2>
        <p className="mb-4 fs-5 text-muted">
          Oops! Something went wrong. The page you&apos;re looking for might
          have been removed or is temporarily unavailable.
        </p>
        <Link
          to="/home"
          className="px-4 py-2 btn btn-primary btn-lg"
          style={{
            transition: "all 0.3s ease",
            borderRadius: "8px",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          Return to Home
        </Link>
      </div>
    </Container>
  );
}
