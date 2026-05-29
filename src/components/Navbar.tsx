"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "About Complex", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Events", href: "/events" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on navigate
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500 py-4 px-6 md:px-12",
          scrolled ? "glass-navbar-scrolled py-3" : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo with double-tower SVG */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="relative flex items-end h-9 w-9 bg-gradient-to-br from-sky-400 to-sky-600 rounded-lg p-1.5 shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300">
              {/* Dual towers visual representation in SVG */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-full h-full text-white"
              >
                {/* Left Tower Zenith */}
                <path d="M4 22V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v17" />
                {/* Right Tower Apex */}
                <path d="M12 22V9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v13" />
                {/* Connector Sky-Bridge */}
                <path d="M9 13h4" strokeWidth="2" strokeDasharray="1 1" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-navy-900 group-hover:text-sky-500 transition-colors duration-300">
                KOHINOOR
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-sky-500/90 -mt-1">
                COMPLEX
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-300 rounded-full hover:text-sky-500 focus:outline-none",
                    isActive ? "text-sky-600 font-semibold" : "text-navy-700"
                  )}
                >
                  {/* Active highlight container */}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-sky-500/5 rounded-full border border-sky-400/20"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Call to Action Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/contact"
              className="group relative flex items-center gap-2 overflow-hidden px-6 py-2.5 rounded-full bg-navy-900 hover:bg-sky-500 text-white text-xs font-semibold uppercase tracking-wider shadow-lg shadow-navy-900/10 hover:shadow-sky-500/20 transition-all duration-300"
            >
              <span className="relative z-10">Enquire Now</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-navy-800 hover:text-sky-500 rounded-lg hover:bg-sky-500/5 transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-[68px] z-30 md:hidden bg-slate-50/95 backdrop-blur-xl border-t border-slate-200/50 flex flex-col justify-between py-8 px-6"
          >
            <div className="flex flex-col gap-4">
              {NAV_ITEMS.map((item, idx) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between py-3 px-4 rounded-xl font-semibold transition-all duration-300",
                        isActive
                          ? "bg-sky-500/10 text-sky-600 border-l-4 border-sky-500 pl-3"
                          : "text-navy-900 hover:bg-slate-100"
                      )}
                    >
                      <span>{item.name}</span>
                      <ArrowRight className={cn("w-4 h-4", isActive ? "text-sky-500" : "text-slate-300")} />
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-4"
            >
              <div className="h-px bg-slate-200" />
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-bold text-center shadow-lg shadow-sky-500/20"
              >
                <span>Schedule a Visit</span>
                <Building2 className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
