import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

// Custom wrapper function with default configurations
const flashMessage = (
    content: string,
    type: "info" | "success" | "error" | "warning" | "dark" = "info",
    duration: number = 1500, // Duration in milliseconds
): void => {
    // Dismiss any existing toasts
    toast.dismiss();

    // Show the new toast
    toast[type](content, {
        position: 'top-center',
        autoClose: duration, // Duration for the toast
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
    });
};

// Optionally, export ToastContainer to be used in your main application component
export { ToastContainer };
export default flashMessage;
