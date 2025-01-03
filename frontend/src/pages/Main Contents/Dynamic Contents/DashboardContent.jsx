import React, { useCallback, useState, useEffect, useRef } from "react";
import axios from "axios";

const DashboardContent = () => {
  const [state, setState] = useState({
    devices: [],
    loading: true,
    error: null,
  });

  const [networkState, setNetworkState] = useState({
    networkStatus: null,
    loading: true,
    error: null,
  });

  const intervalRef = useRef(null);

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

  const fetchNetworkStatus = useCallback(async () => {
    try {
      setNetworkState((prevState) => ({ ...prevState, error: null }));
      const response = await axios.get(
        "http://localhost:5000/api/network-status"
      );

      if (response.status !== 200) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const data = response.data;

      if (data.status === "success") {
        setNetworkState({
          networkStatus: data,
          loading: false,
          error: null,
        });
      } else {
        throw new Error(data.message || "Network status is unavailable.");
      }
    } catch (error) {
      console.error("Error fetching network status:", error);
      setNetworkState({
        networkStatus: null,
        loading: false,
        error: error.message,
      });
    }
  }, []);

  useEffect(() => {
    fetchDevices();
    fetchNetworkStatus();

    intervalRef.current = setInterval(() => {
      fetchNetworkStatus();
    }, 10000);

    return () => clearInterval(intervalRef.current);
  }, [fetchDevices, fetchNetworkStatus]);

  const connectedDevicesCount = state.devices.length;
  const {
    networkStatus,
    loading: networkLoading,
    error: networkError,
  } = networkState;

  return (
    <div className="grid grid-cols-1 gap-8 p-6">
      <div className="bg-transparent p-6 rounded-lg shadow-lg transition-all duration-300 hover:bg-gray-700 cursor-pointer">
        <h3 className="text-xl font-semibold text-[#00BFFF]">Network Status</h3>
        <p className="text-sm text-gray-400">
          Status: <span className="text-green-500">Online</span>
        </p>
      </div>

      <div className="bg-transparent p-6 rounded-lg shadow-lg transition-all duration-300 hover:bg-gray-700 cursor-pointer">
        <h3 className="text-xl font-semibold text-[#00BFFF]">
          Device Management
        </h3>
        <p className="text-sm text-gray-400">
          Devices Connected: {connectedDevicesCount}
        </p>
      </div>

      <div className="bg-transparent p-6 rounded-lg shadow-lg transition-all duration-300 hover:bg-gray-700 cursor-pointer">
        <h3 className="text-xl font-semibold text-[#00BFFF]">Usage Stats</h3>
        {networkLoading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : networkError ? (
          <p className="text-sm text-red-500">Error: {networkError}</p>
        ) : (
          <>
            <div className="flex items-center space-x-3">
              <p className="text-sm text-gray-400">
                Download: {networkStatus.download_speed?.toFixed(2)} Mbps
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <p className="text-sm text-gray-400">
                Upload: {networkStatus.upload_speed?.toFixed(2)} Mbps
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
