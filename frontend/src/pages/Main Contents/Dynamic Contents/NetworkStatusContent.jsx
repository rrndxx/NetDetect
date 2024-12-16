import React, { useEffect, useState, useRef } from "react";
import { FaDownload, FaUpload, FaWifi } from "react-icons/fa";

const NetworkStatusContent = () => {
  const [networkStatus, setNetworkStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const intervalRef = useRef(null);

  // Function to fetch the network status
  const fetchNetworkStatus = async () => {
    try {
      setError(null); // Reset the error state
      const response = await fetch("http://localhost:5000/api/network-status");

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Response from API:", data);

      if (data.status === "success") {
        setNetworkStatus(data); // Set the network status
        setLoading(false); // Mark loading as false
      } else if (data.status === "loading") {
        console.log("Network status is still loading...");
        if (attempts < 5) {
          setAttempts((prev) => prev + 1); // Increment attempts for retries
          setTimeout(fetchNetworkStatus, 5000); // Retry after 5 seconds
        } else {
          throw new Error("Network status taking too long to fetch.");
        }
      } else {
        throw new Error(data.message || "Network status is unavailable.");
      }
    } catch (error) {
      console.error("Error fetching network status:", error);
      setError(error.message);
      setNetworkStatus(null);
      setLoading(false); // Stop loading when error occurs
    }
  };

  useEffect(() => {
    fetchNetworkStatus(); // Initial fetch on component mount

    // Set an interval to refresh network status every 10 seconds
    intervalRef.current = setInterval(() => {
      fetchNetworkStatus();
    }, 5000);

    return () => {
      clearInterval(intervalRef.current); // Cleanup on unmount
    };
  }, []);

  // If still loading, display a loading message
  if (loading) {
    return (
      <h1 className="text-1xl text-center text-gray-400 animate-pulse">
        Loading network status...
      </h1>
    );
  }

  // If there is an error, display the error message
  if (error) {
    return (
      <div className="bg-transparent p-6 rounded-lg shadow-lg">
        <p className="text-red-500 text-center animate-pulse">
          Error: {error}. Retrying in 5 seconds...
        </p>
      </div>
    );
  }

  // If no network status is available, display a fallback message
  if (!networkStatus) {
    return (
      <div className="bg-transparent p-6 rounded-lg shadow-lg">
        <p className="text-red-500 text-center">
          Unable to retrieve network status.
        </p>
      </div>
    );
  }

  // Destructure the data from the network status
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
            {download_speed ? download_speed.toFixed(2) : "Loading..."} Mbps
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <FaUpload className="text-[#00BFFF] animate-pulse" />
          <p>
            <strong>Upload Speed:</strong>{" "}
            {upload_speed ? upload_speed.toFixed(2) : "Loading..."} Mbps
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <FaWifi className="text-[#00BFFF] animate-pulse" />
          <p>
            <strong>Ping:</strong> {ping ?? "Loading..."} msF
          </p>
        </div>
      </div>

      {/* Network Information Section */}
      <div className="mt-8 space-y-4 text-sm text-gray-400">
        <h2 className="text-xl font-semibold text-[#00BFFF]">
          Network Information
        </h2>
        <p>
          <strong>Local IP:</strong> {network_info["Local IP"] || "Loading..."}
        </p>
        <p>
          <strong>External IP:</strong>{" "}
          {network_info["External IP"] || "Loading..."}
        </p>
        <p>
          <strong>MAC Address:</strong>{" "}
          {network_info["MAC Address"] || "Loading..."}
        </p>
        <p>
          <strong>IP Address:</strong> {network_info["IP"] || "Loading..."}
        </p>
      </div>
    </div>
  );
};

export default NetworkStatusContent;
