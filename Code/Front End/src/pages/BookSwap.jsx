import { useEffect, useState, useCallback } from "react";
import Form from "../components/forms/Form";
import MapView from "../components/common/map/MapView";
import { useGeolocation } from "../hooks/useGeolocation";
import { useToast } from "../hooks/useToast";
import { useSelector } from "react-redux";
import { useFetchRequest } from "../hooks/useFetchRequest";

const fields = [
  {
    label: "Book Title",
    type: "text",
    name: "title",
  },
  {
    label: "Book Author",
    type: "text",
    name: "author",
  },
];

export default function BookSwap() {
  const [data, setData] = useState();
  const { position, error, isLoading, handleClick } = useGeolocation();
  const { showError, showSuccess } = useToast();
  const { requests } = useFetchRequest();
  const [pendingFormData, setPendingFormData] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const [resetKey, setResetKey] = useState(0);

  // Function to send the POST request with the exchange data
  const sendExchangeRequest = useCallback(
    async (data) => {
      try {
        const response = await fetch("https://localhost:7159/api/Exchange", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Sending the token for authentication
          },
          body: JSON.stringify(data), // Sending the data as JSON
        });
        const responseData = await response.text();
        showSuccess(responseData); // Show success message
      } catch (error) {
        console.error("Failed to send exchange request:", error.message);
        showError("An error occurred while submitting the request ❌"); // Show error message
        throw error; // Rethrow the error to handle it in the calling function
      }
    },
    [token, showSuccess, showError]
  );

  // Handle form submission
  const handleSubmit = (formData) => {
    setPendingFormData(formData); // Store the form data temporarily
    handleClick(); // Start getting geolocation data
  };

  // Triggered when geolocation is available, sends the exchange request
  useEffect(() => {
    if (position && pendingFormData) {
      const combinedData = {
        bookTitle: pendingFormData.title, // Add book title
        authorName: pendingFormData.author, // Add book author
        phoneNumber: null, // You can add phone number field later in the form
        longitude: position.lng.toString(), // Convert longitude to string
        latitude: position.lat.toString(), // Convert latitude to string
      };

      sendExchangeRequest(combinedData); // Send data to the API
      setData(combinedData); // Update the state with the sent data
      setResetKey((prev) => prev + 1); // Reset the form (triggered by a new key)
      setPendingFormData(null); // Clear the pending form data
    }
  }, [position, pendingFormData, showSuccess, showError, sendExchangeRequest]);

  // Handle geolocation errors
  useEffect(() => {
    if (error) {
      console.error("Geolocation error:", error); // Log geolocation error
      showError("Geolocation access denied or failed"); // Show error message for geolocation issue
    }
  }, [error, showError]);

  return (
    <div className="py-5 container-fluid">
      <div className="d-lg-flex d-block justify-content-between align-items-center">
        <div className="w-auto mx-auto form-container d-block d-lg-flex justify-content-center align-items-center rounded-4">
          <Form
            fields={fields}
            onSubmit={handleSubmit} // Handle form submission
            resetTrigger={resetKey} // Reset form when resetKey changes
          />
        </div>
        <div className="w-50">
          <MapView requests={requests} />
        </div>
      </div>
    </div>
  );
}
