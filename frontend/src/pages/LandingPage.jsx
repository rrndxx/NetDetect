import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const navigate = useNavigate();

  return (
    <div className="font-sans bg-[#121212] text-white min-h-screen flex flex-col scroll-smooth">
      {/* Navbar */}
      <nav className="bg-[#121212] p-4 sm:px-8 md:px-10 shadow-xl sticky top-0 z-20 transition-all duration-300 hover:shadow-2xl">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00BFFF] tracking-wide">
            NetDetect
          </h1>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-10 items-center">
            <a
              href="#features"
              className="text-lg sm:text-xl font-semibold hover:text-[#00BFFF] transition duration-300"
            >
              Features
            </a>
            <a
              href="#contact"
              className="text-lg sm:text-xl font-semibold hover:text-[#00BFFF] transition duration-300"
            >
              Contact
            </a>
            <a
              className="bg-[#00BFFF] text-gray-900 px-6 py-3 rounded-lg text-lg sm:text-xl font-semibold hover:scale-105 hover:bg-[#00a1e0] transition duration-200"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </a>
          </div>

          {/* Mobile Hamburger Icon */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu}>
              {menuOpen ? (
                <i className="fas fa-times text-3xl text-white"></i>
              ) : (
                <i className="fas fa-bars text-3xl text-white"></i>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu (Modal-style, below navbar) */}
      <div
        className={`${
          menuOpen ? "block" : "hidden"
        } md:hidden fixed top-16 left-0 w-full bg-[#121212] py-4 z-30 shadow-xl transition-all duration-300`}
      >
        <div className="flex flex-col gap-6 justify-center items-center">
          <a
            href="#features"
            className="text-lg font-semibold text-[#00BFFF] hover:text-[#00a1e0] transition duration-300 w-full text-center"
            onClick={toggleMenu}
          >
            Features
          </a>
          <a
            href="#contact"
            className="text-lg font-semibold text-[#00BFFF] hover:text-[#00a1e0] transition duration-300 w-full text-center"
            onClick={toggleMenu}
          >
            Contact
          </a>
          <a
            className="bg-[#00BFFF] text-gray-900 px-6 py-3 rounded-lg text-lg font-semibold hover:scale-105 hover:bg-[#00a1e0] transition duration-200 w-1/5 text-center"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </a>
        </div>
      </div>

      {/* Main Content Section */}
      <div className={`flex-grow ${menuOpen ? "mt-[140px]" : ""}`}>
        {/* Hero Section */}
        <section className="text-center py-16 sm:py-32 bg-gradient-to-r from-[#121212] via-[#2a2a2a] to-[#1f1f1f] bg-cover bg-center relative">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-[#00BFFF] tracking-wide relative z-10 shadow-lg">
            Centralized Network Monitoring System
          </h2>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed relative z-10 mb-6 sm:mb-8">
            Secure, manage, and monitor your networks with powerful tools, all
            from a single platform.
          </p>
          <button
            onClick={() => {
              navigate("/login");
            }}
            className="bg-[#00BFFF] text-gray-900 px-8 py-4 rounded-lg text-lg sm:text-xl font-semibold transform transition-all duration-300 hover:scale-110 hover:bg-[#00a1e0] relative z-10 shadow-xl hover:shadow-2xl"
          >
            Get Started
          </button>
        </section>

        {/* Features Section */}  
        <section id="features" className="py-16 sm:py-24 bg-[#121212]">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl text-[#00BFFF] font-extrabold mb-8 sm:mb-12">
              Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
              {[
                {
                  title: "Centralized Admin Dashboard",
                  description:
                    "Manage all networks from a single, intuitive dashboard.",
                  icon: "fas fa-tachometer-alt",
                },
                {
                  title: "Network Monitoring",
                  description:
                    "Real-time updates on network traffic and connected devices.",
                  icon: "fas fa-network-wired",
                },
                {
                  title: "IP/MAC Address Authorization",
                  description:
                    "Quickly authorize or block unauthorized devices.",
                  icon: "fas fa-lock",
                },
                {
                  title: "Bandwidth Usage Tracking",
                  description:
                    "Track and manage bandwidth usage to prevent overuse.",
                  icon: "fas fa-chart-line",
                },
                {
                  title: "Mobile Responsiveness",
                  description:
                    "Access the dashboard from your mobile device anywhere.",
                  icon: "fas fa-mobile-alt",
                },
                {
                  title: "Notifications",
                  description:
                    "Receive alerts for critical network events in real-time.",
                  icon: "fas fa-bell",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <i
                    className={`${feature.icon} text-[#00BFFF] text-4xl mb-4`}
                  ></i>
                  <h3 className="text-2xl font-semibold mb-4 text-[#00BFFF]">
                    {feature.title}
                  </h3>
                  <p className="text-lg">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="bg-[#121212] py-16 sm:py-24">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl text-[#00BFFF] font-extrabold mb-6 sm:mb-8">
              Contact Us
            </h2>
            <p className="text-lg mb-6 sm:mb-8">
              Have any questions or need more information? We’re here to help!
            </p>

            {/* Contact Form */}
            <form className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00BFFF] transition duration-300 sm:col-span-2"
              />
              <textarea
                placeholder="Your Message"
                className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00BFFF] transition duration-300 sm:col-span-2"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-[#00BFFF] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-[#00a1e0] transition duration-200 sm:col-span-2"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-[#121212] text-center py-6 mt-auto">
        <p>&copy; 2024 NetDetect. All Rights Reserved.</p>
        <div className="space-x-4 mt-4">
          <a
            href="https://twitter.com"
            className="text-[#00BFFF] hover:text-white transition duration-300"
            aria-label="Twitter"
          >
            <i className="fab fa-twitter text-2xl"></i>
          </a>
          <a
            href="https://linkedin.com"
            className="text-[#00BFFF] hover:text-white transition duration-300"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin text-2xl"></i>
          </a>
          <a
            href="https://github.com"
            className="text-[#00BFFF] hover:text-white transition duration-300"
            aria-label="GitHub"
          >
            <i className="fab fa-github text-2xl"></i>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
