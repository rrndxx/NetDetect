import React, { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { menuItems } from "../constants/constants.jsx";
import { SignOutButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useLogs } from "../context/LogsContext";

const Sidebar = ({ onMenuClick, activeMenu, toggleSidebar, sidebarOpen }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const { addLogs } = useLogs();

  const handleSignoutSuccess = () => {
    addLogs("You logged out at " + new Date().toLocaleString());
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent backdrop:blur-lg opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`bg-transparent shadow-lg p-8 space-y-8 backdrop-blur-md fixed inset-0 min-h-full z-20 w-64 transition-all duration-300 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <h2 className="text-2xl font-semibold text-[#00BFFF] mb-6 mt-2 text-center cursor-pointer" onClick={() => navigate("/")}>
          NetDetect
        </h2>

        <div className="space-y-2">
          {menuItems.map((menu) => (
            <button
              key={menu.name}
              onClick={() => onMenuClick(menu.name)}
              className={`flex items-center w-full text-left py-2 px-4 rounded-lg transition-colors ${
                activeMenu === menu.name
                  ? "text-[#00BFFF] bg-gray-700"
                  : "text-gray-400 hover:text-[#00BFFF] hover:bg-gray-700"
              }`}
            >
              {menu.icon}
              <span className="ml-4">{menu.label}</span>
            </button>
          ))}
        </div>

        {/* Fixed to the bottom of the sidebar */}
        <div className="mt-auto">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center text-red-500 hover:text-red-700 w-full text-left py-3 px-4 rounded-lg transition-colors"
          >
            <FaSignOutAlt className="mr-4 text-xl" /> Logout
          </button>
        </div>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30 mt-auto">
          <div className="bg-gray-900 text-black p-6 rounded-lg w-96">
            <h3 className="text-[#00BFFF] text-xl font-semibold mb-4">
              Confirm Logout
            </h3>
            <p className="text-white mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-white hover:text-gray-300"
              >
                Cancel
              </button>
              <SignOutButton redirectUrl="/" afterSignOut={() => handleSignoutSuccess()}>
                <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                  Logout
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
