"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const GraduationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const Header: React.FC = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/",       label: "Home",     icon: <HomeIcon /> },
    { href: "/config", label: "Settings", icon: <SettingsIcon /> },
  ];

  return (
    <header
      className={`sticky top-0 z-50 h-[60px] flex items-center px-6 md:px-10 transition-all duration-200 ${
        scrolled
          ? "bg-navy-mid/95 backdrop-blur-md border-b border-navy-border shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          : "bg-navy-mid border-b border-navy-border/60"
      }`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 mr-10 group select-none flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/25 flex items-center justify-center text-gold group-hover:bg-gold/18 group-hover:border-gold/40 transition-all duration-150">
          <GraduationIcon />
        </div>
        <span className="text-[0.9375rem] font-bold tracking-tight text-offwhite hidden sm:block">
          CBT <span className="text-gold">Prep Hub</span>
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex items-center gap-1 flex-1">
        {navLinks.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[0.8125rem] font-medium transition-all duration-150 ${
                isActive
                  ? "bg-gold/10 text-gold border border-gold/20"
                  : "text-muted-bright hover:text-offwhite hover:bg-white/5"
              }`}
            >
              <span className={isActive ? "text-gold" : ""}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Right slot — session indicator */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-success/8 border border-success/15">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[0.6875rem] font-semibold text-success tracking-wide hidden sm:block">STUDY MODE</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
