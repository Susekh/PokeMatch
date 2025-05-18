import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";

import Button from "./Button";
import { Link } from "react-router";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);
  const [videoIndex, setVideoIndex] = useState(1);

  const totalVideos = 4;

  const getVideoSrc = (index: number) => `videos/hero-${index}.mp4`;

  // Preload videos
  useEffect(() => {
    for (let i = 1; i <= totalVideos; i++) {
      const video = document.createElement("video");
      video.src = getVideoSrc(i);
      video.preload = "auto";
      video.addEventListener("canplaythrough", () => {
        setLoadedVideos((prev) => prev + 1);
      });
    }
  }, []);

  useEffect(() => {
    if (loadedVideos >= totalVideos) {
      setLoading(false);
    }
  }, [loadedVideos]);

  // Change video every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setVideoIndex((prev) => (prev % totalVideos) + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Clip path scroll animation
  useGSAP(() => {
    if (!videoContainerRef.current || !heroSectionRef.current) return;

    gsap.set(videoContainerRef.current, {
      clipPath: "circle(100% at 50% 50%)",
    });

    gsap.to(videoContainerRef.current, {
      clipPath: "circle(0% at 50% 0%)",
      ease: "power3.inOut",
      scrollTrigger: {
        trigger: heroSectionRef.current,
        start: "top center",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <section
      ref={heroSectionRef}
      className="relative h-screen w-screen overflow-hidden bg-black text-white"
    >
      {/* Loader */}
      {loading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
          loadinggg...
        </div>
      )}

      {/* Background Video */}
      <div
        ref={videoContainerRef}
        className="absolute left-0 top-0 h-full w-full overflow-hidden z-0"
      >
        <video
          ref={videoRef}
          src={getVideoSrc(videoIndex)}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 flex min-h-screen w-full flex-col items-center justify-center text-center px-6 py-12 sm:py-20">
        <h1 className="text-5xl uppercase sm:text-7xl font-bold font-pokemon-hollow mb-6 text-yellow-300 drop-shadow-lg leading-tight">
          Memory Match
        </h1>
        <p className="text-lg sm:text-2xl font-pokemon text-blue-100 max-w-2xl mb-8 sm:mb-10">
          Flip the cards. Train your brain. Beat your high score.
        </p>
        <Link to="/play">
          <Button
            title="Start Playing"
            leftIcon={<TiLocationArrow />}
            containerClass="inline-flex items-center gap-2 bg-yellow-300 text-black text-lg font-semibold px-8 py-3 rounded-full shadow-md hover:bg-yellow-400 transition-all duration-200"
          />
        </Link>
      </div>
    </section>
  );
};

export default Hero;
