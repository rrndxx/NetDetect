const DashboardContent = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-[#00BFFF]">Network Status</h3>
        <p className="text-sm text-gray-400">Status: Online</p>
      </div>
      <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-[#00BFFF]">
          Device Management
        </h3>
        <p className="text-sm text-gray-400">Devices Connected: 10</p>
      </div>
      <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-[#00BFFF]">Usage Stats</h3>
        <p className="text-sm text-gray-400">Download: 120 Mbps</p>
        <p className="text-sm text-gray-400">Upload: 30 Mbps</p>
      </div>
    </div>
  );
};

export default DashboardContent;
