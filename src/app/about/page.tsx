"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Compass,
  CheckCircle2,
  TrendingUp,
  Building,
  Heart,
  MapPin,
  Users,
  Briefcase
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full pb-20 overflow-hidden">
      
      {/* 1. HERO PAGE BANNER */}
      <section className="relative pt-24 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.08),transparent_60%)]">
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
            KOHINOOR CITY OFFICE TOWERS INDUSTRIAL ESTATE & PREMISES CO-OP SOCIETY LTD. COMMERCIAL - II is more than an office address; it is a monumental structural statement. Engineered to serve global financial, technology, and commercial organizations with zero-latency operational infrastructure.
          </motion.p>
        </div>
      </section>

      {/* 2. VISION & MISSION CARDS */}
      <section className="py-12 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 25 }}
          className="p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-slate-200/50 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:border-sky-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-350 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-sky-500/5 blur-[40px] pointer-events-none group-hover:bg-sky-500/10 transition-colors" />
          <div className="w-12 h-12 rounded-xl bg-sky-500/5 border border-sky-400/20 flex items-center justify-center group-hover:scale-105 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 shrink-0 text-sky-500">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-navy-900 mt-4">Our Vision</h3>
          <p className="text-slate-600 text-sm leading-relaxed mt-2">
            To construct commercial landmarks that seamlessly fuse structural aesthetics with sustainable responsibility, establishing a blueprint for futuristic urban corporate operations.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 25 }}
          className="p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-slate-200/50 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:border-sky-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-350 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-sky-500/5 blur-[40px] pointer-events-none group-hover:bg-sky-500/10 transition-colors" />
          <div className="w-12 h-12 rounded-xl bg-sky-500/5 border border-sky-400/20 flex items-center justify-center group-hover:scale-105 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 shrink-0 text-sky-500">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-navy-900 mt-4">Our Mission</h3>
          <p className="text-slate-600 text-sm leading-relaxed mt-2">
            To empower international corporate enterprises with highly robust, energy-efficient workspace environments equipped with biometric layers, redundant connectivity grids, and VVIP hospitality.
          </p>
        </motion.div>
      </section>

      {/* 4. ARCHITECTURAL HIGHLIGHTS */}
      <section className="py-28 md:py-32 border-y border-slate-200/50 bg-[#F8FAFC] w-full">
        <div className="flex flex-col gap-12 max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Establishment & Location</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-navy-900 font-display">
              Kohinoor Business Park & Offices
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              KOHINOOR CITY OFFICE TOWERS INDUSTRIAL ESTATE & PREMISES CO-OP SOCIETY LTD. COMMERCIAL - II is situated within a prestigious and thriving commercial hub in Mumbai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            {/* Card 1: Location & Legacy */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-slate-200/40 bg-white hover:border-sky-300 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col gap-5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-sky-500/5 blur-[30px] pointer-events-none group-hover:bg-sky-500/10 transition-colors" />
              <div className="w-12 h-12 rounded-xl bg-sky-500/5 border border-sky-400/20 flex items-center justify-center text-sky-600 shrink-0 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="text-lg font-bold text-navy-900 group-hover:text-sky-500 transition-colors">Prime Location & Legacy</h4>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                  Kohinoor Business Park in Kurla West, Mumbai is known to satisfactorily cater to the demands of its customer base. It stands located at Kurla West, having earned 100+ positive reviews and establishing a highly loyal customer base. The business strives to make for a positive experience through its premium offerings.
                </p>
              </div>
            </motion.div>

            {/* Card 2: Customer Centricity */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-slate-200/40 bg-white hover:border-sky-300 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col gap-5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-sky-500/5 blur-[30px] pointer-events-none group-hover:bg-sky-500/10 transition-colors" />
              <div className="w-12 h-12 rounded-xl bg-sky-500/5 border border-sky-400/20 flex items-center justify-center text-sky-600 shrink-0 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="text-lg font-bold text-navy-900 group-hover:text-sky-500 transition-colors">Customer Centricity</h4>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                  Customer centricity is at the core of Kohinoor Business Park in Kurla West, Mumbai, and it is this belief that has led the business to build long-term relationships. Ensuring a positive customer experience and making available goods and/or services that are of top-notch quality is given prime importance.
                </p>
              </div>
            </motion.div>

            {/* Card 3: B2B Marketplace & Services */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-slate-200/40 bg-white hover:border-sky-300 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col gap-5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-sky-500/5 blur-[30px] pointer-events-none group-hover:bg-sky-500/10 transition-colors" />
              <div className="w-12 h-12 rounded-xl bg-sky-500/5 border border-sky-400/20 flex items-center justify-center text-sky-600 shrink-0 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                <Briefcase className="w-6 h-6" />
              </div>

            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
