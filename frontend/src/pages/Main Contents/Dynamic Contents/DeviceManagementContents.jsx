import React, { useState, useEffect } from "react";
import axios from "axios";

const DeviceManagementContents = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/devices");
        setDevices(response.data.devices);
      } catch (err) {
        setError("Failed to fetch devices.");
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
    const intervalId = setInterval(fetchDevices, 60000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-6">
        <p className="text-gray-400 text-center animate-pulse">
          Loading devices...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-6">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-transparent p-6 rounded-lg shadow-md">
      <p className="text-lg font-bold text-[#00BFFF] mb-4">
        Devices Connected: {devices.length}
      </p>

      {devices.length === 0 ? (
        <p className="text-center text-gray-400">No devices detected. Please try again later.</p>
      ) : (
        <table className="w-full mt-4 text-left text-sm text-gray-300">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-4 py-2">Hostname</th>
              <th className="px-4 py-2">IP Address</th>
              <th className="px-4 py-2">MAC Address</th>
              <th className="px-4 py-2">Device Type</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device, index) => (
              <tr
                key={index}
                className="border-b border-gray-800 hover:bg-gray-800 transition"
              >
                <td className="px-4 py-2">{device.hostname || "N/A"}</td>
                <td className="px-4 py-2">{device.ip_address || "N/A"}</td>
                <td className="px-4 py-2">{device.mac_address || "N/A"}</td>
                <td className="px-4 py-2">{device.device_type || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeviceManagementContents;
