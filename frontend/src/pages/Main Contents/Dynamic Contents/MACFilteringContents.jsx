import React, { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";

const MacFilteringPage = () => {
  const [macFilterState, setMacFilterState] = useState({
    macAddresses: [],
    newMacAddress: "", // Input value for new MAC address
    newDeviceType: "", // Input value for new Device Type
    loading: false,
    error: null,
  });

  // Simulated MAC Addresses and data
  const initialMacAddresses = [
    {
      macAddress: "00:14:22:01:23:45",
      deviceType: "Laptop",
      timestamp: "2025-01-01 10:00:00",
    },
    {
      macAddress: "00:14:22:01:23:46",
      deviceType: "Smartphone",
      timestamp: "2025-01-02 11:30:00",
    },
    {
      macAddress: "00:14:22:01:23:47",
      deviceType: "Tablet",
      timestamp: "2025-01-03 09:15:00",
    },
  ];

  useEffect(() => {
    // Simulate initial fetch (using the static initialMacAddresses)
    setMacFilterState((prevState) => ({
      ...prevState,
      macAddresses: initialMacAddresses,
    }));
  }, []);

  const handleInputChange = (e, field) => {
    setMacFilterState((prevState) => ({
      ...prevState,
      [field]: e.target.value,
    }));
  };

  const addMacAddress = () => {
    const { newMacAddress, newDeviceType } = macFilterState;
    if (!newMacAddress || !newDeviceType) return;

    const newDevice = {
      macAddress: newMacAddress,
      deviceType: newDeviceType,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    // Simulate adding the MAC address
    setMacFilterState((prevState) => ({
      ...prevState,
      macAddresses: [...prevState.macAddresses, newDevice],
      newMacAddress: "", // Clear input after adding
      newDeviceType: "", // Clear input after adding
    }));
  };

  const removeMacAddress = (macAddress) => {
    // Simulate removing the MAC address from the list
    setMacFilterState((prevState) => ({
      ...prevState,
      macAddresses: prevState.macAddresses.filter(
        (device) => device.macAddress !== macAddress
      ),
    }));
  };

  const { macAddresses, newMacAddress, newDeviceType, loading, error } =
    macFilterState;

  return (
    <div className="grid grid-cols-1 gap-6 p-6">
      <div className="bg-[#1F2937] shadow-md px-8 py-6 rounded-lg mb-8 max-w-full mx-auto">
        <p className="text-sm text-gray-400 mt-2">
          Welcome to your MAC Filtering Dashboard! Here, you can manually block certain MAC addresses and view your blocked list.
        </p>
      </div>
      {/* MAC Address Input and Action */}
      <div className="bg-gray-800 shadow-md px-8 py-6 rounded-lg w-full mb-2">
        <h4 className="text-lg font-semibold text-[#00BFFF] mb-4">
          Block a Device
        </h4>
        <div className="flex gap-4 items-center mb-4">
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg bg-transparent border-2 border-gray-500 text-white"
            placeholder="Enter MAC address"
            value={newMacAddress}
            onChange={(e) => handleInputChange(e, "newMacAddress")}
          />
          <button
            onClick={addMacAddress}
            className="bg-[#00BFFF] px-6 py-2 rounded-lg text-white"
          >
            Confirm
          </button>
        </div>
      </div>

      {/* Blocked MAC Addresses List (Table) */}
      <div className="bg-gray-800 shadow-md px-8 py-6 rounded-lg w-full">
        <h3 className="text-xl font-semibold text-[#00BFFF] mb-4 text-center">
          Blocked MAC Addresses
        </h3>

        {loading ? (
          <p className="text-sm text-gray-400 text-center mb-10">Loading...</p>
        ) : error ? (
          <p className="text-sm text-red-500 text-center mb-10">
            Error: {error}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm">
              <thead>
                <tr className="text-left text-gray-400">
                  <th className="py-2 px-4">MAC Address</th>
                  <th className="py-2 px-4">Device Type</th>
                  <th className="py-2 px-4">Timestamp</th>
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {macAddresses.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-400">
                      No blocked MAC addresses
                    </td>
                  </tr>
                ) : (
                  macAddresses.map((device) => (
                    <tr key={device.macAddress} className="text-white">
                      <td className="py-2 px-4">{device.macAddress}</td>
                      <td className="py-2 px-4">{device.deviceType}</td>
                      <td className="py-2 px-4">{device.timestamp}</td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => removeMacAddress(device.macAddress)}
                          className="text-red-500 hover:text-red-700 flex items-center"
                        >
                          <FaTrashAlt className="me-2" />
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MacFilteringPage;
