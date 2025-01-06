import {
  FaLaptop,
  FaExclamationTriangle,
  FaNetworkWired,
} from "react-icons/fa";
import { useNotifications } from "../../../context/NotificationsContext";

const NotificationsPage = () => {
  const { notifications } = useNotifications();

  const renderIcon = (type) => {
    switch (type) {
      case "info":
        return <FaLaptop className="text-blue-500 text-3xl" />;
      case "warning":
        return <FaExclamationTriangle className="text-yellow-500 text-3xl" />;
      default:
        return <FaNetworkWired className="text-gray-500 text-3xl" />;
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-6">
        {notifications.length === 0 ? (
          <p className="col-span-full text-sm text-gray-400 text-center">
            No notifications to display.
          </p>
        ) : (
          notifications.map((notification, index) => (
            <div
              key={index}
              className="shadow-lg rounded-lg p-4 flex items-start gap-4"
            >
              {/* Icon */}
              {renderIcon(notification.type)}
              {/* Details */}
              <div>
                <h4 className="text-lg font-semibold text-white">
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-400">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {notification.timestamp
                    ? new Date(notification.timestamp).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : "Invalid Date"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
