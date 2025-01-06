import { useState } from "react";
import emailjs from "emailjs-com";

const ContactUsSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus(null);

    try {
      const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const userID = import.meta.env.VITE_EMAILJS_USER_ID;

      // Create the payload with necessary fields for the template
      const templateParams = {
        from_name: formData.name, // Ensure this is passed correctly
        message: formData.message,
      };

      await emailjs.send(serviceID, templateID, templateParams, userID);
      setFormStatus("success");
      setFormData({ name: "", message: "" });

      // Clear the success message after 5 seconds
      setTimeout(() => {
        setFormStatus(null);
      }, 3000);
    } catch (error) {
      console.error("Failed to send message:", error);
      setFormStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-16 sm:py-20 px-8 sm:px-10 lg:px-24 bg-gradient-to-r from-gray-800 to-gray-900"
    >
      <div className="container mx-auto">
        {/* Title Section */}
        <div className="text-center mb-14">
          <h3 className="text-3xl sm:text-4xl md:text-5xl text-white tracking-wide drop-shadow-lg">
            Get in Touch
          </h3>
          <p className="text-md text-neutral-400 mt-4 leading-relaxed max-w-3xl mx-auto">
            We'd love to hear from you! Whether you have questions, feedback, or
            simply want to connect, feel free to reach out. Our team is here to
            assist and ensure your experience with{" "}
            <span className="text-[#00BFFF] font-bold">NetDetect</span> is exceptional.
          </p>
        </div>

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto bg-gray-800 bg-opacity-90 p-10 rounded-lg shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-md font-medium text-neutral-400 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 text-gray-200 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Message Field */}
            <div>
              <label
                htmlFor="message"
                className="block text-md font-medium text-neutral-400 mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 text-gray-200 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Type your message here..."
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-6 text-lg font-medium text-white ${
                isSubmitting
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              } rounded-lg shadow-lg transition duration-300`}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>

          {/* Form Status */}
          {formStatus && (
            <div
              className={`mt-6 text-center text-lg font-semibold ${
                formStatus === "success" ? "text-green-500" : "text-red-500"
              }`}
            >
              {formStatus === "success"
                ? "Your message has been sent successfully!"
                : "Failed to send your message. Please try again later."}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactUsSection;
