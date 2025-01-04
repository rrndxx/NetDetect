const AboutSection = () => (
  <section
    id="about"
    className="py-16 sm:py-20 px-8 sm:px-10 lg:px-24 bg-gradient-to-r from-gray-800 to-gray-900"
  >
    <div className="container mx-auto space-y-12">
      <h3 className="text-3xl sm:text-4xl md:text-5xl text-[#00BFFF] text-center mb-12 tracking-wide drop-shadow-lg">
        About Us
      </h3>

      {/* Section 1 */}
      <div className="space-y-6">
        <p className="text-md text-neutral-400 leading-relaxed text-center">
          NetDetect: A Centralized Network Monitoring System is designed to
          enhance the way institutions manage and secure their networks.
          Developed by researchers from CRMC-College of Computer Studies, the
          project offers cutting-edge solutions to ensure real-time monitoring,
          streamline device authorization, and evaluate network health. In an
          increasingly digital environment, a robust network infrastructure is
          essential, especially for educational institutions like schools.
        </p>
      </div>

      {/* Section 2 */}
      <div className="flex flex-col lg:flex-row items-start gap-12">
        {/* Left Text Block */}
        <div className="lg:w-1/2">
          <h4 className="text-2xl font-semibold text-[#00BFFF] mb-4">
            Collaborative Research Approach
          </h4>
          <p className="text-md text-neutral-400 leading-relaxed">
            The development of NetDetect is driven by collaboration and data
            collection. Interviews with technical personnel and relevant staff
            enable us to identify critical areas of concern in network
            management and security. By understanding these challenges, we aim
            to create a system tailored to meet the specific needs of
            institutions.
          </p>
        </div>
        {/* Right Supporting Text */}
        <div className="lg:w-1/2">
          <p className="text-md text-neutral-400 leading-relaxed">
            Additionally, we invite administrators and staff to participate in
            user testing. Through their feedback, gathered via a structured
            questionnaire, we ensure the system’s effectiveness and usability
            for educational environments. Together, we aspire to make networks
            safer and more efficient.
          </p>
        </div>
      </div>

      {/* Section 3 */}
      <div className="flex flex-col lg:flex-row-reverse items-start gap-12">
        {/* Right Text Block */}
        <div className="lg:w-1/2">
          <h4 className="text-2xl font-semibold text-[#00BFFF] mb-4">
            Upholding Ethical Standards
          </h4>
          <p className="text-md text-neutral-400 leading-relaxed">
            Our research adheres strictly to ethical standards. We prioritize
            obtaining informed consent from all participants and ensuring their
            privacy and confidentiality throughout the project. We are committed
            to transparency and ethical responsibility in all phases of the
            research and development process.
          </p>
        </div>
        {/* Left Supporting Text */}
        <div className="lg:w-1/2">
          <p className="text-md text-neutral-400 leading-relaxed">
            By focusing on the principles of respect, confidentiality, and
            inclusivity, we aim to foster trust and collaboration with the
            institutions we work with. These values are at the heart of our
            mission to create impactful and sustainable technological solutions.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;
