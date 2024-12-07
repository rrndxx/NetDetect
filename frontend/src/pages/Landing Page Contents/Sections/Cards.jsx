import React from "react";

const FeatureCard = ({ title, description, icon }) => (
  <div className="relative p-6 sm:p-8 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-90 hover:shadow-xl border border-transparent">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-10 rounded-xl"></div>
    <i className={`${icon} text-[#00BFFF] text-4xl mb-4`} />
    <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-[#00BFFF]">
      {title}
    </h3>
    <p className="text-lg leading-relaxed text-gray-300">{description}</p>
  </div>
);

export default FeatureCard;
