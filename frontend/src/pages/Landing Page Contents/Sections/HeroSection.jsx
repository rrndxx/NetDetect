import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section id="home" className="relative text-center py-15 sm:py-24">
      <div className="absolute inset-0 bg-gray-90"></div>
      <div className="relative z-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-5xl mb-6 mt-12 md:mt-0 text-[#00BFFF] animate-pulse">
          Centralized Network Monitoring System
        </h2>
        <p className="text-sm md:text-lg max-w-3xl mx-auto leading-relaxed text-gray-300 mb-8">
          Secure, manage, and monitor your networks with powerful tools, all
          from a single platform.
        </p>
        <SignedOut>
          <SignInButton forceRedirectUrl={"/main content"} mode="modal">
            <button className="bg-gradient-to-r from-blue-500 to-blue-800 text-gray-900 px-8 py-4 rounded-md shadow-xl text-lg sm:text-xl transform transition-all duration-300 hover:scale-125 hover:animate-none">
              Get Started
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <button
            className="bg-[#00BFFF] text-white px-8 py-4 font-semibold rounded-md shadow-xl text-lg sm:text-xl transform transition-all duration-300 hover:scale-125 hover:animate-none"
            onClick={() => navigate("/main content")}
          >
            Go to Dashboard
          </button>
        </SignedIn>
      </div>
    </section>
  );
};

export default HeroSection;
