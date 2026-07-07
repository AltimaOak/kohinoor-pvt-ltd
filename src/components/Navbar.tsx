"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Events", href: "/events" },
  { name: "Contacts", href: "/contact" },
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
  const lastPathname = React.useRef(pathname);
  useEffect(() => {
    if (pathname !== lastPathname.current) {
      setMobileMenuOpen(false);
      lastPathname.current = pathname;
    }
  }, [pathname]);

  const isNavbarLightText = true;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500 bg-[#0F172A] border-b border-slate-800 px-6 md:px-12",
          scrolled ? "py-3.5 shadow-md" : "py-5"
        )}
      >
        <div className="max-w-[85rem] mx-auto flex items-center justify-between">
          {/* Logo with double-tower SVG */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="relative h-11 w-11 overflow-hidden rounded-lg border border-slate-200/80 bg-white flex items-center justify-center transition-colors duration-300 group-hover:border-sky-500">
              <Image
                src="/images/logo.png"
                alt="Kohinoor City Logo"
                width={44}
                height={44}
                className="h-full w-full object-contain p-1"
              />
            </div>
            <div className="flex flex-col max-w-[280px]">
              <span className={cn(
                "text-xs font-extrabold tracking-tight transition-colors duration-300 leading-tight",
                isNavbarLightText ? "text-white" : "text-navy-900"
              )}>
                KOHINOOR CITY OFFICE TOWERS
              </span>
              <span className="text-[7px] uppercase tracking-[0.08em] font-bold text-sky-500 leading-none mt-0.5">
                INDUSTRIAL ESTATE & PREMISES CO-OP SOCIETY LTD
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-3 lg:gap-5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-[13px] font-semibold tracking-wide transition-all duration-300 focus:outline-none group",
                    isNavbarLightText
                      ? isActive
                        ? "text-sky-400"
                        : "text-slate-300 hover:text-white"
                      : isActive
                        ? "text-sky-600"
                        : "text-slate-600 hover:text-sky-500"
                  )}
                >
                  <span className="relative z-10">{item.name}</span>
                  {/* Subtle underline for active item */}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-1 left-4 right-4 h-[2px] bg-sky-500 rounded-t-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {/* Subtle underline for non-active items */}
                  {!isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-sky-400/60 rounded-t-sm group-hover:w-[calc(100%-2rem)] transition-all duration-300" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg hover:bg-sky-500/5 transition-colors focus:outline-none",
              isNavbarLightText
                ? "text-slate-300 hover:text-white"
                : "text-navy-800 hover:text-sky-500"
            )}
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

            <div className="h-px bg-slate-200 mt-auto opacity-20" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
