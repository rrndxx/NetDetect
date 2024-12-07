import React from "react";
import FeatureCard from "./Cards";

const features = [
  {
    title: "Centralized Admin Dashboard",
    description: "Manage all networks from a single, intuitive dashboard.",
    icon: "fas fa-tachometer-alt",
  },
  {
    title: "Network Monitoring",
    description: "Real-time updates on network traffic and connected devices.",
    icon: "fas fa-network-wired",
  },
  {
    title: "IP/MAC Address Authorization",
    description: "Quickly authorize or block unauthorized devices.",
    icon: "fas fa-lock",
  },
  {
    title: "Bandwidth Usage Tracking",
    description: "Track and manage bandwidth usage to prevent overuse.",
    icon: "fas fa-chart-line",
  },
  {
    title: "Mobile Responsiveness",
    description: "Access the dashboard from your mobile device anywhere.",
    icon: "fas fa-mobile-alt",
  },
  {
    title: "Notifications",
    description: "Receive alerts for critical network events in real-time.",
    icon: "fas fa-bell",
  },
];

const FeatureSection = () => (
  <section
    id="features"
    className="py-10 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-800 to-gray-900"
  >
    <div className="container mx-auto text-center">
      <h3 className="text-4xl text-[#00BFFF] mb-14 tracking-wide">
        Features
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  </section>
);

export default FeatureSection;
