import { FooterLinks } from "../../../constants/constants.jsx";

const Footer = () => (
  <footer className="bg-gradient-to-r from-gray-800 to-gray-900 py-6 text-center">
    <p className="text-gray-400">
      &copy; {new Date().getFullYear()} NetDetect. All Rights Reserved.
    </p>
    <div className="space-x-6 mt-4">
      {FooterLinks.map(({ href, icon, label }, index) => (
        <a
          key={index}
          href={href}
          className="text-[#00BFFF] hover:text-white transition duration-300"
          aria-label={label}
        >
          <i className={`${icon} text-2xl hover:scale-125`} />
        </a>
      ))}
    </div>
  </footer>
);

export default Footer;
