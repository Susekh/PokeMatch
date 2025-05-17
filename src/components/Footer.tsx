import { FaDiscord, FaTwitter, FaYoutube, FaMedium } from "react-icons/fa";

const socialLinks = [
  { href: "https://discord.com", icon: <FaDiscord />, label: "Discord" },
  { href: "https://twitter.com", icon: <FaTwitter />, label: "Twitter" },
  { href: "https://youtube.com", icon: <FaYoutube />, label: "YouTube" },
  { href: "https://medium.com", icon: <FaMedium />, label: "Medium" },
];

const Footer = () => {
  return (
    <footer className="w-full bg-white/5 backdrop-blur-xl border-t border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Logo or Copyright */}
        <p className="text-sm text-white/80 text-center md:text-left">
          © 2025 susekh. All rights reserved.
        </p>

        {/* Center: Socials */}
        <div className="flex items-center gap-5">
          {socialLinks.map(({ href, icon, label }, index) => (
            <a
              key={index}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl text-white/70 hover:text-white transition duration-300 ease-in-out"
            >
              {icon}
            </a>
          ))}
        </div>

        {/* Right: Privacy Link */}
        <a
          href="#privacy-policy"
          className="text-sm text-white/70 hover:text-white transition duration-300 text-center md:text-right"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
};

export default Footer;
