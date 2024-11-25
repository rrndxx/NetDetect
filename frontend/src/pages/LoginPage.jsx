const LoginPage = () => {
  return (
    // Main container for the login page, centered both vertically and horizontally
    <div className="flex justify-center items-center min-h-screen bg-gray-900 bg-cover bg-center">
      {/* Login box with padding, rounded corners, shadow, and hover animation */}
      <div className="px-12 py-10 rounded-xl shadow-2xl w-full max-w-sm transform hover:scale-105 transition duration-300 bg-gray-800">
        {/* Title for the login form */}
        <h1 className="text-3xl text-white font-semibold mb-8 text-center">
          Login
        </h1>
        {/* Form for user input */}
        <form>
          {/* Email input field */}
          <div className="mb-6">
            <input
              type="email" // Specifies this field is for email input
              id="email" // Sets the unique identifier for the email input
              placeholder="Email" // Placeholder text displayed when the input is empty
              className="w-full px-4 py-2 border-b border-gray-500 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00d4ff] transition duration-200"
              // Styling: full width, padding, border bottom, transparent background, placeholder color
              // Focus behavior: outline removed, adds blue ring around input
              required // Makes this field mandatory to fill
              autoComplete="email" // Enables browser autofill for email
            />
          </div>
          {/* Password input field */}
          <div className="mb-6">
            <input
              type="password" // Specifies this field is for password input
              id="password" // Sets the unique identifier for the password input
              placeholder="Password" // Placeholder text displayed when the input is empty
              className="w-full px-4 py-2 border-b border-gray-500 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00d4ff] transition duration-200"
              // Styling: same as email input for consistency
              required // Makes this field mandatory to fill
              autoComplete="current-password" // Enables browser autofill for password
            />
          </div>
          <br />
          {/* Login button */}
          <button
            type="submit" // Specifies this button submits the form
            className="w-full mt-4 bg-[#00d4ff] text-gray-900 py-2 rounded-md font-bold hover:bg-[#00a9d4] transition duration-200"
            // Styling: full width, blue background, bold font, hover effect
          >
            Login
          </button>
        </form>
        {/* Forgot Password link */}
        <div className="text-end mt-4 text-sm">
          <a
            href="#" // URL for the forgot password page (placeholder link for now)
            className="text-[#00d4ff] hover:text-[#00a9d4]"
            // Styling: blue text with hover effect
          >
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
