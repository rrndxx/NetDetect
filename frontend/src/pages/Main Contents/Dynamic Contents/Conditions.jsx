import BandwidthMonitoringContents from "./BandwidthMonitoringContents";
import DashboardContent from "./DashboardContent";
import DeviceManagementContents from "./DeviceManagementContents";
import NetworkStatusContent from "./NetworkStatusContent";
const Conditions = ({ activeMenu }) => {
  const content = () => {
    switch (activeMenu) {
      case "dashboard":
        return <DashboardContent />;
      case "networkStatus":
        return <NetworkStatusContent />;
      case "deviceManagement":
        return <DeviceManagementContents />;
      case "bandwidthUsage":
        return <BandwidthMonitoringContents />;
      default:
        return (
          <div className="text-gray-400 mt-6 ms-10">No content available</div>
        );
    }
  };

  return <div>{content()}</div>;
};

export default Conditions;
