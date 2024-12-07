import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "./Sections/HeroSection";
import FeatureSection from "./Sections/FeatureSection";
import Footer from "./Sections/Footer";

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white min-h-screen flex flex-col scroll-smooth">
      {/* Navigation */}
      <nav className="bg-transparent p-4 sm:px-6 lg:px-8 sticky top-0 z-20 transition-all duration-300 backdrop-blur-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-lg sm:text-3xl ms-4 tracking-wide text-[#00BFFF]">
            NetDetect
          </h1>
          <div className="hidden md:flex space-x-10 items-center">
            <a
              href="#home"
              className="text-md sm:text-lg hover:text-[#00BFFF] transition duration-300"
            >
              Home
            </a>
            <a
              href="#features"
              className="text-md sm:text-lg hover:text-[#00BFFF] transition duration-300"
            >
              Features
            </a>
            <button
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-gray-900 px-6 py-3 rounded-lg text-lg sm:text-xl hover:scale-105 transition duration-200"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
          <button
            className="md:hidden text-white text-3xl"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={toggleMenu}
          >
            <i className={menuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden fixed top-16 left-0 w-full bg-transparent backdrop-blur-md py-6 z-30 shadow-xl"
        >
          <div className="flex flex-col gap-6 justify-center items-center">
            <a
              href="#home"
              className="text-lg hover:text-[#00a1e0] transition duration-300 w-full text-center"
              onClick={toggleMenu}
            >
              Home
            </a>
            <a
              href="#features"
              className="text-lg hover:text-[#00a1e0] transition duration-300 w-full text-center"
              onClick={toggleMenu}
            >
              Features
            </a>
            <button
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-gray-900 px-6 py-3 rounded-lg text-lg hover:scale-105 transition duration-200"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-grow ${menuOpen ? "mt-[140px]" : ""}`}>
        <HeroSection />
        <FeatureSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
