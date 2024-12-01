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
    const intervalId = setInterval(fetchDevices, 60000); // Fetch devices every 60 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  if (loading) return <p className="text-gray-400">Loading devices...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md">
      <div className="flex justify-between mx-4">
        <h3 className="text-xl font-semibold text-[#00BFFF]">
          Device Management
        </h3>
        <p className="text-sm text-gray-400">
          Devices Connected: {devices.length}
        </p>
      </div>
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
            <tr key={index} className="border-b border-gray-800">
              <td className="px-4 py-2">{device.hostname}</td>
              <td className="px-4 py-2">{device.ip_address}</td>
              <td className="px-4 py-2">{device.mac_address}</td>
              <td className="px-4 py-2">{device.device_type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeviceManagementContents;
