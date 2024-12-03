import React, { useEffect, useState, useRef } from "react";
import { FaDownload, FaUpload, FaWifi } from "react-icons/fa";

const NetworkStatusContent = () => {
  const [networkStatus, setNetworkStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  const fetchNetworkStatus = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/network-status");
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.status === "success") {
        setNetworkStatus(data);
        setLoading(false);
      } else {
        throw new Error("Network status is unavailable.");
      }
    } catch (error) {
      console.error("Error fetching network status:", error);
      setNetworkStatus(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkStatus();

    intervalRef.current = setInterval(() => {
      fetchNetworkStatus();
    }, 10000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg animate-pulse">
        <h1 className="text-1xl text-center text-gray-400">Loading...</h1>
      </div>
    );
  }

  if (!networkStatus) {
    return (
      <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-[#00BFFF]">Network Status</h3>
        <p className="text-sm text-gray-400">Failed to load network status.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg">
      <h1 className="text-xl font-semibold text-[#00BFFF] w-full sm:w-auto">
        Status: <span className="font-semibold text-green-500">Online</span>
      </h1>
      <hr className="my-4 border-t border-[#444]" />

      {/* Network Speed Section */}
      <div className="mt-4 space-y-4 text-sm text-gray-400">
        <div className="flex items-center space-x-3">
          <FaDownload className="text-[#00BFFF]" />
          <p>
            <strong>Download Speed:</strong>{" "}
            {networkStatus.download_speed.toFixed(2)} Mbps
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <FaUpload className="text-[#00BFFF]" />
          <p>
            <strong>Upload Speed:</strong>{" "}
            {networkStatus.upload_speed.toFixed(2)} Mbps
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <FaWifi className="text-[#00BFFF]" />
          <p>
            <strong>Ping:</strong> {networkStatus.ping} ms
          </p>
        </div>
      </div>

      {/* Network Information Section */}
      <div className="mt-8 space-y-4 text-sm text-gray-400">
        <h2 className="text-xl font-semibold text-[#00BFFF]">
          Network Information
        </h2>
        <p>
          <strong>Local IP:</strong> {networkStatus.network_info["Local IP"]}
        </p>
        <p>
          <strong>External IP:</strong>{" "}
          {networkStatus.network_info["External IP"]}
        </p>
        <p>
          <strong>MAC Address:</strong>{" "}
          {networkStatus.network_info["MAC Address"]}
        </p>
        <p>
          <strong>IP Address:</strong> {networkStatus.network_info["IP"]}
        </p>
      </div>
    </div>
  );
};

export default NetworkStatusContent;
