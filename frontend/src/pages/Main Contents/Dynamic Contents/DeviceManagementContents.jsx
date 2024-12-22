import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const DeviceManagementContents = () => {
  const [state, setState] = useState({
    devices: [],
    loading: true,
    error: null,
  });

  /**
   * Function to fetch devices from the server
   */
  const fetchDevices = useCallback(async () => {
    try {
      setState((prevState) => ({ ...prevState, error: null })); // Reset error state before fetching
      const response = await axios.get("http://localhost:5000/api/devices");
      setState({
        devices: response.data.devices || [],
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Error fetching devices:", err);
      setState({
        devices: [],
        loading: false,
        error: err?.response?.data?.message || "Failed to fetch devices.",
      });
    }
  }, []);

  /**
   * useEffect to fetch devices on component mount and set an interval to refresh every 60 seconds
   */
  useEffect(() => {
    fetchDevices(); // Initial fetch on component mount
    const intervalId = setInterval(fetchDevices, 60000); // Refresh every 60 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [fetchDevices]);

  const { devices, loading, error } = state;

  /**
   * Loading state
   */
  if (loading) {
    return (
      <div className="text-center mt-6">
        <p className="text-gray-400 text-center animate-pulse">
          Loading devices...
        </p>
      </div>
    );
  }

  /**
   * Error state
   */
  if (error) {
    return (
      <div className="text-center mt-6">
        <p className="text-red-500 text-center">
          {error}. Retrying in 60 seconds...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-transparent p-6 rounded-lg shadow-md">
      <p className="text-lg font-bold text-[#00BFFF] mb-4">
        Devices Connected: {devices.length}
      </p>

      {devices.length === 0 ? (
        <p className="text-center text-gray-400">
          No devices detected. Please try again later.
        </p>
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
                <td className="px-4 py-2">
                  {device.hostname || (
                    <span className="text-gray-500">Unknown</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {device.ip_address || (
                    <span className="text-gray-500">Unknown</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {device.mac_address || (
                    <span className="text-gray-500">Unknown</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {device.device_type || (
                    <span className="text-gray-500">Unknown</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeviceManagementContents;
