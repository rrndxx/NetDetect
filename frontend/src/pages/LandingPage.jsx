import React, { useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/clerk-react";
import HeroSection from "./Landing Page Contents/Sections/HeroSection";
import FeatureSection from "./Landing Page Contents/Sections/FeatureSection";
import BenefitsSection from "./Landing Page Contents/Sections/BenefitsSection";
import Footer from "./Landing Page Contents/Sections/Footer";
import AboutSection from "./Landing Page Contents/Sections/AboutSection";
import ContactUsSection from "./Landing Page Contents/Sections/ContactUsSection";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white min-h-screen flex flex-col scroll-smooth">
      {/* Navigation */}
      <nav className="bg-transparent p-4 sm:px-6 lg:px-8 sticky top-0 z-20 transition-all duration-300 backdrop-blur-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1
            className="text-3xl ms-4 tracking-wide text-[#00BFFF] cursor-pointer"
            onClick={() => navigate("/")}
          >
            NetDetect
          </h1>
          <div className="hidden md:flex items-center space-x-10">
            <div className="space-x-10 items-center">
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
              <a
                href="#benefits"
                className="text-md sm:text-lg hover:text-[#00BFFF] transition duration-300"
              >
                Benefits
              </a>
              <a
                href="#about"
                className="text-md sm:text-lg hover:text-[#00BFFF] transition duration-300"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-md sm:text-lg hover:text-[#00BFFF] transition duration-300"
              >
                Contact
              </a>
            </div>
            <SignedOut>
              <SignInButton forceRedirectUrl={"/main content"} mode="modal">
                <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-gray-900 px-6 py-3 rounded-md shadow-lg text-lg sm:text-xl hover:scale-105 transition duration-200">
                  Login
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <SignOutButton redirectUrl="/">
                <button className="bg-red-500 text-white px-6 py-3 rounded-md shadow-lg text-lg hover:bg-red-600 sm:text-xl hover:scale-105 transition duration-200">
                  Logout
                </button>
              </SignOutButton>
            </SignedIn>
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
          className="md:hidden fixed top-16 left-0 w-full bg-transparent backdrop-blur-md py-4 z-30 shadow-xl"
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
            <a
              href="#benefits"
              className="text-lg hover:text-[#00a1e0] transition duration-300 w-full text-center"
              onClick={toggleMenu}
            >
              Benefits
            </a>
            <a
              href="#about"
              className="text-lg hover:text-[#00a1e0] transition duration-300 w-full text-center"
              onClick={toggleMenu}
            >
              About
            </a>
            <a
              href="#contact"
              className="text-lg hover:text-[#00a1e0] transition duration-300 w-full text-center"
              onClick={toggleMenu}
            >
              Contact Us
            </a>
            <SignedOut>
              <SignInButton forceRedirectUrl={"/main content"} mode="modal">
                <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-gray-900 px-6 py-3 rounded-lg text-lg hover:scale-105 transition duration-200">
                  Login
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <SignOutButton redirectUrl="/">
                <button className="bg-red-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-red-600 hover:scale-105 transition duration-200">
                  Logout
                </button>
              </SignOutButton>
            </SignedIn>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-grow ${menuOpen ? "mt-[140px]" : ""}`}>
        <HeroSection />
        <FeatureSection />
        <BenefitsSection />
        <AboutSection />
        <ContactUsSection />
        <Footer />
      </main>
    </div>
  );
};

export default LandingPage;
