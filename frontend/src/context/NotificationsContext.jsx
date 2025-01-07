import React, { createContext, useState, useContext } from "react";

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add a new notification
  const addNotification = (notification) => {
    setNotifications((prev) => [...prev, notification]);
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Delete a specific notification
  const deleteNotification = (notificationToDelete) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification !== notificationToDelete)
    );
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        clearNotifications,
        deleteNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationsContext);
};
