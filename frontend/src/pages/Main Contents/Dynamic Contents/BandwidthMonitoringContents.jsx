import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { FaDownload, FaUpload } from "react-icons/fa";

const BandwidthMonitoringContents = () => {
  const [state, setState] = useState({
    bandwidthUsage: null,
    loading: true,
    error: null,
  });
  const [attempts, setAttempts] = useState(0);
  const intervalRef = useRef(null);

  // Fetch bandwidth usage data
  const fetchBandwidthUsage = useCallback(async () => {
    try {
      setState((prevState) => ({ ...prevState, error: null }));
      const response = await axios.get(
        "http://localhost:5000/api/bandwidth-usage"
      );

      if (response.status !== 200) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const data = response.data;
      if (data.status === "success") {
        setState({
          bandwidthUsage: data,
          loading: false,
          error: null,
        });
      } else if (data.status === "loading") {
        if (attempts < 5) {
          setAttempts((prev) => prev + 1);
        } else {
          throw new Error("Bandwidth usage taking too long to fetch.");
        }
      } else {
        throw new Error(data.message || "Bandwidth usage is unavailable.");
      }
    } catch (error) {
      setState({
        bandwidthUsage: null,
        loading: false,
        error: error.message,
      });
    }
  }, [attempts]);

  useEffect(() => {
    fetchBandwidthUsage();
    intervalRef.current = setInterval(() => {
      fetchBandwidthUsage();
    }, 10000); // Fetch every 10 seconds

    return () => clearInterval(intervalRef.current); // Cleanup interval on component unmount
  }, [fetchBandwidthUsage]);

  const { bandwidthUsage, loading, error } = state;

  // Render loading state
  if (loading) {
    return (
      <h1 className="text-1xl text-center text-gray-400 animate-pulse">
        Loading bandwidth usage...
      </h1>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-transparent p-6">
        <p className="text-red-500 text-center animate-pulse">
          Error: {error}. Retrying in 5 seconds...
        </p>
      </div>
    );
  }

  // Render empty state
  if (!bandwidthUsage) {
    return (
      <div className="bg-transparent p-6">
        <p className="text-red-500 text-center">
          Unable to retrieve bandwidth usage.
        </p>
      </div>
    );
  }

  const {
    download_usage,
    upload_usage,
    total_download_usage,
    total_upload_usage,
  } = bandwidthUsage;

  return (
    <div className="bg-transparent p-6">
      {/* Header */}
      <div className="bg-[#1F2937] shadow-md px-8 py-6 rounded-lg mb-8 max-w-full mx-auto">
        <p className="text-sm text-gray-400 mt-2">
          Welcome to your Bandwidth Usage Dashboard! Here, you can view
          real-time data about the bandwidth usage of your network.
        </p>
      </div>

      {/* Title */}
      <hr className="mb-6 border-t border-[#444]" />
      <h2 className="text-xl font-semibold text-[#00BFFF] mb-4">
        Bandwidth Monitoring
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Current Bandwidth Usage Card */}
        <div className="bg-gray-800 shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#00BFFF] mb-4">
            Current Bandwidth Usage
          </h3>
          <div className="space-y-4 text-gray-400">
            <div className="flex items-center space-x-3">
              <FaDownload className="text-[#00BFFF]" />
              <p>
                <strong>Download:</strong>{" "}
                {download_usage?.toFixed(2) ?? "Loading..."} MB/s
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <FaUpload className="text-[#00BFFF]" />
              <p>
                <strong>Upload:</strong>{" "}
                {upload_usage?.toFixed(2) ?? "Loading..."} MB/s
              </p>
            </div>
          </div>
        </div>

        {/* Total Bandwidth Usage Card */}
        <div className="bg-gray-800 shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#00BFFF] mb-4">
            Total Bandwidth Usage
          </h3>
          <div className="space-y-4 text-gray-400">
            <div className="flex items-center space-x-3">
              <FaDownload className="text-[#00BFFF]" />
              <p>
                <strong>Download:</strong>{" "}
                {total_download_usage?.toFixed(2) ?? "Loading..."} MB
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <FaUpload className="text-[#00BFFF]" />
              <p>
                <strong>Upload:</strong>{" "}
                {total_upload_usage?.toFixed(2) ?? "Loading..."} MB
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BandwidthMonitoringContents;
