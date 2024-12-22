import { features } from "../../../constants/constants.jsx";

const FeatureSection = () => (
  <section
    id="features"
    className="py-14 sm:py-18 px-4 sm:px-6 lg:px-24 bg-gradient-to-r from-gray-800 to-gray-900"
  >
    <div className="container mx-auto text-center">
      <h3 className="text-3xl sm:text-4xl md:text-5xl text-[#00BFFF] mb-12 tracking-wide drop-shadow-lg">
        Features
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className="relative p-6 sm:p-8 md:p-10 bg-transparent placeholder:rounded-xl shadow-2xl transform transition-transform duration-300 hover:scale-90"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-10 rounded-xl pointer-events-none"></div>
            <i
              className={`${feature.icon} text-[#00BFFF] text-4xl sm:text-5xl mb-4`}
            ></i>
            <h3 className="text-lg sm:text-xl md:text-2xl mb-4 text-[#00BFFF]">
              {feature.title}
            </h3>
            <p className="text-md leading-relaxed text-gray-300">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeatureSection;
