import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section id="home" className="relative text-center py-15 sm:py-24">
      <div className="absolute inset-0 bg-gray-90"></div>
      <div className="relative z-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-4xl md:text-5xl mb-6 text-[#00BFFF] animate-pulse">
          Centralized Network Monitoring System
        </h2>
        <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed text-gray-300 mb-8">
          Secure, manage, and monitor your networks with powerful tools, all
          from a single platform.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-gradient-to-r from-blue-500 to-blue-800 text-gray-900 px-8 py-4 rounded-lg text-lg sm:text-xl transform transition-all duration-300 hover:scale-125 hover:animate-none"
        >
          Get Started
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
