import { useState, createContext } from "react"; // Importing React's useState for managing component state
import { FaHome, FaNetworkWired, FaCog, FaSignOutAlt } from "react-icons/fa"; // Importing icons for the sidebar menu
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"; // Importing icons for dropdown arrows
import { useNavigate } from "react-router-dom"; // Importing hook for navigating between routes programmatically

// Sidebar component that receives props: `isOpen` (controls visibility) and `toggleSidebar` (toggles visibility)
const Sidebar = ({ isOpen, toggleSidebar, onButtonClick }) => {
  const [networkMonitoringOpen, setNetworkMonitoringOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 md:hidden transition-all duration-300 z-20 ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={toggleSidebar}
      ></div>
      <div
        className={`md:w-64 w-72 bg-gray-800 p-6 space-y-8 transition-all duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed z-30 top-0 left-0 h-full flex flex-col`}
      >
        <div className="text-center text-xl font-semibold text-[#00d4ff]">
          Admin Panel
        </div>
        <ul className="space-y-6 flex-1">
          <li>
            <button
              onClick={() => onButtonClick("Dashboard")}
              className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-700"
            >
              <FaHome className="mr-4 text-lg" />
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => setNetworkMonitoringOpen(!networkMonitoringOpen)}
              className="flex items-center w-full py-2 px-4 rounded-lg hover:bg-gray-700"
            >
              <FaNetworkWired className="mr-4 text-lg" />
              Network Monitoring
              {networkMonitoringOpen ? (
                <IoIosArrowUp className="ml-auto text-xl" />
              ) : (
                <IoIosArrowDown className="ml-auto text-xl" />
              )}
            </button>
            {networkMonitoringOpen && (
              <ul className="ml-6 space-y-2 mt-4">
                <li>
                  <button
                    onClick={() => onButtonClick("Network Status")}
                    className="block py-2 px-4 rounded-lg hover:bg-gray-700"
                  >
                    Network Status
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onButtonClick("Device Management")}
                    className="block py-2 px-4 rounded-lg hover:bg-gray-700"
                  >
                    Device Management
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onButtonClick("Bandwidth Monitoring")}
                    className="block py-2 px-4 rounded-lg hover:bg-gray-700"
                  >
                    Bandwidth Monitoring
                  </button>
                </li>
              </ul>
            )}
          </li>
          <li>
            <button
              onClick={() => onButtonClick("Settings")}
              className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-700"
            >
              <FaCog className="mr-4 text-lg" />
              Settings
            </button>
          </li>
        </ul>
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center w-full py-2 px-4 rounded-lg bg-red-600 hover:bg-red-500"
          >
            <FaSignOutAlt className="mr-4 text-lg" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
