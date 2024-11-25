import { useState } from "react"; 
import Sidebar from "../components/Sidebar.jsx"; 
import Dashboard from "../components/Dashboard.jsx"; 
import NetworkStatus from "../components/NetworkStatus.jsx"; 
import DeviceManagement from "../components/DeviceManagement.jsx"; 
import BandwidthMonitoring from "../components/BandwidthMonitoring.jsx"; 
import Settings from "../components/Settings.jsx"; 

const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState("Dashboard");

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
        return <NetworkStatus />;
      case "Device Management":
        return <DeviceManagement />;
      case "Bandwidth Monitoring":
        return <BandwidthMonitoring />;
      case "Settings":
        return <Settings />;
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
