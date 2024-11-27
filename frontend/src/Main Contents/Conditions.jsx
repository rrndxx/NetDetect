import BandwidthMonitoringContents from "./BandwidthMonitoringContents";
import DashboardContent from "./DashboardContent";
import DeviceManagementContents from "./DeviceManagementContents";
import NetworkStatusContent from "./NetworkStatusContent";
import SettingsContents from "./SettingsContents";
const Conditions = ({ activeMenu }) => {
  const content = () => {
    switch (activeMenu) {
      case "dashboard":
        return <DashboardContent />;
      case "networkStatus":
        return <NetworkStatusContent />;
      case "deviceManagement":
        return <DeviceManagementContents />;
      case "bandwidthMonitoring":
        return <BandwidthMonitoringContents />;
      case "settings":
        return <SettingsContents />;
      default:
        return <div>No content available</div>;
    }
  };

  return <div>{content()}</div>;
};

export default Conditions;
