import { toast } from "react-toastify";

export function useToast() {
  const showSuccess = (message) => {
    toast.success(message);
  };

  const showError = (message) => {
    toast.error(message);
  };

  return { showSuccess, showError };
}
