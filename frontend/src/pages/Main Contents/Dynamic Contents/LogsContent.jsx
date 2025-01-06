import React, { useState, useEffect } from "react";

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching logs from an API
    const simulatedLogs = [
      {
        id: 1,
        timestamp: new Date().toISOString(),
        action: "Logged In",
        details: "You logged in yesterday at 10:00 PM.",
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        action: "Blocked Device",
        details:
          "You blocked device with MAC address 10:B2:80:A4:C6 today at 8:29 AM.",
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        action: "Unblocked Device",
        details:
          "You removed device with MAC address 20:C3:90:B5:D7 from the blocked list.",
      },
    ];

    setTimeout(() => {
      setLogs(simulatedLogs);
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="p-6">
      {/* Logs List */}
      {loading ? (
        <p className="text-sm text-gray-400 text-center py-6">
          Loading logs...
        </p>
      ) : logs.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">
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
