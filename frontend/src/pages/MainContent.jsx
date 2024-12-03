import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Conditions from "../main contents/Conditions";
import { FaBars } from "react-icons/fa";
import { auth } from "../firebase/firebase";
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
    <div className="min-h-screen bg-[#121212] text-white flex">
      <Sidebar
        onMenuClick={(menu) => {
          setActiveMenu(menu);
          setSidebarOpen(false); 
        }}
        activeMenu={activeMenu}
        toggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex-1 p-8">
        <div className="flex justify-start items-center mb-8">
          <button
            onClick={toggleSidebar}
            className="text-2xl md:hidden text-[#00BFFF]"
            aria-label="Toggle Sidebar"
          >
            <FaBars />
          </button>
          <h1 className="text-3xl text-center font-semibold text-[#00BFFF] ms-4 capitalize">
            {activeMenu.replace(/([A-Z])/g, " $1")} 
          </h1>
        </div>

        <Conditions activeMenu={activeMenu} />
      </div>
    </div>
  );
};

export default MainContent;
