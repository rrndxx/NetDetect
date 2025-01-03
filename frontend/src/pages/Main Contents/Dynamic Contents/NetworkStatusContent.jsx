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
      setState((prevState) => ({ ...prevState, error: null })); // Reset the error state
      const response = await axios.get(
        "http://localhost:5000/api/network-status"
      );

      if (response.status !== 200) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const data = response.data;
      console.log("Response from API:", data);

      if (data.status === "success") {
        setState({
          networkStatus: data,
          loading: false,
          error: null,
        });
      } else if (data.status === "loading") {
        console.log("Network status is still loading...");
        if (attempts < 5) {
          setAttempts((prev) => prev + 1);
        } else {
          throw new Error("Network status taking too long to fetch.");
        }
      } else {
        throw new Error(data.message || "Network status is unavailable.");
      }
    } catch (error) {
      console.error("Error fetching network status:", error);
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
      <div className="bg-transparent p-6 rounded-lg shadow-lg">
        <p className="text-red-500 text-center animate-pulse">
          Error: {error}. Retrying in 5 seconds...
        </p>
      </div>
    );
  }

  if (!networkStatus) {
    return (
      <div className="bg-transparent p-6 rounded-lg shadow-lg">
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
    <div className="bg-transparent p-6 rounded-lg shadow-lg">
      <h1 className="text-xl font-semibold text-[#00BFFF] w-full sm:w-auto">
        Status: <span className="font-semibold text-green-500">Online</span>
      </h1>
      <hr className="my-4 border-t border-[#444]" />

      {/* Network Speed Section */}
      <div className="mt-4 space-y-4 text-sm text-gray-400">
        <div className="flex items-center space-x-3">
          <FaDownload className="text-[#00BFFF] animate-pulse" />
          <p>
            <strong>Download Speed:</strong>{" "}
            {download_speed?.toFixed(2) ?? "Loading..."} Mbps
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <FaUpload className="text-[#00BFFF] animate-pulse" />
          <p>
            <strong>Upload Speed:</strong>{" "}
            {upload_speed?.toFixed(2) ?? "Loading..."} Mbps
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <FaWifi className="text-[#00BFFF] animate-pulse" />
          <p>
            <strong>Ping:</strong> {ping ?? "Loading..."} ms
          </p>
        </div>
      </div>

      {/* Network Information Section */}
      <div className="mt-8 space-y-4 text-sm text-gray-400">
        <h2 className="text-xl font-semibold text-[#00BFFF]">
          Network Information
        </h2>
        <p>
          <strong>Local IP:</strong> {network_info["Local IP"] ?? "Loading..."}
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
  );
};

export default NetworkStatusContent;
