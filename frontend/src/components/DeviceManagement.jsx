import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

// Connect to the backend Socket.IO server
const socket = io("http://localhost:5000");

const DeviceManagement = ({ toggleSidebar }) => {
  const [networkInfo, setNetworkInfo] = useState({});
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [newDevice, setNewDevice] = useState({
    hostname: "",
    ip: "",
    mac: "",
    status: "Active", // Default status
  });
  const firstRender = useRef(true); // Reference to track the first render

  useEffect(() => {
    // Only connect once during the first render and handle updates
    if (firstRender.current) {
      // Start monitoring once on the first render
      socket.emit("start_monitoring");
      firstRender.current = false;
    }

    // Listen for network information
    socket.on("network_info", (info) => {
      setNetworkInfo(info);
      setError(null);
    });

    // Listen for device updates from backend and update the state
    socket.on("device_update", (deviceList) => {
      setDevices(deviceList); // Update the devices state with data from backend
      setLoading(false); // Set loading to false once devices are received
    });

    // Listen for errors
    socket.on("network_error", (err) => {
      setError(err.message);
      setLoading(false); // Stop loading on error
    });

    return () => {
      // Clean up the WebSocket connection on unmount
      socket.disconnect();
    };
  }, []); // Empty dependency array to ensure this only runs once (on mount)

  // Handle form change for adding a new device
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDevice({ ...newDevice, [name]: value });
  };

  // Handle device addition to whitelist
  const handleAddDevice = () => {
    socket.emit("add_to_whitelist", newDevice); // Send device info to backend
    setIsModalOpen(false); // Close the modal
    setNewDevice({ hostname: "", ip: "", mac: "", status: "Active" }); // Reset the form
  };

  return (
    <div className="flex-1 p-6 md:ml-64 bg-gray-900 transition-all duration-300">
      {/* Header Section */}
      <div className="flex justify-start items-center mb-8">
        <button
          className="md:hidden text-[#00d4ff] text-2xl"
          onClick={toggleSidebar}
        >
          &#9776;
        </button>
        <h1 className="text-3xl font-semibold text-[#00d4ff] ps-5">
          Device Management
        </h1>
      </div>

      {/* Main Content */}
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-[#00d4ff] mb-4 text-center">
          Network Monitor
        </h1>
        <hr />
        {error ? (
          <div className="text-red-500 text-lg font-semibold">
            <p>{error}</p>
            <button
              onClick={() => {
                setLoading(true); // Reset loading state
                socket.emit("start_monitoring"); // Restart monitoring
              }}
              className="text-[#00d4ff] underline mt-2"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="mt-4">
            {/* Network Info Section */}
            <div className="flex justify-between sm:flex-row lg:flex-col mb-[40px]">
              <p className="text-gray-300 mb-1">
                <strong className="text-[#00d4ff]">Interface:</strong>{" "}
                {networkInfo.interface || "N/A"}
              </p>
              <p className="text-gray-300 mb-4">
                <strong className="text-[#00d4ff]">IP Range:</strong>{" "}
                {networkInfo.ip_range || "N/A"}
              </p>
            </div>

            {/* Add Device Button */}
            <div className="flex justify-between mb-[100px]">
              <h2 className="text-xl font-semibold mb-2 justify-center">
                Connected Devices
              </h2>
              <button
                onClick={() => setIsModalOpen(true)} // Open modal
                className="px-4 py-2 bg-[#00d4ff] text-white rounded-lg hover:bg-[#00b8cc]"
              >
                Add Device to Whitelist
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center">
                <svg
                  className="animate-spin h-8 w-8 border-t-2 border-b-2 border-[#00d4ff] rounded-full"
                  viewBox="0 0 24 24"
                ></svg>
                <p className="ml-2">Loading devices...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {devices.length > 0 ? (
                  <table className="min-w-full border border-gray-700 text-sm">
                    <thead>
                      <tr className="bg-gray-700 text-[#00d4ff]">
                        <th className="py-2 px-4 border-b border-gray-600 text-left">
                          Hostname
                        </th>
                        <th className="py-2 px-4 border-b border-gray-600 text-left">
                          IP Address
                        </th>
                        <th className="py-2 px-4 border-b border-gray-600 text-left">
                          MAC Address
                        </th>
                        <th className="py-2 px-4 border-b border-gray-600 text-left">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {devices.map((device, index) => (
                        <tr
                          key={index}
                          className={`${
                            index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                          } hover:bg-gray-600`}
                        >
                          <td className="py-2 px-4 border-b border-gray-600">
                            {device.hostname || "Unknown"}
                          </td>
                          <td className="py-2 px-4 border-b border-gray-600">
                            {device.ip || "Unknown"}
                          </td>
                          <td className="py-2 px-4 border-b border-gray-600">
                            {device.mac || "Unknown"}
                          </td>
                          <td className="py-2 px-4 border-b border-gray-600">
                            {device.status || "Unknown"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-300">No devices found.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal for Adding Device */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={() => setIsModalOpen(false)} // Close modal on overlay click
        >
          <div
            className="bg-gray-800 p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
          >
            <h3 className="text-2xl font-semibold text-[#00d4ff] mb-4">
              Add Device to Whitelist
            </h3>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">MAC Address</label>
              <input
                type="text"
                name="mac"
                value={newDevice.mac}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 text-white rounded-lg"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleAddDevice} // Submit new device
                className="px-4 py-2 bg-[#00d4ff] text-white rounded-lg"
              >
                Add Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManagement;
