"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Compass,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  Award,
  Building,
  Heart,
  Zap
} from "lucide-react";

type TimelineStep = {
  year: string;
  title: string;
  desc: string;
};

const TIMELINE_STEPS: TimelineStep[] = [
  {
    year: "2022",
    title: "Master Planning & Conception",
    desc: "Architectural commission awarded to Kohinoor Landmarks. Initial wind-tunnel testing and structural seismic models finalized.",
  },
  {
    year: "2023",
    title: "Seismic Foundation Groundbreak",
    desc: "Commencement of excavation and setting of double-tower sub-foundations with heavy load-bearing structural piles.",
  },
  {
    year: "2024",
    title: "Tower Core Vertical Erection",
    desc: "Rapid vertical development of concrete elevator cores. Reaching Level 24 and setting the structural skybridge framework.",
  },
  {
    year: "2025",
    title: "Double-Glazed Thermal Cladding",
    desc: "Setting of modular glass frames and integrated smart-atrium HVAC systems. Launching interior biophilic landscape designs.",
  },
  {
    year: "2026",
    title: "Grand Inauguration & Operations",
    desc: "Kohinoor Complex opens operational capacity to global headquarters. Activating active green grids and biometric layers.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full pb-20 overflow-hidden">
      
      {/* 1. HERO PAGE BANNER */}
      <section className="relative pt-20 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full">
        {/* Decorative ambient neon circle */}
        <div className="absolute top-0 right-10 w-96 h-96 rounded-full bg-sky-200/10 blur-[80px] pointer-events-none" />

        <div className="max-w-3xl flex flex-col gap-5 text-left relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-400/20 bg-sky-500/5 text-sky-700 text-[10px] font-bold w-max uppercase tracking-wider"
          >
            <Compass className="w-3.5 h-3.5 text-sky-400 animate-spin-slow" />
            <span>Landmark Blueprint</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black font-display text-gradient-sky tracking-tight leading-[1.1]"
          >
            Engineering the Future of Corporate Landmarks
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-sm md:text-base leading-relaxed"
          >
            Kohinoor Complex is more than an office address; it is a monumental structural statement. Engineered to serve global financial, technology, and commercial organizations with zero-latency operational infrastructure.
          </motion.p>
        </div>
      </section>

      {/* 2. VISION & MISSION CARDS */}
      <section className="py-12 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="p-8 rounded-3xl border border-slate-200/50 bg-white shadow-md flex flex-col gap-4 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-sky-200/5 blur-[40px] pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-sky-500/5 border border-sky-400/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-sky-500" />
          </div>
          <h3 className="text-lg font-bold text-navy-900 mt-2">Our Vision</h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            To construct commercial landmarks that seamlessly fuse structural aesthetics with sustainable responsibility, establishing a blueprint for futuristic urban corporate operations.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="p-8 rounded-3xl border border-slate-200/50 bg-white shadow-md flex flex-col gap-4 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-sky-200/5 blur-[40px] pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-sky-500/5 border border-sky-400/20 flex items-center justify-center">
            <Heart className="w-5 h-5 text-sky-500" />
          </div>
          <h3 className="text-lg font-bold text-navy-900 mt-2">Our Mission</h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            To empower international corporate enterprises with highly robust, energy-efficient workspace environments equipped with biometric layers, redundant connectivity grids, and VVIP hospitality.
          </p>
        </motion.div>
      </section>

      {/* 3. TIMELINE DEVELOPMENT */}
      <section className="py-24 border-y border-slate-200/50 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-16">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Chronological Milestones</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 font-display">
              Development History
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Tracking the journey of Kohinoor Complex from initial geological soil audits to the activation of our smart twin towers.
            </p>
          </div>

          {/* Interactive Timeline Layout */}
          <div className="relative border-l border-slate-200 max-w-3xl mx-auto pl-8 md:pl-12 flex flex-col gap-12">
            {TIMELINE_STEPS.map((step, idx) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                key={step.year}
                className="relative flex flex-col md:flex-row md:items-start gap-4 md:gap-10 group"
              >
                {/* Timeline Circle Bullet */}
                <div className="absolute -left-[41px] md:-left-[57px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center group-hover:border-sky-500 group-hover:scale-110 transition-all duration-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200 group-hover:bg-sky-500 transition-colors" />
                </div>

                {/* Timeline Year Frame */}
                <span className="text-sm font-black text-sky-600 shrink-0 select-none md:pt-1">
                  {step.year}
                </span>

                {/* Content Box */}
                <div className="flex flex-col gap-1 bg-white hover:border-sky-300 p-6 rounded-2xl border border-slate-200/50 shadow-sm transition-colors">
                  <h4 className="text-sm font-bold text-navy-900">{step.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed mt-1">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ARCHITECTURAL HIGHLIGHTS */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center w-full">
        {/* Left Side: Illustration / Summary Panel (5 Columns) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[300px] aspect-square rounded-3xl border border-white/60 glass-card p-6 shadow-xl flex flex-col justify-center items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-400/20 text-sky-600 flex items-center justify-center">
              <Building className="w-8 h-8" />
            </div>
            <div className="text-center flex flex-col gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-600">Certifications</span>
              <h4 className="text-md font-bold text-navy-900">LEED Platinum Certified</h4>
              <p className="text-slate-500 text-xs leading-relaxed max-w-[200px] mt-1">
                Engineered with high solar-reflective glass cladding and solar power networks.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Structural Details (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Architectural Details</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 font-display">
            High-Performance Double-Towers Structure
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            The architecture of Kohinoor Complex optimizes aerodynamics, stability, and natural solar penetration. Features of our double towers comprise:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {[
              {
                title: "Tower Zenith (East Tower)",
                desc: "Standing 48 floors high. Features specialized VIP landing helipad networks, private executive balconies, and corporate bank hubs."
              },
              {
                title: "Tower Apex (West Tower)",
                desc: "Standing 38 floors high. Incorporates dynamic fintech incubation cowork zones, server infrastructures, and Michelin observatories."
              },
              {
                title: "Inter-Tower Skybridge",
                desc: "Set on Level 24. Acts as a double-suspension structural link and features biophilic green walks, cafeterias, and common zones."
              },
              {
                title: "Unified Atrium Lobby",
                desc: "A sprawling glass atrium linking the bases of both towers. Features biometric turnstiles, reception desk, and cafes."
              }
            ].map((detail, idx) => (
              <div key={idx} className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <h4 className="text-xs font-bold text-navy-900">{detail.title}</h4>
                  <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">{detail.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
