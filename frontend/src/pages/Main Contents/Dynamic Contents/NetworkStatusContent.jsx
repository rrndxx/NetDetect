import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { FaDownload, FaUpload, FaWifi } from "react-icons/fa";

// Reusable NetworkStatCard component for consistent design
const NetworkStatCard = ({ icon, label, value }) => (
  <div className="shadow-lg px-6 py-4 rounded-lg flex items-center justify-between bg-transparent hover:bg-gray-600 transition-all">
    <div className="flex items-center">
      {icon}
      <div className="ms-4">
        <h4 className="text-lg font-semibold text-white">{label}</h4>
        <p className="text-sm text-gray-400">{value ?? "Loading..."} mbps</p>
      </div>
    </div>
  </div>
);

const NetworkStatusContent = () => {
  const [state, setState] = useState({
    networkStatus: null,
    loading: true,
    error: null,
  });
  const [attempts, setAttempts] = useState(0);
  const intervalRef = useRef(null);

  // Fetch network status
  const fetchNetworkStatus = useCallback(async () => {
    try {
      setState((prevState) => ({ ...prevState, error: null }));
      const response = await axios.get(
        "http://localhost:5000/api/network-status"
      );

      if (response.status !== 200) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const data = response.data;
      if (data.status === "success") {
        setState({
          networkStatus: data,
          loading: false,
          error: null,
        });
      } else if (data.status === "loading") {
        if (attempts < 5) {
          setAttempts((prev) => prev + 1);
        } else {
          throw new Error("Network status taking too long to fetch.");
        }
      } else {
        throw new Error(data.message || "Network status is unavailable.");
      }
    } catch (error) {
      setState({
        networkStatus: null,
        loading: false,
        error: error.message,
      });
    }
  }, [attempts]);

  useEffect(() => {
    fetchNetworkStatus();

    intervalRef.current = setInterval(() => {
      fetchNetworkStatus();
    }, 10000);

    return () => clearInterval(intervalRef.current);
  }, [fetchNetworkStatus]);

  const { networkStatus, loading, error } = state;

  if (loading) {
    return (
      <h1 className="text-1xl text-center text-gray-400 animate-pulse">
        Loading network status...
      </h1>
    );
  }

  if (error) {
    return (
      <div className="bg-transparent p-6">
        <p className="text-red-500 text-center animate-pulse">
          Error: {error}. Retrying in 5 seconds...
        </p>
      </div>
    );
  }

  if (!networkStatus) {
    return (
      <div className="bg-transparent p-6">
        <p className="text-red-500 text-center">
          Unable to retrieve network status.
        </p>
      </div>
    );
  }

  const {
    download_speed,
    upload_speed,
    ping,
    network_info = {},
  } = networkStatus;

  return (
    <div className="bg-transparent p-6">
      {/* Header Section */}
      <div className="bg-[#1F2937] shadow-md px-8 py-6 rounded-lg mb-8 max-w-full mx-auto">
        <p className="text-sm text-gray-400 mt-2">
          Welcome to your Network Status Dashboard! Here, you can view real-time
          data about your network performance and details.
        </p>
      </div>
      {/* Header Section */}
      <hr className="mb-6 border-t border-[#444]" />
      <h1 className="text-xl font-semibold text-[#00BFFF] mb-4">
        Status: <span className="font-semibold text-green-500">Online</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Network Speed Card */}
        <div className="bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl text-center font-semibold text-[#00BFFF] mb-4">
            Network Speed
          </h2>
          <div className="space-y-4 text-gray-400">
            <NetworkStatCard
              icon={<FaDownload className="text-[#00BFFF]" />}
              label="Download Speed"
              value={download_speed?.toFixed(2) ?? "Loading..."} // Fallback for loading state
            />
            <NetworkStatCard
              icon={<FaUpload className="text-[#00BFFF]" />}
              label="Upload Speed"
              value={upload_speed?.toFixed(2) ?? "Loading..."}
            />
            <NetworkStatCard
              icon={<FaWifi className="text-[#00BFFF]" />}
              label="Ping"
              value={ping ?? "Loading..."}
            />
          </div>
        </div>

        {/* Network Information Card */}
        <div className="bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl text-center font-semibold text-[#00BFFF] mb-6">
            Network Information
          </h2>
          <div className="space-y-2 text-gray-400">
            <p>
              <strong>Local IP:</strong>{" "}
              {network_info["Local IP"] ?? "Loading..."}
            </p>
            <p>
              <strong>External IP:</strong>{" "}
              {network_info["External IP"] ?? "Loading..."}
            </p>
            <p>
              <strong>MAC Address:</strong>{" "}
              {network_info["MAC Address"] ?? "Loading..."}
            </p>
            <p>
              <strong>IP Address:</strong> {network_info["IP"] ?? "Loading..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkStatusContent;
