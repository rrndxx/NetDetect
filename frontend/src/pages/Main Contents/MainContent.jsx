import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Conditions from "./Dynamic Contents/Conditions";
import { FaBars } from "react-icons/fa";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const MainContent = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex">
      {/* Sidebar */}
      <Sidebar
        onMenuClick={(menu) => {
          setActiveMenu(menu);
          setSidebarOpen(false); // Close sidebar on menu item click
        }}
        activeMenu={activeMenu}
        toggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />

      {/* Main content area */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          {/* Sidebar Toggle Button for mobile */}
          <button
            onClick={toggleSidebar}
            className="text-2xl md:hidden text-[#00BFFF]"
            aria-label="Toggle Sidebar"
          >
            <FaBars />
          </button>
          {/* Active Menu Header */}
          <h1 className="text-3xl font-semibold text-[#00BFFF] capitalize text-center flex-1">
            {activeMenu.replace(/([A-Z])/g, " $1")}
          </h1>
        </div>

        {/* Dynamic content based on active menu */}
        <div className="min-h-lvh">
          <Conditions activeMenu={activeMenu} />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
