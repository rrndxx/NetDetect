import { useState } from "react"; // Importing React's useState for managing component state
import {
  FaHome,
  FaNetworkWired,
  FaCog,
  FaSignOutAlt,
  FaWifi,
} from "react-icons/fa"; // Importing icons for the sidebar menu
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"; // Importing icons for dropdown arrows
import { MdSpeed, MdDevices, MdWifi } from "react-icons/md"; // Importing additional icons for dropdown items
import { useNavigate } from "react-router-dom"; // Importing hook for navigating between routes programmatically
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";

const Sidebar = ({ isOpen, toggleSidebar, onButtonClick }) => {
  const [networkMonitoringOpen, setNetworkMonitoringOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <>
      {/* Overlay for sidebar on small screens */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 md:hidden transition-all duration-300 z-20 ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={toggleSidebar}
      ></div>
      {/* Sidebar Container */}
      <div
        className={`md:w-64 w-72 bg-gray-800 p-6 space-y-8 transition-all duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed z-30 top-0 left-0 h-full flex flex-col`}
      >
        <div className="flex items-center justify-center text-xl font-semibold text-[#00d4ff] space-x-2">
          <FaWifi className="text-2xl" />
          <span>NetDetect</span>
        </div>

        <ul className="space-y-6 flex-1">
          {/* Dashboard */}
          <li>
            <button
              onClick={() => onButtonClick("Dashboard")}
              className="flex items-center py-3 px-5 rounded-lg hover:bg-gray-700 text-left w-full"
            >
              <FaHome className="mr-4 text-lg text-white" />
              <span className="text-white">Dashboard</span>
            </button>
          </li>

          {/* Network Monitoring */}
          <li>
            <button
              onClick={() => setNetworkMonitoringOpen(!networkMonitoringOpen)}
              className="flex items-center py-3 px-5 rounded-lg hover:bg-gray-700 text-left w-full"
            >
              <FaNetworkWired className="mr-4 text-lg text-white" />
              <span className="text-white">Network Monitoring</span>
              {networkMonitoringOpen ? (
                <IoIosArrowUp className="ml-auto text-xl text-white" />
              ) : (
                <IoIosArrowDown className="ml-auto text-xl text-white" />
              )}
            </button>
            {networkMonitoringOpen && (
              <ul className="ml-8 mt-2 space-y-2">
                <li>
                  <button
                    onClick={() => onButtonClick("Network Status")}
                    className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-700 text-left w-full"
                  >
                    <MdSpeed className="mr-4 text-lg text-white" />
                    <span className="text-white">Network Status</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onButtonClick("Device Management")}
                    className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-700 text-left w-full"
                  >
                    <MdDevices className="mr-4 text-lg text-white" />
                    <span className="text-white">Device Management</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onButtonClick("Bandwidth Monitoring")}
                    className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-700 text-left w-full"
                  >
                    <MdWifi className="mr-4 text-lg text-white" />
                    <span className="text-white">Bandwidth Monitoring</span>
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Settings */}
          <li>
            <button
              onClick={() => onButtonClick("Settings")}
              className="flex items-center py-3 px-5 rounded-lg hover:bg-gray-700 text-left w-full"
            >
              <FaCog className="mr-4 text-lg text-white" />
              <span className="text-white">Settings</span>
            </button>
          </li>
        </ul>

        {/* Logout */}
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
