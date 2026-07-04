"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Compass,
  Building,
  TrendingUp
} from "lucide-react";

const towersData = [
  {
    id: "tower-1",
    name: "Tower 1",
    sub: "Commercial - II",
    description: "Tower 1 is a premium financial gateway and corporate hub, hosting key departments of the National Stock Exchange of India and top financial training institutions.",
    offices: [
      "National Stock Exchange of India Limited",
      "The Clearing Corporation of India Ltd",
      "Indian Institute of Banking and Finance",
      "Indepesca Overseas Pvt. Ltd",
      "Rhythm House Pvt. Ltd"
    ]
  },
  {
    id: "tower-2",
    name: "Tower 2",
    sub: "Commercial - II",
    description: "Tower 2 stands as a major administrative, logistics, and engineering centerpiece, hosting key consultancy partners and commercial service entities.",
    offices: [
      "Sterling Engineering Consultancy Services Private Limited",
      "M. Pallonji Logistics Pvt Ltd",
      "Ashoka Sthapathya Private Ltd",
      "Nahar Retail Trading Services Ltd",
      "Vishyam Estate Pvt. Ltd"
    ]
  },
  {
    id: "tower-3",
    name: "Tower 3",
    sub: "Commercial - II",
    description: "Tower 3 features ultra-modern executive workspace facilities, catering to leading technological enterprises and financial consultants. Built with advanced high-speed digital architecture and premium conference spaces."
  },
  {
    id: "tower-4",
    name: "Tower 4",
    sub: "Commercial - II",
    description: "Tower 4 serves as a state-of-the-art business landmark, housing multinational headquarters, corporate consulting boards, and upscale retail storefronts designed to meet world-class industry standards."
  }
];

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full pb-12 overflow-hidden">

      {/* 1. HERO PAGE BANNER */}
      <section className="relative pt-16 pb-6 px-6 md:px-12 max-w-7xl mx-auto w-full bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.08),transparent_60%)]">
        {/* Decorative ambient neon circle */}
        <div className="absolute top-0 right-10 w-96 h-96 rounded-full bg-sky-200/10 blur-[80px] pointer-events-none" />

        <div className="max-w-3xl flex flex-col gap-3 text-left relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-sky-50 border border-sky-100 text-sky-700 text-[10px] font-bold w-max uppercase tracking-wider"
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
            KOHINOOR CITY OFFICE TOWERS INDUSTRIAL ESTATE & PREMISES CO-OP SOCIETY LTD. Is more than an office address; it is a monumental structural statement. Engineered to serve global financial, technology, and commercial organizations with zero-latency operational infrastructure.
          </motion.p>
        </div>
      </section>

      {/* 2. VISION & MISSION CARDS */}
      <section className="py-8 max-w-2xl mx-auto px-6 md:px-12 flex justify-center w-full">
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", damping: 25 }}
          className="p-5 border border-slate-100 bg-white shadow-xs hover:border-slate-200 hover:shadow-sm transition-all duration-200 rounded-xl w-full"
        >
          <div className="w-10 h-10 rounded-lg bg-sky-500/5 border border-sky-400/20 flex items-center justify-center text-sky-500 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-navy-900 mt-4">Our Vision</h3>
          <p className="text-slate-600 text-sm leading-relaxed mt-2">
            To create premium commercial environments that combine modern design, functionality, and sustainability, establishing a benchmark for corporate workspaces.
          </p>
        </motion.div>
      </section>

      {/* 4. ARCHITECTURAL HIGHLIGHTS */}
      <section className="py-10 md:py-16 border-y border-slate-200/50 bg-[#F8FAFC] w-full">
        <div className="flex flex-col gap-8 max-w-[90rem] mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Establishment & Location</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-navy-900 font-display">
              Kohinoor Commercial-II
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              KOHINOOR CITY OFFICE TOWERS INDUSTRIAL ESTATE & PREMISES CO-OP SOCIETY LTD.
              <br />Is situated within a prestigious and thriving commercial hub in Mumbai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-4">
            {towersData.map((tower, idx) => (
              <motion.div
                key={tower.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative overflow-hidden p-6 rounded-xl border border-slate-200/60 bg-gradient-to-b from-white to-slate-50/50 hover:shadow-sm hover:-translate-y-1 hover:border-sky-500/30 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Large watermark number on top right */}
                <div className="absolute -top-1 -right-2 text-6xl font-black text-slate-200/50 select-none pointer-events-none font-display tracking-tighter">
                  0{idx + 1}
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                  {tower.offices && tower.offices.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      <div>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500/10 to-blue-500/5 border border-sky-500/10 flex items-center justify-center text-sky-600 shrink-0 shadow-xs">
                            <Building className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-navy-900 leading-none">{tower.name}</h4>
                            <p className="text-[10px] text-sky-600 font-bold tracking-widest uppercase mt-1">{tower.sub}</p>
                          </div>
                        </div>

                        {tower.description && (
                          <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-1 font-medium font-sans">
                            {tower.description}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1 border-t border-slate-200 pt-3">
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 text-center">
                          Associated Offices
                        </div>
                        <div className="flex flex-col gap-0.5">
                          {tower.offices.map((office, oIdx) => (
                            <div
                              key={oIdx}
                              className="text-center text-slate-700 font-semibold text-xs tracking-wide leading-relaxed py-0.5"
                            >
                              {office}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full justify-between gap-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500/10 to-blue-500/5 border border-sky-500/10 flex items-center justify-center text-sky-600 shrink-0 shadow-xs">
                            <Building className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-navy-900 leading-none">{tower.name}</h4>
                            <p className="text-[10px] text-sky-600 font-bold tracking-widest uppercase mt-1">{tower.sub}</p>
                          </div>
                        </div>

                        {tower.description && (
                          <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-medium font-sans">
                            {tower.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
