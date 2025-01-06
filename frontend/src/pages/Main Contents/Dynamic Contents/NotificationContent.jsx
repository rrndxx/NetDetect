import React, { useState, useEffect } from "react";
import {
  FaLaptop,
  FaExclamationTriangle,
  FaNetworkWired,
} from "react-icons/fa";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching notifications from an API
    const simulatedNotifications = [
      {
        type: "info",
        title: "New Device Detected",
        message: "Device LAB1PC11 has joined the network.",
        timestamp: new Date().toISOString(),
      },
      {
        type: "warning",
        title: "High Bandwidth Usage",
        message:
          "LAB1PC11 is consuming too much bandwidth. Consider reviewing.",
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        type: "info",
        title: "Connection Restored",
        message: "Device LAB2PC01 is now back online.",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
    ];

    setTimeout(() => {
      setNotifications(simulatedNotifications);
      setLoading(false);
    }, 1500);
  }, []);

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
        {loading ? (
          <p className="col-span-full text-sm text-gray-400 text-center">
            Loading notifications...
          </p>
        ) : notifications.length === 0 ? (
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
                  {new Date(notification.timestamp).toLocaleString()}
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
