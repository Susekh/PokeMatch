import {  FaLinkedin, FaGithub } from "react-icons/fa";
import { Link } from "react-router";

const socialLinks = [
  { href: "https://github.com/Susekh/PokeMatch", icon: <FaGithub />, label: "Github" },
  { href: "https://www.linkedin.com/in/subhranshu-sekhar-khilar-544a5b275", icon: <FaLinkedin />, label: "LinkedIn" },
];

const Footer = () => {
  return (
    <footer className="w-full bg-neutral-900 backdrop-blur-xl border-t border-white/10 text-white">
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
        <Link
          to={"/privacy-policy"}
          className="text-sm text-white/70 hover:text-white transition duration-300 text-center md:text-right"
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
