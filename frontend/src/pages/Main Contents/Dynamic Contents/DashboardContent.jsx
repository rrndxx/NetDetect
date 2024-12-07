const DashboardContent = () => {
  return (
    <div className="grid grid-cols-1 gap-8 p-6">
      <div className="bg-transparent p-6 rounded-lg shadow-lg transition-all duration-300 hover:bg-gray-700">
        <h3 className="text-xl font-semibold text-[#00BFFF]">Network Status</h3>
        <p className="text-sm text-gray-400">Status: Online</p>
      </div>

      <div className="bg-transparent p-6 rounded-lg shadow-lg transition-all duration-300 hover:bg-gray-700">
        <h3 className="text-xl font-semibold text-[#00BFFF]">
          Device Management
        </h3>
        <p className="text-sm text-gray-400">Devices Connected: 10</p>
      </div>

      <div className="bg-transparent p-6 rounded-lg shadow-lg transition-all duration-300 hover:bg-gray-700">
        <h3 className="text-xl font-semibold text-[#00BFFF]">Usage Stats</h3>
        <p className="text-sm text-gray-400">Download: 120 Mbps</p>
        <p className="text-sm text-gray-400">Upload: 30 Mbps</p>
      </div>
    </div>
  );
};

export default DashboardContent;
