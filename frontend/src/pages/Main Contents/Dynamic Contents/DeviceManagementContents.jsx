import React, { useState, useEffect } from "react";
import axios from "axios";

const DeviceManagementContents = () => {
  const [devices, setDevices] = useState([]); // State to store devices
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(""); // State for error handling

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/devices");

        setDevices(response.data);
      } catch (err) {
        setError("Failed to fetch devices.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
    // Set an interval to fetch devices every 60 seconds
    const intervalId = setInterval(fetchDevices, 60000);
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <p className="text-gray-400 text-center animate-pulse">Loading...</p>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="bg-transparent p-6 rounded-lg shadow-md relative">
      <p className="text-md font-bold text-[#00BFFF]">
        Devices Connected: {devices.length}
      </p>
      <table className="w-full mt-4 text-left text-sm text-gray-300">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="px-4 py-2">Hostname</th>
            <th className="px-4 py-2">IP Address</th>
            <th className="px-4 py-2">MAC Address</th>
            <th className="px-4 py-2">Device Type</th>
            <th className="px-4 py-2">Operating System</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device, index) => (
            <tr key={index} className="border-b border-gray-800">
              <td className="px-4 py-2">{device.hostname}</td>
              <td className="px-4 py-2">{device.ip_address}</td>
              <td className="px-4 py-2">{device.mac_address}</td>
              <td className="px-4 py-2">{device.device_type}</td>
              <td className="px-4 py-2">{device.os}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeviceManagementContents;
