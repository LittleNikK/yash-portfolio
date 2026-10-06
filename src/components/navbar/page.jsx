"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroThreshold = window.innerHeight * 0.35;

      // Always show when near the very top of the page (Hero section)
      if (currentScrollY <= 80) {
        setIsVisible(true);
      } else {
        // Hide when scrolling down into another section
        if (currentScrollY > lastScrollY && currentScrollY > heroThreshold) {
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY - 8) {
          // Re-appear smoothly when scrolling back up
          setIsVisible(true);
        }
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full border-b border-white/10 bg-[#0a0c10]/80 backdrop-blur-md transition-all duration-300 ease-in-out ${isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "-translate-y-full opacity-0 pointer-events-none"
        }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white transition hover:opacity-85"
        >

          <span>Jod<span className="text-indigo-400">.</span></span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-400 md:flex">
          <Link href="/" className="text-white transition hover:text-indigo-400">
            Home
          </Link>
          <Link href="#about" className="transition hover:text-white">
            About
          </Link>
          <Link href="#skills" className="transition hover:text-white">
            Skills
          </Link>
          <Link href="#projects" className="transition hover:text-white">
            Projects
          </Link>
          <Link href="#contact" className="transition hover:text-white">
            Contact
          </Link>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href="#contact"
            className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 transition hover:bg-indigo-500/20 hover:text-white"
          >
            <span>Let's Talk</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
