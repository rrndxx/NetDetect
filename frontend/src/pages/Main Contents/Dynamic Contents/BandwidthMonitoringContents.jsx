import React, { useState, useEffect } from "react";

const BandwidthMonitoringContents = () => {
  const [bandwidthUsage, setBandwidthUsage] = useState({
    download: 0,
    upload: 0,
  });

  const fetchBandwidthUsage = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/bandwidth-usage");
      const data = await response.json();
      if (data.status === "success") {
        setBandwidthUsage(data.bandwidth_usage);
      } else {
        console.error("Error fetching bandwidth usage");
      }
    } catch (error) {
      console.error("Error fetching bandwidth usage", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchBandwidthUsage();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-transparent p-6 rounded-lg shadow-md mx-auto">
      <h3 className="text-xl font-semibold text-[#00BFFF] mb-4">
        Network Bandwidth Usage
      </h3>
      <div className="text-gray-400 mt-2 flex gap-6">
        <p className="text-[#00BFFF]">
          MBs consumed: <span className="text-gray-400">{bandwidthUsage.download.toFixed(2)} KB/s </span>
        </p>
        <p className="text-[#00BFFF]">
          Mbs sent: <span className="text-gray-400">{bandwidthUsage.upload.toFixed(2)} KB/s </span>
        </p>
      </div>
    </div>
  );
};

export default BandwidthMonitoringContents;
