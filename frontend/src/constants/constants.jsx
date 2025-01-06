import {
  FaCogs,
  FaWifi,
  FaMobileAlt,
  FaTachometerAlt,
  FaChartLine,
  FaBell,
  FaFile,
  FaUserLock,
} from "react-icons/fa";

export const features = [
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

export const benefits = [
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

export const FooterLinks = [
  {
    href: "https://instagram.com/rrndxx",
    icon: "fab fa-instagram",
    label: "Instagram",
  },
  {
    href: "https://facebook.com/rendyllryan.cabardo",
    icon: "fab fa-facebook",
    label: "Facebook",
  },
  { href: "https://github.com/rrndxx", icon: "fab fa-github", label: "GitHub" },
];

export const menuItems = [
  { name: "dashboard", icon: <FaChartLine />, label: "Dashboard" },
  { name: "networkStatus", icon: <FaWifi />, label: "Network Status" },
  {
    name: "connectedDevices",
    icon: <FaMobileAlt />,
    label: "Connected Devices",
  },
  {
    name: "bandwidthUsage",
    icon: <FaTachometerAlt />,
    label: "Bandwidth Usage",
  },
  { name: "macFiltering", icon: <FaUserLock />, label: "MAC Filtering" },
  { name: "notifications", icon: <FaBell />, label: "Notifications" },
  { name: "logs", icon: <FaFile />, label: "Logs" },
];
