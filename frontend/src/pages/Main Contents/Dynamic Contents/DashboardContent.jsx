import React, { useCallback, useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  FaDownload,
  FaUpload,
  FaWifi,
  FaExclamationTriangle,
} from "react-icons/fa";

// Reusable NetworkStatCard component to handle Download, Upload, and Ping cards
const NetworkStatCard = ({ icon, label, value }) => (
  <div className="shadow-lg px-6 py-4 rounded-lg flex items-center justify-between bg-transparent hover:bg-gray-600 transition-all">
    <div className="flex items-center">
      {icon}
      <div>
        <h4 className="text-lg font-semibold text-white">{label}</h4>
        <p className="text-sm text-gray-400">{value ?? "Loading..."} mbps</p>
      </div>
    </div>
  </div>
);

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

  // Fetch devices
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

  // Fetch network status
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

  // Effect hook to run fetch functions initially and periodically
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
    <div className="p-6">
      {/* Header Section */}
      <div className="bg-[#1F2937] shadow-md px-8 py-6 rounded-lg mb-8 max-w-full mx-auto">
        <p className="text-sm text-gray-400 mt-2">
          Welcome to your Main Dashboard! Here, you can see and overview of real-time data
          about your connected devices and network performance.
        </p>
      </div>

      {/* Status and Device Management Section */}
      <div className="flex flex-wrap gap-4">
        <div className="bg-gray-800 shadow-md px-8 py-6 rounded-lg w-full sm:w-auto flex-grow flex flex-col items-center">
          <h3 className="text-xl font-semibold text-[#00BFFF]">
            Network Status
          </h3>
          <p className="text-sm text-gray-400">
            Status:{" "}
            <span className={`text-${networkError ? "yellow" : "green"}-500`}>
              {networkError ? "Offline" : "Online"}
            </span>
          </p>
          {networkError && (
            <div className="mt-2 text-red-500 text-sm flex items-center">
              <FaExclamationTriangle className="me-2" />{" "}
              <span>{networkError}</span>
            </div>
          )}
        </div>
        <div className="bg-gray-800 shadow-md px-8 py-6 rounded-lg w-full sm:w-auto flex-grow flex flex-col items-center">
          <h3 className="text-xl font-semibold text-[#00BFFF]">
            Device Management
          </h3>
          <p className="text-sm text-gray-400">
            Devices Connected: {connectedDevicesCount || "No devices connected"}
          </p>
        </div>
      </div>

      {/* Network Speed Stats Section */}
      <div className="bg-gray-800 shadow-md px-8 py-6 rounded-lg w-full pb-12 mt-4">
        <h3 className="text-xl font-semibold text-[#00BFFF] mb-4 text-center">
          Network Speed Stats
        </h3>
        {networkLoading ? (
          <div className="text-sm text-gray-400 text-center mb-10">
            Loading...
          </div>
        ) : networkError ? (
          <div className="text-sm text-red-500 text-center mb-10">
            Error: {networkError}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Download Card */}
            <NetworkStatCard
              icon={<FaDownload className="text-[#00BFFF] text-3xl me-4" />}
              label="Download"
              value={networkStatus.download_speed?.toFixed(2)}
            />

            {/* Upload Card */}
            <NetworkStatCard
              icon={<FaUpload className="text-[#00BFFF] text-3xl me-4" />}
              label="Upload"
              value={networkStatus.upload_speed?.toFixed(2)}
            />

            {/* Ping Card */}
            <NetworkStatCard
              icon={<FaWifi className="text-[#00BFFF] text-3xl me-4" />}
              label="Ping"
              value={networkStatus.ping ?? "Loading..."}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
