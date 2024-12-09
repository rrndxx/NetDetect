import React from "react";
import { Check } from "lucide-react";

const benefits = [
  {
    text: "Enhanced Network Security",
    description:
      "Identify and manage unauthorized access to keep your network secure.",
  },
  {
    text: "Improved Performance",
    description:
      "Monitor and manage bandwidth usage to ensure your network performs optimally.",
  },
  {
    text: "Effortless Scalability",
    description:
      "Add more devices and expand coverage with ease as your network grows.",
  },
  {
    text: "Actionable Insights",
    description:
      "Data-driven insights to prevent issues before they impact users.",
  },
];

const BenefitsSection = () => (
  <section
    id="benefits"
    className="py-12 sm:py-24 px-6 sm:px-12 lg:px-24 bg-gradient-to-r from-gray-800 to-gray-900"
  >
    <div className="container mx-auto text-center">
      <h3 className="text-3xl sm:text-4xl md:text-5xl text-white mb-12 tracking-wide drop-shadow-lg">
        Benefits
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-12">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="flex items-start p-6 bg-gradient-to-b from-transparent to-gray-800 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            <div className="flex-shrink-0">
              <div className="h-12 w-12 flex items-center justify-center text-green-500">
                <Check className="h-8 w-8" />
              </div>
            </div>
            <div className="ml-6">
              <h5 className="text-xl font-semibold text-white mb-2">
                {benefit.text}
              </h5>
              <p className="text-md text-neutral-400 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSection;
