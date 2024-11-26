import Sidebar from "../components/Sidebar.jsx";
import Dashboard from "../components/Dashboard.jsx";
import NetworkStatus from "../components/NetworkStatus.jsx";
import DeviceManagement from "../components/DeviceManagement.jsx";
import BandwidthMonitoring from "../components/BandwidthMonitoring.jsx";
import Settings from "../components/Settings.jsx";
import { useState, useEffect } from "react";
import { auth } from "../firebase/firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState("Dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
      }
    });
  }, []);

  const handleSidebarButton = (button) => {
    setSelectedButton(button);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Render the component based on the selected button
  const renderContent = () => {
    switch (selectedButton) {
      case "Dashboard":
        return <Dashboard toggleSidebar={toggleSidebar} />;
      case "Network Status":
        return <NetworkStatus toggleSidebar={toggleSidebar} />;
      case "Device Management":
        return <DeviceManagement toggleSidebar={toggleSidebar} />;
      case "Bandwidth Monitoring":
        return <BandwidthMonitoring toggleSidebar={toggleSidebar} />;
      case "Settings":
        return <Settings toggleSidebar={toggleSidebar} />;
      default:
        return <Dashboard toggleSidebar={toggleSidebar} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        onButtonClick={handleSidebarButton}
      />
      {/* Main Content Area */}
      <div className="flex-1">{renderContent()}</div>
    </div>
  );
};

export default DashboardPage;
