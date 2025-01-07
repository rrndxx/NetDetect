// LogsContext.js
import React, { createContext, useState, useContext } from "react";

const LogsContext = createContext();

export const LogsProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);

  const addLogs = (log) => {
    setLogs((prev) => [...prev, log]);
  };

  return (
    <LogsContext.Provider value={{ logs, addLogs }}>
      {children}
    </LogsContext.Provider>
  );
};

export const useLogs = () => {
  return useContext(LogsContext);
};
