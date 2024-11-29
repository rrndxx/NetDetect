import React, { useState } from "react";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

import {
  FaCogs,
  FaWifi,
  FaMobileAlt,
  FaTachometerAlt,
  FaSignOutAlt,
  FaChartLine,
  FaBell
} from "react-icons/fa";

const Sidebar = ({ onMenuClick, activeMenu, toggleSidebar, sidebarOpen }) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { name: "dashboard", icon: <FaChartLine />, label: "Dashboard" },
    { name: "networkStatus", icon: <FaWifi />, label: "Network Status" },
    {
      name: "deviceManagement",
      icon: <FaMobileAlt />,
      label: "Device Management",
    },
    {
      name: "bandwidthMonitoring",
      icon: <FaTachometerAlt />,
      label: "Bandwidth Monitoring",
    },
    { name: "notifications", icon: <FaBell />, label: "Notifications" },
    { name: "settings", icon: <FaCogs />, label: "Settings" },
  ];

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div
        className={`bg-[#1A1A1A] p-6 space-y-8 fixed md:relative z-20 w-64 h-full md:h-auto transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <h2 className="text-2xl font-semibold text-[#00BFFF] mb-10 mt-2 text-center">
          NetDetect
        </h2>
        <div className="space-y-6">
          {menuItems.map((menu) => (
            <button
              key={menu.name}
              onClick={() => onMenuClick(menu.name)}
              className={`flex items-center w-full text-left py-3 px-4 rounded-lg transition-colors ${
                activeMenu === menu.name
                  ? "text-[#00BFFF] bg-gray-700"
                  : "text-gray-400 hover:text-[#00BFFF]"
              }`}
            >
              {menu.icon}
              <span className="ml-4">{menu.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="absolute bottom-6 left-6 flex items-center text-red-500 hover:text-red-700 w-[calc(100%-3rem)] text-left py-3 px-4 rounded-lg transition-colors"
        >
          <FaSignOutAlt className="mr-4 text-xl" /> Logout
        </button>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
          <div className="bg-[#1A1A1A] text-black p-6 rounded-lg w-96">
            <h3 className="text-[#00BFFF] text-xl font-semibold mb-4">
              Confirm Logout
            </h3>
            <p className="text-white mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-white hover:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
