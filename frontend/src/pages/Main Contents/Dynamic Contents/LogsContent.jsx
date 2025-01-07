import React, { useEffect } from "react";
import { useLogs } from "../../../context/LogsContext";

const LogsPage = () => {
  const { logs } = useLogs();

  return (
    <div className="p-6">
      {/* Logs List */}
      {logs.length === 0 ? (
        <p className="text-sm text-gray-400 text-center">
          No activity logs to display.
        </p>
      ) : (
        <ul className="space-y-4">
          {logs.map((log, index) => (
            <li
              key={index}
              className="px-4 py-3 rounded-lg shadow hover:bg-gray-700"
            >
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{log}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LogsPage;
