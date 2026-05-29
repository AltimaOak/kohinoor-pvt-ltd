"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Award,
  Sparkles,
  ShieldAlert,
  Compass,
  ArrowUpRight,
  CheckCircle2,
  Mail,
  Send,
  MessageSquare
} from "lucide-react";
import TowerShowcase from "@/components/TowerShowcase";
import InteractiveGallery from "@/components/InteractiveGallery";
import EventCountdown from "@/components/EventCountdown";

export default function LandingPage() {
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    interest: "Leasing - Zenith",
    message: ""
  });

  const handleEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setEnquirySuccess(true);
      setTimeout(() => {
        setEnquirySuccess(false);
        setFormData({ name: "", email: "", company: "", interest: "Leasing - Zenith", message: "" });
      }, 5000);
    }
  };

  return (
    <div className="flex flex-col w-full pb-20 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-10 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
        {/* Glow overlay */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-sky-200/10 blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full relative z-10">
          {/* Hero Content (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sky-400/20 bg-sky-500/5 text-sky-700 text-xs font-bold w-max"
            >
              <Sparkles className="w-4.5 h-4.5 text-sky-400" />
              <span>THE NEXT ERA OF COMMERCIAL REAL ESTATE</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight text-gradient-sky leading-[1.1]"
            >
              Where Business Meets <br className="hidden md:inline" />
              <span className="text-sky-500 relative">
                Modern Excellence
                {/* Underline decorative gradient */}
                <span className="absolute left-0 right-0 -bottom-2 h-1 bg-gradient-to-r from-sky-400 to-sky-600 rounded-full" />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-600 text-base md:text-lg leading-relaxed max-w-xl"
            >
              Kohinoor Complex is a futuristic double-tower landmark redefining the corporate workspace. Uniting Tower Zenith and Tower Apex in a stunning glass-cladded masterclass, designed for world-class operational prestige.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 mt-4"
            >
              <Link
                href="#towers"
                className="group flex items-center gap-2 px-7 py-4 rounded-full bg-navy-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-sky-500 shadow-xl shadow-navy-900/10 hover:shadow-sky-500/20 transition-all duration-300"
              >
                <span>Explore Towers</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#contact"
                className="px-7 py-4 rounded-full bg-white border border-slate-200 text-navy-800 font-bold text-xs uppercase tracking-wider hover:border-sky-300 hover:text-sky-500 shadow-sm transition-colors"
              >
                Schedule Private Tour
              </Link>
            </motion.div>

            {/* Quick trust metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-200/60 max-w-lg mt-4"
            >
              {[
                { metric: "LEED Platinum", label: "Eco-Efficiency" },
                { metric: "86 Floors", label: "Across 2 Towers" },
                { metric: "40+ Amenities", label: "Premium Services" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="text-md md:text-lg font-black text-navy-900">{item.metric}</span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero Visual Showcase: High-Fidelity twin towers concept image (5 Columns) */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="relative w-full max-w-[320px] aspect-[1/1.3] rounded-3xl border border-white/60 glass-card p-3 shadow-2xl overflow-hidden flex flex-col justify-end group"
            >
              <div className="absolute inset-0 bg-gradient-radial-sky opacity-60 pointer-events-none z-10" />

              {/* The high-res concept art image */}
              <div className="absolute inset-2 rounded-2xl overflow-hidden bg-slate-100 relative h-[82%]">
                {/* Fallback stylized gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-sky-100 to-sky-200/40 flex items-center justify-center p-4">
                  <Building2 className="w-12 h-12 text-sky-300 opacity-40 animate-pulse" />
                </div>
                
                <img
                  src="/images/tower_exterior.png"
                  alt="Kohinoor Twin Towers Concept Art"
                  className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              {/* Float visual highlight overlay info */}
              <div className="relative z-20 p-4 mt-2 rounded-xl bg-white/80 backdrop-blur-md border border-white/80 shadow-md flex items-center justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase tracking-widest font-extrabold text-sky-600">Landmark Site</span>
                  <h4 className="text-xs font-bold text-navy-900">Kohinoor Twin Towers</h4>
                </div>
                <Building2 className="w-5 h-5 text-sky-500 shrink-0" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. DUAL TOWERS INTERACTIVE SHOWCASE */}
      <section id="towers" className="py-24 border-t border-slate-200/50 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-4xl">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-widest flex items-center gap-1">
                <Building2 className="w-4.5 h-4.5 text-sky-400" />
                Architectural Inception
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-navy-900 font-display leading-tight">
                Two Towers. Perfect Synergy.
              </h2>
            </div>
            <p className="text-slate-600 text-sm max-w-md leading-relaxed">
              Hover over the sections on the tower blueprints below to inspect the functional splits between corporate offices, retail spaces, helipads, and oxygen gardens.
            </p>
          </div>

          <TowerShowcase />
        </div>
      </section>

      {/* 3. ABOUT PREVIEW SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Side: Text Columns (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-widest flex items-center gap-1">
            <Award className="w-4.5 h-4.5 text-sky-400" />
            Commercial Leadership
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-navy-900 font-display leading-tight">
            Designed for Modern Operational Excellence
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Every square inch of the Kohinoor Complex has been engineered with architectural integrity and sustainable responsibility. From structural dampening networks to triple-redundant solar energy systems, we have constructed a landmark destination that empowers international commercial giants.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-sky-500/5 border border-sky-400/20 flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5 text-sky-500" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-bold text-navy-900">Prime Financial Zone</h4>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Located central to key transportation corridors, international airports, and five-star business hotels.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-sky-500/5 border border-sky-400/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-sky-500" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-bold text-navy-900">Eco-Friendly Cladding</h4>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Utilizing state-of-the-art double-glazed thermal paneling that reduces solar heating loads by 42%.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 uppercase tracking-widest hover:text-navy-900 transition-colors group"
            >
              <span>Learn About the Infrastructure</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Side: Showcase Cards (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-6 rounded-3xl border border-slate-200/50 bg-white shadow-md flex items-start gap-4">
            <div className="p-3 bg-sky-500/10 rounded-2xl text-sky-600 font-extrabold text-sm shrink-0">
              LEED
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-navy-900">LEED Platinum Standard</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Highest international rating for energy efficiency, ventilation, and sustainable materials.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200/50 bg-white shadow-md flex items-start gap-4 translate-x-0 md:translate-x-6 transition-transform">
            <div className="p-3 bg-sky-500/10 rounded-2xl text-sky-600 font-extrabold text-sm shrink-0">
              SMART
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-navy-900">AI Atrium Automation</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Integrated air purification, biometric checkpoints, and automatic building management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICES PREVIEW SECTION */}
      <section className="py-24 border-t border-slate-200/50 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-4xl">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">LANDMARK UTILITIES</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-navy-900 font-display leading-tight">
                Premium Building Amenities
              </h2>
            </div>
            <p className="text-slate-600 text-sm max-w-md leading-relaxed">
              Curated hospitality and technical infrastructures that fuel modern global businesses and ensure absolute security, redundancy, and elite comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "VVIP Aviation Hub",
                desc: "Equipped private landing pad at Tower Zenith peak with private lounges and dedicated flight scheduling agents.",
                tag: "Helipads"
              },
              {
                title: "Unified Automation",
                desc: "Integrated building networks allowing custom climate, biometric clearance, and automated lighting profiles per tenant.",
                tag: "Smart Tech"
              },
              {
                title: "Advanced Data Core",
                desc: "Triple-redundant underground fiber-optics, dedicated tenant servers, and advanced cooling structures.",
                tag: "Server Core"
              }
            ].map((service, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl border border-slate-200/40 bg-white hover:border-sky-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between gap-6 group"
              >
                <div className="flex flex-col gap-3">
                  <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200/40 text-[9px] font-extrabold uppercase tracking-widest text-slate-400 w-max group-hover:text-sky-500 group-hover:border-sky-300 transition-colors">
                    {service.tag}
                  </span>
                  <h4 className="text-md font-bold text-navy-900 mt-2">{service.title}</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">{service.desc}</p>
                </div>
                <Link
                  href="/services"
                  className="flex items-center gap-1 text-xs font-extrabold text-sky-600 uppercase tracking-widest hover:text-navy-900 transition-colors group-hover:translate-x-1"
                >
                  <span>Explore Service Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE GALLERY SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-16">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">COMPLEX SHOWCASE</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-navy-900 font-display leading-tight">
            Visual Landmark Quality
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Tour the architectural grandeur, executive spaces, lush vertical biophilia, and high-altitude sky terraces that compose our double towers.
          </p>
        </div>

        <InteractiveGallery />
      </section>

      {/* 6. EVENTS PREVIEW & COUNTDOWN SECTION */}
      <section className="py-24 border-t border-slate-200/50 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-12">
          <div className="flex flex-col gap-3 max-w-xl">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Business Community</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-navy-900 font-display leading-tight">
              Summit & Networking Mixers
            </h2>
          </div>

          <EventCountdown />
        </div>
      </section>

      {/* 7. LEASING ENQUIRY & CONTACT SECTION */}
      <section id="contact" className="py-24 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Contact Info Column (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest flex items-center gap-1">
              <Mail className="w-4.5 h-4.5 text-sky-400" />
              Corporate Relations
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-navy-900 font-display leading-tight">
              Leasing & Private Audits
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mt-2">
              Interested in establishing your headquarters or acquiring commercial space in Tower Zenith or Tower Apex? Reach out directly to our commercial relations team to arrange an exclusive private walk-through.
            </p>
          </div>

          <div className="flex flex-col gap-4 text-sm text-slate-600">
            <div className="p-4 border border-slate-200/40 bg-white/50 rounded-2xl flex flex-col shadow-sm">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Representative Office</span>
              <span className="text-xs font-bold text-navy-900 mt-1">Tower Zenith, Level 32, Suite 3201</span>
            </div>
            <div className="p-4 border border-slate-200/40 bg-white/50 rounded-2xl flex flex-col shadow-sm">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Leasing Hotline</span>
              <span className="text-xs font-bold text-sky-600 mt-1">+1 (555) 019-2831</span>
            </div>
          </div>
        </div>

        {/* Contact Form Column (7 Columns) */}
        <div className="lg:col-span-7">
          <div className="glass-card border border-white/60 p-8 md:p-10 rounded-3xl shadow-xl">
            {enquirySuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 flex flex-col items-center gap-5"
              >
                <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-bold text-navy-900">Enquiry Submitted</h3>
                  <p className="text-slate-600 text-xs max-w-sm">
                    Thank you. Your request has been logged. An executive relations partner will reach out via corporate email within 24 operational hours.
                  </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleEnquiry} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-navy-800">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Adrian Carter"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl focus:bg-white focus:outline-none transition-all text-slate-800"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-navy-800">
                      Corporate Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. adrian@corp.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl focus:bg-white focus:outline-none transition-all text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-navy-800">
                      Company Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Ventures"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl focus:bg-white focus:outline-none transition-all text-slate-800"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-navy-800">
                      I am interested in...
                    </label>
                    <select
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                      className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl focus:bg-white focus:outline-none transition-all text-slate-800"
                    >
                      <option>Leasing - Zenith Offices</option>
                      <option>Leasing - Apex Incubators</option>
                      <option>Acquisition - Penthouse Spaces</option>
                      <option>Partnership - Retail Arcade</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-navy-800">
                    Additional Requirements
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="List specific operational requirements, sizing details, or dates..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl focus:bg-white focus:outline-none transition-all text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  className="group relative flex items-center justify-center gap-2 overflow-hidden w-full py-4 mt-2 rounded-xl bg-navy-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-sky-500 transition-colors shadow-lg"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <span>Send Enquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
