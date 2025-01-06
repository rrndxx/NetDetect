// NotificationsContext.js
import React, { createContext, useState, useContext } from "react";

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    setNotifications((prev) => [...prev, notification]);
  };

  return (
    <NotificationsContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationsContext);
};
