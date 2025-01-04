import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const DeviceManagementContents = () => {
  const [state, setState] = useState({
    devices: [],
    loading: true,
    error: null,
  });

  const fetchDevices = useCallback(async () => {
    try {
      setState((prevState) => ({ ...prevState, error: null }));
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

  useEffect(() => {
    fetchDevices();
    const intervalId = setInterval(fetchDevices, 60000);

    return () => clearInterval(intervalId);
  }, [fetchDevices]);

  const { devices, loading, error } = state;

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
        <p className="text-red-500 text-center">
          {error}. Retrying in 60 seconds...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-transparent p-6">
      <p className="text-xl font-semibold text-[#00BFFF] mb-4">
        Devices Connected: {devices.length}
      </p>
      <hr className="mb-6 border-t border-[#444]" />

      {devices.length === 0 ? (
        <p className="text-center text-gray-400">
          No devices detected. Please try again later.
        </p>
      ) : (
        <div className="overflow-x-auto shadow-xl">
          <table className="w-full text-center text-xs text-gray-300">
            {/* Reduced font size here */}
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-4 py-2">Hostname</th>
                <th className="px-4 py-2">IP Address</th>
                <th className="px-4 py-2">MAC Address</th>
                <th className="px-4 py-2">Device Type</th>
                <th className="px-4 py-2">Device Model</th>
                <th className="px-4 py-2">OS</th> {/* Added OS column */}
              </tr>
            </thead>
            <tbody>
              {devices.map((device, index) => (
                <tr
                  key={index}
                  className="rounded-sm hover:bg-gray-800 transition"
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
                  <td className="px-4 py-2">
                    {device.device_model || (
                      <span className="text-gray-500">Unknown</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {device.os || (
                      <span className="text-gray-500">Unknown</span>
                    )}
                  </td>{" "}
                  {/* Added OS value */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeviceManagementContents;
