import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { FaDownload, FaUpload, FaWifi } from "react-icons/fa";

const NetworkStatusContent = () => {
  const [state, setState] = useState({
    networkStatus: null,
    loading: true,
    error: null,
  });
  const [attempts, setAttempts] = useState(0);
  const intervalRef = useRef(null);

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
    bandwidth_usage = {},
    total_bandwidth_usage = {},
  } = networkStatus;

  return (
    <div className="bg-transparent p-6">
      <h1 className="text-xl font-semibold text-[#00BFFF] mb-4">
        Status: <span className="font-semibold text-green-500">Online</span>
      </h1>
      <hr className="mb-6 border-t border-[#444]" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Network Speed Card */}
        <div className="bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#00BFFF] mb-4">
            Network Speed
          </h2>
          <div className="space-y-4 text-gray-400">
            <div className="flex items-center space-x-3">
              <FaDownload className="text-[#00BFFF]" />
              <p>
                <strong>Download Speed:</strong>{" "}
                {download_speed?.toFixed(2) ?? "Loading..."} Mbps
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <FaUpload className="text-[#00BFFF]" />
              <p>
                <strong>Upload Speed:</strong>{" "}
                {upload_speed?.toFixed(2) ?? "Loading..."} Mbps
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <FaWifi className="text-[#00BFFF]" />
              <p>
                <strong>Ping:</strong> {ping ?? "Loading..."} ms
              </p>
            </div>
          </div>
        </div>

        {/* Network Information Card */}
        <div className="bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#00BFFF] mb-4">
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
            <p>
              <strong>Router IP:</strong>{" "}
              {network_info["Router IP"] ?? "Loading..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkStatusContent;
