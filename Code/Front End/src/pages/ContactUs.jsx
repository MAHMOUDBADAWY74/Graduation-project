import { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";

export default function ContactUs() {
  const [result, setResult] = useState("");
  const [variant, setVariant] = useState("info");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending...");
    setVariant("info");

    const formData = new FormData(event.target);
    formData.append("access_key", "102ade3c-6c59-488c-825c-c8eeaac4ebd4");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult("Form Submitted Successfully! ✅");
        setVariant("success");
        event.target.reset();
      } else {
        console.error("Error:", data);
        setResult(data.message || "Something went wrong! ❌");
        setVariant("danger");
      }
    } catch (error) {
      console.error("Network error:", error);
      setResult("Network Error. Please try again later. ❌");
      setVariant("danger");
    }
  };

  return (
    <div className="py-5 contact">
      <Container className="d-flex justify-content-between align-items-center">
        <Form onSubmit={onSubmit} className="p-5 mx-auto mt-4 form-container">
          <p className="mb-4 text-center fw-bold fs-4">Get in Touch</p>

          <Form.Group className="mb-4" controlId="formName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter your name"
              required
              className="form-control"
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="form-control"
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formMessage">
            <Form.Label>Your Message</Form.Label>
            <Form.Control
              as="textarea"
              name="message"
              rows={4}
              placeholder="Write your message here..."
              required
              className="form-control"
            />
          </Form.Group>

          <Button className="w-100 btn-primary" type="submit">
            Send Message
          </Button>

          {result && (
            <Alert className="mt-3 text-center" variant={variant}>
              {result}
            </Alert>
          )}
        </Form>
        <div className="text-center image-container w-50 d-lg-block d-none">
          <img
            src="/src/assets/Contact.png"
            className="w-100"
            alt="Contact Us"
          />
        </div>
      </Container>
    </div>
  );
}
