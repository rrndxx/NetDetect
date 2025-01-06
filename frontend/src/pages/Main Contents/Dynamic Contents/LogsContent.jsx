import React, { useState } from "react";

const LogsPage = () => {
  const [logs, setLogs] = useState([]);

  return (
    <div className="p-6">
      {/* Logs List */}
      {logs.length === 0 ? (
        <p className="text-sm text-gray-400 text-center">
          No activity logs to display.
        </p>
      ) : (
        <ul className="space-y-4">
          {logs.map((log) => (
            <li
              key={log.id}
              className="px-4 py-3 rounded-lg shadow hover:bg-gray-700"
            >
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-white">
                  {log.action}
                </h4>
                <p className="text-sm text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
              <p className="text-sm text-gray-400 mt-2">{log.details}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LogsPage;
