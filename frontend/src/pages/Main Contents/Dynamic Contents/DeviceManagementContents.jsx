import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import emailjs from "emailjs-com"; // Make sure to install EmailJS via npm or yarn
import { useNotifications } from "../../../context/NotificationsContext";

// Reusable TableRow component for consistent table design
const TableRow = ({ device }) => (
  <tr className="rounded-sm hover:bg-gray-800 transition-all">
    <td className="px-4 py-2">
      {device.hostname || <span className="text-gray-500">Unknown</span>}
    </td>
    <td className="px-4 py-2">
      {device.ip_address || <span className="text-gray-500">Unknown</span>}
    </td>
    <td className="px-4 py-2">
      {device.mac_address || <span className="text-gray-500">Unknown</span>}
    </td>
    <td className="px-4 py-2">
      {device.device_type || <span className="text-gray-500">Unknown</span>}
    </td>
    <td className="px-4 py-2">
      {device.os || <span className="text-gray-500">Unknown</span>}
    </td>
  </tr>
);

const DeviceManagementContents = () => {
  const [state, setState] = useState({
    devices: [],
    allDevices: [], // This will store all detected devices
    loading: true,
    error: null,
  });
  const prevDevicesRef = useRef([]);
  const notifiedDevicesRef = useRef(new Set()); // To track notified devices by mac_address
  const { addNotification } = useNotifications();

  // Function to send email via EmailJS
  const sendEmailNotification = (newDevice) => {
    const templateParams = {
      to_email: "rendyllcabardo11@gmail.com", // Replace with your email
      device_ip: newDevice.ip_address,
      device_mac: newDevice.mac_address,
      device_hostname: newDevice.hostname || "Unknown",
      device_type: newDevice.device_type || "Unknown",
      device_os: newDevice.os || "Unknown",
    };

    // Check if the device has already been notified
    if (!notifiedDevicesRef.current.has(newDevice.mac_address)) {
      // Send email via EmailJS asynchronously
      // emailjs
      //   .send(
      //     import.meta.env.VITE_EMAILJS_SERVICE_ID,
      //     import.meta.env.VITE_EMAILJS_TEMPLATE_ID2,
      //     templateParams,
      //     import.meta.env.VITE_EMAILJS_USER_ID
      //   )
      //   .then(
      //     (response) => {
      //       console.log("Email sent successfully:", response);
      //       notifiedDevicesRef.current.add(newDevice.mac_address);
      //     },
      //     (error) => {
      //       console.error("Error sending email:", error);
      //     }
      //   );
    }
  };

  // Fetch device data
  const fetchDevices = useCallback(async () => {
    try {
      setState((prevState) => ({ ...prevState, error: null }));
      const response = await axios.get("http://localhost:5000/api/devices");
      const newDevices = response.data.devices || [];

      // Check for new devices by comparing against the previous list
      const newDevicesList = newDevices.filter(
        (newDevice) =>
          !prevDevicesRef.current.some(
            (prevDevice) => prevDevice.mac_address === newDevice.mac_address
          )
      );

      // For each new device, send an email notification
      newDevicesList.forEach((newDevice) => {
        sendEmailNotification(newDevice);
      });

      // Add new devices to the notifications system
      newDevicesList.forEach((newDevice) => {
        addNotification({
          message: `Detected new device: ${newDevice.hostname || "Unknown"} (${
            newDevice.ip_address
          })`,
          timestamp: new Date().toISOString(),
        });
      });

      // Update state: merge new devices into the `allDevices` list
      setState((prevState) => ({
        devices: newDevices, // Update with the latest devices detected
        allDevices: [...prevState.allDevices, ...newDevicesList], // Append new devices to the allDevices list
        loading: false,
        error: null,
      }));

      // Update previous devices reference to current devices
      prevDevicesRef.current = newDevices;
    } catch (err) {
      console.error("Error fetching devices:", err);
      setState({
        devices: [],
        loading: false,
        error: err?.response?.data?.message || "Failed to fetch devices.",
      });
    }
  }, [addNotification]);

  useEffect(() => {
    fetchDevices();
    const intervalId = setInterval(fetchDevices, 60000); // Fetch devices every 60 seconds

    return () => clearInterval(intervalId);
  }, [fetchDevices]);

  const { devices, loading, error, allDevices } = state;

  if (loading) {
    return (
      <div className="text-center mt-6">
        <p className="text-gray-400 text-center animate-pulse">
          Loading devices...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-6">
        <p className="text-red-500 text-center">
          {error}. Retrying in 60 seconds...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-transparent p-6">
      {/* Header Section */}
      <div className="bg-[#1F2937] shadow-md px-8 py-6 rounded-lg mb-8 max-w-full mx-auto">
        <p className="text-sm text-gray-400 mt-2">
          Welcome to your Connected Devices Dashboard! Here, you can view
          real-time data about all connected devices.
        </p>
      </div>
      <hr className="mb-6 border-t border-[#444]" />
      <p className="text-xl font-semibold text-[#00BFFF] mb-4">
        Devices Connected: {devices.length}
      </p>

      {/* No devices case */}
      {devices.length === 0 ? (
        <p className="text-center text-gray-400">
          No devices detected. Please try again later.
        </p>
      ) : (
        <div className="overflow-x-auto shadow-xl">
          {/* Device Table */}
          <table className="w-full text-center text-xs text-gray-300">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="px-4 py-2">Hostname</th>
                <th className="px-4 py-2">IP Address</th>
                <th className="px-4 py-2">MAC Address</th>
                <th className="px-4 py-2">Device Type</th>
                <th className="px-4 py-2">OS</th>
              </tr>
            </thead>
            <tbody>
              {allDevices.map((device, index) => (
                <TableRow key={index} device={device} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeviceManagementContents;
