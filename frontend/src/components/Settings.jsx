const Settings = ({ toggleSidebar }) => {
    return (
      // Main container for the content area
      <div className="flex-1 p-6 md:ml-64 bg-gray-900 transition-all duration-300">
        {/* Header section */}
        <div className="flex justify-start items-center mb-8">
          {/* Hamburger menu button (visible only on smaller screens) */}
          <button
            className="md:hidden text-[#00d4ff] text-2xl" // Hidden on medium+ screens, styled with blue color and large text
            onClick={toggleSidebar} // Calls the `toggleSidebar` function when clicked
          >
            &#9776; {/* Unicode character for the hamburger icon */}
          </button>
          {/* Title of the page */}
          <h1 className="text-3xl font-semibold text-[#00d4ff] ps-5">
            Settings
          </h1>
        </div>
  
        {/* Main content section */}
        <div>
          <p>Welcome to the Settings!</p>{" "}
          {/* Placeholder text for dashboard content */}
        </div>
      </div>
    );
  };
  
  export default Settings;
  