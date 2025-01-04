import React from "react";
import { useNavigate } from "react-router-dom"; // Use react-router-dom for navigation

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <section
      id="error"
      className="py-16 sm:py-20 px-8 sm:px-10 lg:px-24 bg-gradient-to-r from-gray-800 to-gray-900"
    >
      <div className="container mx-auto">
        {/* Title Section */}
        <div className="text-center mb-14">
          <h3 className="text-3xl sm:text-4xl md:text-5xl text-white tracking-wide drop-shadow-lg">
            Oops! Something Went Wrong
          </h3>
          <p className="text-md text-neutral-400 mt-4 leading-relaxed max-w-3xl mx-auto">
            We're sorry, but we encountered an error while processing your
            request. Please try again later.
          </p>
        </div>

        {/* Error Message */}
        <div className="max-w-3xl mx-auto bg-gray-800 bg-opacity-90 p-10 rounded-lg shadow-2xl">
          <div className="text-center">
            <h4 className="text-xl sm:text-2xl text-red-500 font-semibold">
              Error 404 - Page Not Found
            </h4>
            <p className="mt-4 text-neutral-400">
              Something went wrong on our end. Don't worry, we are already on
              it! We apologize for the inconvenience.
            </p>

            {/* Redirect message or button */}
            <div className="mt-8">
              <button
                onClick={() => navigate("/")}
                className="mt-4 font-medium bg-gradient-to-r from-blue-500 to-blue-700 text-gray-900 px-6 py-3 rounded-md shadow-lg text-lg sm:text-xl hover:scale-105 transition duration-200"
              >
                Go Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
