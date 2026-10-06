'use client';

import React, { useState } from 'react';
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
});

export default function ContactSection() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ email: '', phone: '', message: '' });
    }, 4000);
  };

  return (
    <section
      id="contact"
      className="relative w-full py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-20 flex items-center justify-center overflow-hidden bg-[#07080b]"
    >
      {/* Ambient background glow & atmospheric depth */}
      <div
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] rounded-full blur-[140px] opacity-25 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(59, 130, 246, 0.2) 40%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at center, transparent 30%, rgba(7, 8, 11, 0.8) 75%, #07080b 100%)',
          }}
        />
      </div>

      {/* Main Floating Glassmorphic Card */}
      <div
        className="relative z-10 w-full max-w-[1140px] rounded-[24px] sm:rounded-[36px] overflow-hidden p-6 sm:p-10 md:p-14 lg:p-16 transition-all duration-300 border border-white/20 border-t-white/35 border-l-white/25"
        style={{
          boxShadow:
            '0 30px 90px -15px rgba(0, 0, 0, 0.85), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25), inset 0 -1px 2px 0 rgba(0, 0, 0, 0.6)',
        }}
      >
        {/* Card Background: contact-bg.jpg + Frosted Glass Layer */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/contact-bg.jpg"
            alt=""
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Frosted Glass Blur & Tint overlay */}
          <div
            className="absolute inset-0 backdrop-blur-md"
            style={{
              background:
                'linear-gradient(135deg, rgba(8, 10, 15, 0.74) 0%, rgba(14, 17, 24, 0.82) 50%, rgba(6, 8, 12, 0.88) 100%)',
            }}
          />
          {/* Specular sheen reflection */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 15% 10%, rgba(255, 255, 255, 0.16) 0%, transparent 55%)',
            }}
          />
        </div>

        {/* Content container sitting above glass background */}
        <div className="relative z-10">
          {/* Top Bar: [CONTACT] --- Logo --- [MENU] */}
          <div className="flex items-center justify-between pb-8 sm:pb-12 md:pb-16 border-b border-transparent">
            {/* Left indicator */}
            <div className="text-[11px] sm:text-xs font-mono font-medium tracking-[0.22em] text-white/80">
              [CONTACT]
            </div>

            {/* Center Logo */}
            <a
              href="#home"
              className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
              aria-label="Home"
            >
              {/* Double-helix / chromosome cross icon */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
              >
                <path
                  d="M7 4.5C7 7.5 17 9.5 17 12C17 14.5 7 16.5 7 19.5"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M17 4.5C17 7.5 7 9.5 7 12C7 14.5 17 16.5 17 19.5"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <circle cx="7" cy="4.5" r="1.6" fill="currentColor" />
                <circle cx="17" cy="4.5" r="1.6" fill="currentColor" />
                <circle cx="7" cy="19.5" r="1.6" fill="currentColor" />
                <circle cx="17" cy="19.5" r="1.6" fill="currentColor" />
              </svg>
            </a>

            {/* Right indicator */}
            <div className="text-[11px] sm:text-xs font-mono font-medium tracking-[0.22em] text-white/80">
              [MENU]
            </div>
          </div>

          {/* Content Body: Left Column + Right Column */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pt-8 sm:pt-12">
            {/* Left Column: Heading + Social Links */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <h2
                  className={`${playfair.className} text-4xl sm:text-5xl md:text-[56px] lg:text-[62px] leading-[1.08] tracking-[-0.025em] font-normal text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]`}
                >
                  Let’s Create Something
                  <br />
                  Extraordinary Together.
                </h2>
              </div>

              {/* Social Icons (Facebook, Instagram, YouTube) */}
              <div className="flex items-center gap-4.5 pt-12 sm:pt-20 lg:pt-28 text-white/80">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center hover:text-white hover:scale-105 transition-all"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center hover:text-white hover:scale-105 transition-all"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center hover:text-white hover:scale-105 transition-all"
                >
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Column: Contact info columns + Underlined Inputs + Submit button */}
            <div className="lg:col-span-6 flex flex-col justify-between pt-2 lg:pt-0">
              {/* Info Columns: Contact Info & Address */}
              <div className="grid grid-cols-2 gap-6 sm:gap-10 pb-8 sm:pb-12 text-white">
                {/* Contact Info */}
                <div className={`${inter.className}`}>
                  <h3 className="font-semibold text-xs sm:text-[13px] text-neutral-200 mb-2 tracking-wide uppercase">
                    Contact Info
                  </h3>
                  <div className="text-[11px] sm:text-xs text-neutral-300 space-y-0.5 leading-relaxed">
                    <p>+91 9325315810</p>
                    <p>ajaypawar5565@gmail.com</p>
                  </div>
                </div>

                {/* Address */}
                <div className={`${inter.className}`}>
                  <h3 className="font-semibold text-xs sm:text-[13px] text-neutral-200 mb-2 tracking-wide uppercase">
                    Address
                  </h3>
                  <div className="text-[11px] sm:text-xs text-neutral-300 space-y-0.5 leading-relaxed">
                    <p>Pune, Maharashtra, India</p>
                  </div>
                </div>
              </div>

              {/* Interactive Form with underlined inputs */}
              <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                {/* Email */}
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="name@yourname.com"
                    className={`${playfair.className} w-full bg-transparent border-b border-white/25 focus:border-white pb-2.5 pt-1 text-base sm:text-lg text-white placeholder:text-neutral-400 placeholder:italic focus:outline-none transition-colors`}
                  />
                </div>

                {/* Phone */}
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+91 1234567890"
                    className={`${playfair.className} w-full bg-transparent border-b border-white/25 focus:border-white pb-2.5 pt-1 text-base sm:text-lg text-white placeholder:text-neutral-400 placeholder:italic focus:outline-none transition-colors`}
                  />
                </div>

                {/* Message */}
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Enter your message here..."
                    className={`${playfair.className} w-full bg-transparent border-b border-white/25 focus:border-white pb-2.5 pt-1 text-base sm:text-lg text-white placeholder:text-neutral-400 placeholder:italic focus:outline-none transition-colors`}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-between pt-4">
                  {submitted ? (
                    <span
                      className={`${inter.className} text-xs font-medium text-emerald-400 animate-fadeIn`}
                    >
                      ✓ Message received. We’ll be in touch.
                    </span>
                  ) : (
                    <div />
                  )}

                  <button
                    type="submit"
                    className={`${inter.className} ml-auto bg-white hover:bg-neutral-100 text-[#0c0e12] px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-[0.98] shadow-[0_4px_25px_rgba(255,255,255,0.2)] hover:shadow-[0_6px_30px_rgba(255,255,255,0.35)] cursor-pointer`}
                  >
                    Submit Form
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
