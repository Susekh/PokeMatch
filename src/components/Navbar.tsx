import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import Button from "./Button";
import { Link } from "react-router";

// If you're using react-router-dom instead of react-router:
/// import { Link } from "react-router-dom";

const navItems = ["Instructions", "About"];

const NavBar: React.FC = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);

  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const navContainerRef = useRef<HTMLDivElement | null>(null);

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  useEffect(() => {
    const audio = audioElementRef.current;
    if (!audio) return;

    if (isAudioPlaying) {
      void audio.play(); // void to silence Promise warning
    } else {
      audio.pause();
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    const nav = navContainerRef.current;
    if (!nav) return;

    if (currentScrollY === 0) {
      setIsNavVisible(true);
      nav.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      nav.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      nav.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    const nav = navContainerRef.current;
    if (!nav) return;

    gsap.to(nav, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  return (
    <div
      ref={navContainerRef}
      className={clsx(
        "fixed inset-x-0 top-4 z-50 h-16 sm:inset-x-6 transition-all duration-700",
        "backdrop-blur-md bg-white/10 border border-white/20 shadow-lg rounded-xl"
      )}
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between px-4 py-2">
          {/* Logo and Button */}
          <div className="flex items-center gap-7">
            <Link to="/">
              <img src="/img/logo.png" alt="logo" className="w-10" />
            </Link>

            <Link to="/play">
              <Button
                id="play-button"
                title="play now"
                rightIcon={<TiLocationArrow />}
                containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
              />
            </Link>
          </div>

          {/* Links and Audio */}
          <div className="flex h-full items-center">
            <div className="text-xs md:block">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={`/${item.toLowerCase()}`}
                  className="nav-hover-btn text-white"
                >
                  {item}
                </Link>
              ))}
            </div>

            <button
              onClick={toggleAudioIndicator}
              className="ml-10 flex items-center space-x-0.5"
            >
              <audio
                ref={audioElementRef}
                className="hidden"
                src="/audio/loop.mp3"
                loop
              />
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx("indicator-line bg-white", {
                    active: isIndicatorActive,
                  })}
                  style={{ animationDelay: `${bar * 0.1}s` }}
                />
              ))}
            </button>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavBar;
