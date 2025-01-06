import BandwidthMonitoringContents from "./BandwidthMonitoringContents";
import DashboardContent from "./DashboardContent";
import DeviceManagementContents from "./DeviceManagementContents";
import LogsPage from "./LogsContent";
import MacFilteringPage from "./MACFilteringContents";
import NetworkStatusContent from "./NetworkStatusContent";
import NotificationContent from "./NotificationContent";

const Conditions = ({ activeMenu }) => {
  const content = () => {
    switch (activeMenu) {
      case "dashboard":
        return <DashboardContent />;
      case "networkStatus":
        return <NetworkStatusContent />;
      case "connectedDevices":
        return <DeviceManagementContents />;
      case "bandwidthUsage":
        return <BandwidthMonitoringContents />;
      case "macFiltering":
        return <MacFilteringPage />
      case "notifications":
        return <NotificationContent />;
      case "logs":
        return <LogsPage />;
      default:
        return (
          <div className="text-gray-400 mt-6 ms-10">No content available</div>
        );
    }
  };

  return <div>{content()}</div>;
};

export default Conditions;
