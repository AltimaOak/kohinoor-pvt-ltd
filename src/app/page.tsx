"use client";

import React from "react";
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
  MessageSquare,
  MapPin,
  Phone,
  Zap,
  Shield,
  Cpu,
  Video,
  ArrowUpDown,
  Lock,
  Car,
  BatteryCharging,
  Flame
} from "lucide-react";
import InteractiveGallery from "@/components/InteractiveGallery";

export default function LandingPage() {

  return (
    <div className="flex flex-col w-full pb-20 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center pt-24 pb-28 px-6 md:px-12 max-w-7xl mx-auto w-full bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.08),transparent_60%)]">
        {/* Glow overlay */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sky-200/5 blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center w-full relative z-10">
          {/* Hero Content (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-sky-400/20 bg-sky-500/5 text-sky-700 text-xs font-bold w-max uppercase tracking-wider shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
              <span>THE NEXT ERA OF COMMERCIAL REAL ESTATE</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight text-gradient-sky leading-[1.1]"
            >
              Where Business Meets <br className="hidden md:inline" />
              <span className="text-sky-500 relative inline-block mt-1">
                Modern Excellence
                {/* Underline decorative gradient */}
                <span className="absolute left-0 right-0 -bottom-2.5 h-1.5 bg-gradient-to-r from-sky-400 to-sky-600 rounded-full shadow-sm" />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-600 text-base md:text-lg leading-relaxed max-w-xl mt-2"
            >
              KOHINOOR CITY OFFICE TOWERS INDUSTRIAL ESTATE & PREMISES CO-OP SOCIETY LTD. COMMERCIAL - II is a premier commercial landmark offering state-of-the-art office spaces, elite infrastructure, and a highly secure operational environment for modern businesses.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 mt-4"
            >
              <Link
                href="#about"
                className="group flex items-center gap-2.5 px-8 py-4.5 rounded-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-sky-500/20 hover:shadow-xl hover:shadow-sky-500/30 hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>About Us</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Hero Visual Showcase: Real Tower 2 photo (5 Columns) */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="relative w-full max-w-[340px] aspect-[1/1.3] rounded-[32px] border border-slate-200 bg-white p-4 shadow-[0_20px_50px_rgba(15,23,42,0.06)] hover:border-sky-300 hover:shadow-[0_25px_60px_rgba(56,189,248,0.15)] transition-all duration-500 overflow-hidden flex flex-col justify-end group"
            >
              <div className="absolute inset-0 bg-gradient-radial-sky opacity-40 pointer-events-none z-10" />

              {/* The real photo of the tower entrance */}
              <div className="absolute inset-4 rounded-2xl overflow-hidden bg-slate-50 h-[80%] border border-slate-100">
                {/* Fallback stylized gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-sky-100/50 flex items-center justify-center p-4">
                  <Building2 className="w-12 h-12 text-sky-300 opacity-40 animate-pulse" />
                </div>
                
                <img
                  src="/images/tower_exterior.png"
                  alt="Kohinoor Tower 2 Real Exterior"
                  className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              {/* Float visual highlight overlay info */}
              <div className="relative z-20 p-4 rounded-2xl bg-white border border-slate-100 shadow-md flex items-center justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] uppercase tracking-widest font-bold text-sky-500">Landmark Site</span>
                  <h4 className="text-xs font-bold text-navy-900">Kohinoor City Office Towers</h4>
                </div>
                <Building2 className="w-5 h-5 text-sky-500 shrink-0" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>



      {/* 3. ABOUT PREVIEW SECTION */}
      <section id="about" className="py-28 md:py-32 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Side: Text Columns (7 Columns) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 flex flex-col gap-6"
        >
          <span className="text-xs font-bold text-sky-600 uppercase tracking-widest flex items-center gap-1.5">
            <Award className="w-4.5 h-4.5 text-sky-400" />
            Establishment & Location
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-navy-900 font-display leading-tight">
            Kohinoor Business Park & Offices
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Kohinoor Business Park in Kurla West, Mumbai is a premier commercial destination that satisfactorily caters to the demands of its customer base. Built on a core belief of customer centricity, the business park has established long-term relationships and built an outstanding reputation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="flex gap-4 group">
              <div className="w-10.5 h-10.5 rounded-xl bg-sky-500/5 border border-sky-400/20 flex items-center justify-center shrink-0 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-300">
                <Compass className="w-5 h-5 text-sky-500 group-hover:text-white transition-colors" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-bold text-navy-900">Kurla West Commercial Hub</h4>
                <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                  Ideally situated in Kurla West, Mumbai, providing prime business accessibility and connectivity.
                </p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="w-10.5 h-10.5 rounded-xl bg-sky-500/5 border border-sky-400/20 flex items-center justify-center shrink-0 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-300">
                <CheckCircle2 className="w-5 h-5 text-sky-500 group-hover:text-white transition-colors" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-bold text-navy-900">Customer Centricity</h4>
                <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                  Prioritizing a positive customer experience and top-notch quality for all business operations.
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
        </motion.div>

        {/* Right Side: Showcase Cards (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 rounded-[28px] border border-slate-200/50 bg-white/70 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-xl hover:border-sky-300/40 hover:-translate-y-0.5 transition-all duration-300 flex items-start gap-5 group"
          >
            <div className="p-3 bg-sky-500/10 border border-sky-400/20 rounded-2xl text-sky-600 font-bold text-xs uppercase tracking-wider shrink-0">
              B2B
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-navy-900 group-hover:text-sky-500 transition-colors">Seamless Jd Mart Portal</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Featured catalogue of Business Center Services, Commercial Hubs, and premium Business Centres.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 rounded-[28px] border border-slate-200/50 bg-white/70 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-xl hover:border-sky-300/40 hover:-translate-y-0.5 transition-all duration-300 flex items-start gap-5 group"
          >
            <div className="p-3 bg-sky-500/10 border border-sky-400/20 rounded-2xl text-sky-600 font-bold text-xs uppercase tracking-wider shrink-0">
              TRUST
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-navy-900 group-hover:text-sky-500 transition-colors">100+ Reviews</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Strong reputation built on trust, quality offerings, and long-term customer relationships.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. CORE AMENITIES GRID */}
      <section className="py-28 md:py-32 border-y border-slate-200/50 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-16 w-full">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Utility & Security Grids</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-navy-900 font-display">
              Core Building Amenities
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Equipped with modern safety control checkpoints, automated energy feeds, and state-of-the-art building management networks.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[
              { label: "24x7 Security", icon: Shield, desc: "Continuous perimeter patrol and biometric checks" },
              { label: "BMS", icon: Cpu, desc: "Building Management System smart telemetry" },
              { label: "CCTV", icon: Video, desc: "High-definition security surveillance networks" },
              { label: "Lift", icon: ArrowUpDown, desc: "High-speed corporate passenger elevators" },
              { label: "Boom Barriers", icon: Lock, desc: "Automated RFID vehicular gate control systems" },
              { label: "Visitors Parking", icon: Car, desc: "Dedicated subterranean guest parking decks" },
              { label: "Power", icon: Zap, desc: "Dual grid feeds for consistent electricity" },
              { label: "Power Backup", icon: BatteryCharging, desc: "Heavy generator backup activation in 0.4s" },
              { label: "Fire Fighting Equipment", icon: Flame, desc: "Advanced localized sprinkler & detector grids" },
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="p-6 rounded-[28px] border border-slate-200/40 bg-white hover:border-sky-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/5 border border-sky-400/10 text-sky-500 flex items-center justify-center group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all duration-350 shrink-0">
                    <IconComp className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-sm font-bold text-navy-900 group-hover:text-sky-500 transition-colors">{item.label}</h4>
                    <p className="text-[10px] text-slate-500 leading-normal">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE GALLERY SECTION */}
      <section className="py-28 md:py-32 max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-16">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">COMPLEX SHOWCASE</span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-navy-900 font-display leading-tight">
            Visual Landmark Quality
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            View real-world photographs of our office towers, entry plazas, and central walkways.
          </p>
        </div>

        <InteractiveGallery />
      </section>

      {/* 7. LEASING ENQUIRY & CONTACT SECTION */}
      <section id="contact" className="py-28 md:py-32 max-w-5xl mx-auto px-6 md:px-12 w-full">
        <div className="flex flex-col gap-12 text-center items-center">
          <div className="flex flex-col gap-3 items-center">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest flex items-center gap-1.5">
              <Mail className="w-4.5 h-4.5 text-sky-400" />
              Corporate Relations
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-navy-900 font-display leading-tight">
              Contact & Address
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mt-2 max-w-lg">
              Interested in establishing your headquarters or acquiring commercial space? Reach out directly to our team.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full mt-4 text-left">
            {/* Column 1: Site Address */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-[32px] border border-slate-200/50 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between gap-6 hover:shadow-xl hover:border-sky-300 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-sky-500/5 blur-[30px] pointer-events-none group-hover:bg-sky-500/10 transition-colors" />
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-500/5 border border-sky-400/20 flex items-center justify-center text-sky-600 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">Physical Site Address</span>
                  <h4 className="text-lg font-black text-navy-900 mt-2">Kohinoor Office Towers</h4>
                  <a
                    href="https://maps.app.goo.gl/9LrPP3YqcKRDdi2t5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-600 mt-2 hover:text-sky-500 transition-colors block leading-relaxed"
                  >
                    KOHINOOR CITY OFFICE TOWERS, Landmark Ave,<br />
                    Business District, Tower B, Level 18
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Column 2: Devendra Sali */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 rounded-[32px] border border-slate-200/50 bg-gradient-to-br from-white to-slate-50/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col gap-6 hover:-translate-y-1.5 hover:shadow-xl hover:border-sky-400/30 transition-all duration-300 relative group"
            >
              <div>
                <span className="text-[9px] font-black uppercase text-sky-500 tracking-widest px-2.5 py-1 rounded-md bg-sky-500/5 border border-sky-400/10">Property & Facility</span>
                <h4 className="text-xl font-black text-navy-900 mt-4 leading-none">Devendra Sali</h4>
                <p className="text-xs text-slate-500 font-semibold mt-1.5">Property Manager</p>
              </div>
              <div className="flex flex-col gap-3.5 pt-4 border-t border-slate-200/50">
                <a
                  href="tel:8657902806"
                  className="group/btn flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-200/50 bg-white hover:border-sky-300 hover:bg-sky-500/5 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-500/5 border border-sky-400/10 text-sky-600 flex items-center justify-center shrink-0 group-hover/btn:scale-110 transition-transform">
                    <Phone className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-sm font-bold text-navy-800 group-hover/btn:text-sky-600 transition-colors">8657902806</span>
                </a>
                <a
                  href="mailto:devendra.sali@kohinoorcommercial2.in"
                  className="group/btn flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-200/50 bg-white hover:border-sky-300 hover:bg-sky-500/5 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-500/5 border border-sky-400/10 text-sky-600 flex items-center justify-center shrink-0 group-hover/btn:scale-110 transition-transform">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-sm font-bold text-navy-800 group-hover/btn:text-sky-600 transition-colors break-all">
                    devendra.sali@kohinoorcommercial2.in
                  </span>
                </a>
              </div>
            </motion.div>

            {/* Column 3: Roshan Patil */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-8 rounded-[32px] border border-slate-200/50 bg-gradient-to-br from-white to-slate-50/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col gap-6 hover:-translate-y-1.5 hover:shadow-xl hover:border-emerald-400/30 transition-all duration-300 relative group"
            >
              <div>
                <span className="text-[9px] font-black uppercase text-emerald-600 tracking-widest px-2.5 py-1 rounded-md bg-emerald-500/5 border border-emerald-400/10">Security & Safety</span>
                <h4 className="text-xl font-black text-navy-900 mt-4 leading-none">Roshan Patil</h4>
                <p className="text-xs text-slate-500 font-semibold mt-1.5">Security Manager</p>
              </div>
              <div className="flex flex-col gap-3.5 pt-4 border-t border-slate-200/50">
                <a
                  href="tel:8657902808"
                  className="group/btn flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-200/50 bg-white hover:border-sky-300 hover:bg-sky-500/5 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-500/5 border border-sky-400/10 text-sky-600 flex items-center justify-center shrink-0 group-hover/btn:scale-110 transition-transform">
                    <Phone className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-sm font-bold text-navy-800 group-hover/btn:text-sky-600 transition-colors">8657902808</span>
                </a>
                <a
                  href="mailto:roshan.patil@kohinoorcommercial2.in"
                  className="group/btn flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-200/50 bg-white hover:border-sky-300 hover:bg-sky-500/5 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-500/5 border border-sky-400/10 text-sky-600 flex items-center justify-center shrink-0 group-hover/btn:scale-110 transition-transform">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-sm font-bold text-navy-800 group-hover/btn:text-sky-600 transition-colors break-all">
                    roshan.patil@kohinoorcommercial2.in
                  </span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
