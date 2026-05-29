"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowRight } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="relative border-t border-slate-200/60 bg-slate-50 pt-20 pb-10 overflow-hidden">
      {/* Decorative Blur Dot */}
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-sky-200/10 blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-slate-200">
          
          {/* Logo & Intro Column (4 Columns) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative flex items-end h-8 w-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-lg p-1.5 shadow-md shadow-sky-500/10">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-full h-full text-white"
                >
                  <path d="M4 22V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v17" />
                  <path d="M12 22V9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v13" />
                  <path d="M9 13h4" strokeWidth="2" strokeDasharray="1 1" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-md font-bold tracking-tight text-navy-900">
                  KOHINOOR
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] font-semibold text-sky-500/90 -mt-1">
                  COMPLEX
                </span>
              </div>
            </Link>
            
            <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
              A premium, futuristic commercial destination redefining workspaces. Centrally located with double architectural towers designed for landmark excellence and ultimate productivity.
            </p>

            {/* Newsletter Container */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-navy-800 uppercase tracking-wider">
                Subscribe to Highlights
              </span>
              <form onSubmit={handleSubscribe} className="relative max-w-sm">
                <input
                  type="email"
                  required
                  placeholder="Enter corporate email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 text-xs bg-white border border-slate-200 hover:border-slate-300 focus:border-sky-500 rounded-full focus:outline-none transition-colors shadow-sm text-slate-800"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 bg-navy-900 hover:bg-sky-500 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  {subscribed ? <CheckCircle2 className="w-3.5 h-3.5 text-sky-300" /> : <Send className="w-3.5 h-3.5" />}
                </button>
              </form>
              {subscribed && (
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-sky-600 font-medium flex items-center gap-1.5"
                >
                  Subscription registered successfully. Thank you!
                </motion.span>
              )}
            </div>
          </div>

          {/* Links Directory Columns (5 Columns total) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            {/* Sitemap Navigation */}
            <div className="flex flex-col gap-5">
              <h4 className="text-xs font-bold text-navy-900 uppercase tracking-widest">
                Navigation
              </h4>
              <ul className="flex flex-col gap-3">
                {[
                  { name: "Home Landmark", href: "/" },
                  { name: "About Towers", href: "/about" },
                  { name: "Premium Services", href: "/services" },
                  { name: "Business Events", href: "/events" },
                  { name: "Relations Contact", href: "/contact" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 hover:text-sky-500 hover:translate-x-1 transition-all inline-flex items-center gap-1"
                    >
                      <ArrowRight className="w-3 h-3 text-sky-400 opacity-0 -ml-4 hover:opacity-100 hover:ml-0 transition-all" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Towers Specifications */}
            <div className="flex flex-col gap-5">
              <h4 className="text-xs font-bold text-navy-900 uppercase tracking-widest">
                Specifications
              </h4>
              <ul className="flex flex-col gap-3">
                {[
                  { name: "Tower A (Zenith)", href: "/about#zenith" },
                  { name: "Tower B (Apex)", href: "/about#apex" },
                  { name: "Eco Infrastructure", href: "/about#infrastructure" },
                  { name: "Smart Automation", href: "/services#automation" },
                ].map((spec) => (
                  <li key={spec.name}>
                    <Link
                      href={spec.href}
                      className="text-sm text-slate-600 hover:text-sky-500 hover:translate-x-1 transition-all inline-flex items-center gap-1"
                    >
                      <span>{spec.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Details Column (3 Columns) */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            <h4 className="text-xs font-bold text-navy-900 uppercase tracking-widest">
              Commercial Office
            </h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <MapPin className="w-4.5 h-4.5 text-sky-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Kohinoor Complex, Landmark Ave,<br />
                  Business District, Tower B, Level 18
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4.5 h-4.5 text-sky-500 shrink-0" />
                <span className="hover:text-sky-500 transition-colors">+1 (555) 019-2831</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4.5 h-4.5 text-sky-500 shrink-0" />
                <span className="hover:text-sky-500 transition-colors">partner@kohinoorcomplex.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Lower Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-10 text-xs text-slate-500">
          <span>
            © {new Date().getFullYear()} Kohinoor Complex. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <span className="hover:text-sky-500 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-sky-500 cursor-pointer transition-colors">Terms of Lease</span>
            <span className="hover:text-sky-500 cursor-pointer transition-colors">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
