"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Compass,
  Building,
  Eye,
  Maximize2,
  Users,
  ShieldCheck
} from "lucide-react";

const towersData = [
  {
    id: "tower-1",
    name: "Tower 1",
    sub: "Commercial - II",
    description: "Tower 1 is a premium financial gateway and corporate hub, hosting key departments of the National Stock Exchange of India and top financial training institutions.",
    offices: [
      " 1. National Stock Exchange of India Limited",
      " 2. The Clearing Corporation of India Ltd",
      " 3. Indian Institute of Banking and Finance",
      " 4. Indepesca Overseas Pvt. Ltd",
      " 5. Rhythm House Pvt. Ltd"
    ]
  },
  {
    id: "tower-2",
    name: "Tower 2",
    sub: "Commercial - II",
    description: "Tower 2 stands as a major administrative, logistics, and engineering centerpiece, hosting key consultancy partners and commercial service entities.",
    offices: [
      "1. Sterling Engineering Consultancy Services Pvt.Ltd",
      "2. M. Pallonji Logistics Pvt.Ltd",
      "3. Ashoka Sthapathya Pvt.Ltd",
      "4. Nahar Retail Trading Services Ltd",
      "5. Vishyam Estate Pvt.Ltd"
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
    <div className="flex flex-col w-full pb-12 overflow-hidden bg-white">

      {/* 1. HERO PAGE BANNER & VISION SPLIT */}
      <section className="relative pt-16 pb-12 px-6 md:px-12 max-w-7xl mx-auto w-full bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.08),transparent_60%)] z-10">
        {/* Decorative ambient neon circle */}
        <div className="absolute top-0 right-10 w-96 h-96 rounded-full bg-sky-200/10 blur-[80px] pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Column: Text & Header */}
          <div className="md:col-span-7 flex flex-col gap-4 text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 text-[#0055d4] text-[10px] font-bold uppercase tracking-wider select-none"
            >
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span>ABOUT US</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]"
            >
              Engineering the Future of <br className="hidden sm:inline" />
              <span className="text-[#0055d4]">Corporate Landmarks</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 text-sm md:text-base leading-relaxed max-w-2xl"
            >
               KOHINOOR CITY OFFICE TOWERS INDUSTRIAL ESTATE & PREMISES CO-OP SOCIETY LTD. We empower businesses with innovative spaces, world-class infrastructure, and unmatched Services.
            </motion.p>
          </div>

          {/* Right Column: Vision Card */}
          <div className="md:col-span-5 w-full">
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="p-6 sm:p-8 border border-slate-100 bg-white shadow-md rounded-[20px] w-full flex flex-col gap-4 text-left"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-xs">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Our Vision</h3>
                <p className="text-slate-500 text-sm leading-relaxed mt-2">
                  To redefine premium commercial environments that combine design, functionality, and sustainability, establishing new benchmarks for corporate spaces.
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 2. OUR LANDMARK IN KURLA & STATS */}
      <section className="py-12 border-t border-slate-100 bg-[#FAFBFC] w-full">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col gap-8 text-center items-center">
          
          <div className="flex flex-col items-center gap-2 max-w-xl mx-auto select-none">
            <span className="text-[10px] font-bold text-[#0055d4] uppercase tracking-widest">Our Landmark in Kurla</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Kohinoor Commercial-II
            </h2>
            <div className="w-12 h-[2px] bg-[#0055d4] rounded-full mt-1.5" />
            <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
              KOHINOOR CITY OFFICE TOWERS INDUSTRIAL ESTATE & PREMISES CO-OP SOCIETY LTD <br className="hidden sm:inline" />
              is dedicated to creating spaces that inspire growth and lasting relationships.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100/85 bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-xs max-w-4xl w-full select-none items-center mt-2">
            
            {/* Stat 1 */}
            <div className="flex items-center gap-3.5 justify-center py-3 md:py-1">
              <div className="w-10 h-10 rounded-full bg-blue-50/50 border border-blue-100/40 flex items-center justify-center text-blue-600 shrink-0">
                <Building className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-black text-slate-900 leading-none">4</span>
                <span className="text-[8px] font-bold text-slate-450 uppercase tracking-wider mt-1">Towers</span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-3.5 justify-center py-3 md:py-1 px-2">
              <div className="w-10 h-10 rounded-full bg-blue-50/50 border border-blue-100/40 flex items-center justify-center text-blue-600 shrink-0">
                <Maximize2 className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-black text-slate-900 leading-none">4.5M+</span>
                <span className="text-[8px] font-bold text-slate-450 uppercase tracking-wider mt-1">Sq. Ft. Built-up Area</span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-3.5 justify-center py-3 md:py-1 px-2">
              <div className="w-10 h-10 rounded-full bg-blue-50/50 border border-blue-100/40 flex items-center justify-center text-blue-600 shrink-0">
                <Users className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-black text-slate-900 leading-none">10+</span>
                <span className="text-[8px] font-bold text-slate-450 uppercase tracking-wider mt-1">Businesses</span>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-3.5 justify-center py-3 md:py-1">
              <div className="w-10 h-10 rounded-full bg-blue-50/50 border border-blue-100/40 flex items-center justify-center text-blue-600 shrink-0">
                <ShieldCheck className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-black text-slate-900 leading-none">1</span>
                <span className="text-[8px] font-bold text-slate-450 uppercase tracking-wider mt-1">Vision</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. OUR ENGAGED CLIENTS / TOWERS GRID */}
      <section className="py-12 bg-white w-full border-t border-slate-100">
        <div className="max-w-[90rem] mx-auto px-6 md:px-12 flex flex-col gap-10">
          
          {/* Header */}
          <div className="flex flex-col items-center gap-2 max-w-xl mx-auto select-none">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Our Engaged Clients
            </h2>
            <div className="w-12 h-[2px] bg-[#0055d4] rounded-full mt-1" />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {towersData.map((tower, idx) => (
              <motion.div
                key={tower.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative overflow-hidden p-6 rounded-2xl border border-slate-100 bg-white hover:border-sky-200 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex flex-col gap-4 h-full justify-between">
                  <div>
                    {/* Tower Badge & Name */}
                    <div className="flex items-center gap-3 mb-4 select-none">
                      <div className="w-6 h-6 rounded bg-[#0055d4] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        0{idx + 1}
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 leading-none">{tower.name}</h4>
                    </div>

                    {/* Tower Description */}
                    {tower.description && (
                      <p className="text-slate-550 text-[11px] sm:text-xs leading-relaxed mb-4">
                        {tower.description}
                      </p>
                    )}
                  </div>

                  {/* Associated Offices (Prestigious Partners) */}
                  {tower.offices && tower.offices.length > 0 && (
                    <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 mt-auto">
                      <span className="text-[8px] font-extrabold text-[#0055d4] uppercase tracking-wider">
                        Our Clients
                      </span>
                      <ul className="flex flex-col gap-1.5">
                        {tower.offices.map((office, oIdx) => (
                          <li
                            key={oIdx}
                            className="text-slate-600 font-semibold text-[10.5px] leading-snug tracking-wide list-none pl-0 text-left"
                          >
                            {office}
                          </li>
                        ))}
                      </ul>
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
