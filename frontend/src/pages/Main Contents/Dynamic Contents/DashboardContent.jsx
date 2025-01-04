import React, { useCallback, useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaDownload, FaUpload, FaWifi } from "react-icons/fa";

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
    <div className="grid grid-cols-1 gap-6 p-6">
      {/* Status and Device Management */}
      <div className="flex flex-wrap gap-4">
        <div className="bg-gray-800 shadow-md px-8 py-6 rounded-lg w-full sm:w-auto flex-grow">
          <h3 className="text-xl font-semibold text-[#00BFFF]">
            Network Status
          </h3>
          <p className="text-sm text-gray-400">
            Status: <span className="text-green-500">Online</span>
          </p>
        </div>
        <div className="bg-gray-800 shadow-md px-8 py-6 rounded-lg w-full sm:w-auto flex-grow">
          <h3 className="text-xl font-semibold text-[#00BFFF]">
            Device Management
          </h3>
          <p className="text-sm text-gray-400">
            Devices Connected: {connectedDevicesCount}
          </p>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="bg-gray-800 shadow-md px-8 py-6 rounded-lg w-full pb-12">
        <h3 className="text-xl font-semibold text-[#00BFFF] mb-4 text-center">
          Network Speed Stats
        </h3>
        {networkLoading ? (
          <p className="text-sm text-gray-400 text-center mb-10">Loading...</p>
        ) : networkError ? (
          <p className="text-sm text-red-500 text-center mb-10">
            Error: {networkError}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Download Card */}
            <div className="shadow-lg px-6 py-4 rounded-lg flex items-center">
              <FaDownload className="text-[#00BFFF] text-3xl me-4" />
              <div>
                <h4 className="text-lg font-semibold text-white">Download</h4>
                <p className="text-sm text-gray-400">
                  {networkStatus.download_speed?.toFixed(2) ?? "Loading..."}{" "}
                  Mbps
                </p>
              </div>
            </div>

            {/* Upload Card */}
            <div className="shadow-lg px-6 py-4 rounded-lg flex items-center">
              <FaUpload className="text-[#00BFFF] text-3xl me-4" />
              <div>
                <h4 className="text-lg font-semibold text-white">Upload</h4>
                <p className="text-sm text-gray-400">
                  {networkStatus.upload_speed?.toFixed(2) ?? "Loading..."} Mbps
                </p>
              </div>
            </div>

            {/* Ping Card */}
            <div className="shadow-lg px-6 py-4 rounded-lg flex items-center">
              <FaWifi className="text-[#00BFFF] text-3xl me-4" />
              <div>
                <h4 className="text-lg font-semibold text-white">Ping</h4>
                <p className="text-sm text-gray-400">
                  {networkStatus.ping ?? "Loading..."} ms
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
