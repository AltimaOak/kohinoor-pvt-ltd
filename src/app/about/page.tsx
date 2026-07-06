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
  }
];

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full pb-12 overflow-hidden bg-white">
     {/* 1. HERO PAGE BANNER & VISION SPLIT */}
<section className="relative py-10 md:py-12 px-6 md:px-12 max-w-7xl mx-auto w-full overflow-hidden">
  {/* Decorative Background */}
  <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-sky-100/40 blur-3xl pointer-events-none" />
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
    {/* Left Content */}
    <div className="lg:col-span-7 flex flex-col">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-bold text-sky-600">
        <Compass className="w-4 h-4" />
        ABOUT US
      </div>
      {/* Heading */}
      <h1 className="mt-3 text-4xl lg:text-5xl font-black leading-tight tracking-tight text-slate-900">
        Engineering the Future of
        <br />
        <span className="text-sky-600">
          Corporate Landmarks
        </span>
      </h1>
      {/* Description */}
      <p className="mt-5 max-w-2xl text-[15px] leading-7 text-slate-600">
        KOHINOOR CITY OFFICE TOWERS INDUSTRIAL ESTATE &
        PREMISES CO-OPERATIVE SOCIETY LTD. empowers businesses
        through thoughtfully designed commercial spaces,
        premium infrastructure and modern workplace services
        that create an exceptional business environment.
      </p>
    </div>
    {/* Vision Card */}
    <div className="lg:col-span-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 border border-sky-100">
            <Eye className="w-5 h-5 text-sky-600" />
          </div>
<<<<<<< HEAD

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
            <p className="text-slate-500 text-xs sm:text-sm mt-3 leading-relaxed">
              KOHINOOR CITY OFFICE TOWERS INDUSTRIAL ESTATE & PREMISES CO-OP SOCIETY Ltd.
               Is dedicated to creating spaces that inspire growth and lasting relationships.
=======
          <div>
            <span className="text-[11px] uppercase tracking-[0.18em] font-bold text-sky-600">
              OUR VISION
            </span>
            <h3 className="mt-2 text-xl font-bold text-slate-900">
              Creating Future-Ready Workspaces
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              To redefine premium commercial environments by
              combining thoughtful architecture, functionality
              and sustainability while setting new benchmarks
              for corporate workplaces.
>>>>>>> e83ad75c48478eb69ecaf77a89342a29d8d384f7
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<<<<<<< HEAD
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100/85 bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-xs max-w-3xl w-full select-none items-center mt-2">
            
            {/* Stat 1 */}
            <div className="flex items-center gap-3.5 justify-center py-3 sm:py-1">
              <div className="w-10 h-10 rounded-full bg-blue-50/50 border border-blue-100/40 flex items-center justify-center text-blue-600 shrink-0">
                <Building className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-black text-slate-900 leading-none">4</span>
                <span className="text-[8px] font-bold text-slate-450 uppercase tracking-wider mt-1">Towers</span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-3.5 justify-center py-3 sm:py-1 px-2">
              <div className="w-10 h-10 rounded-full bg-blue-50/50 border border-blue-100/40 flex items-center justify-center text-blue-600 shrink-0">
                <Users className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-black text-slate-900 leading-none">10+</span>
                <span className="text-[8px] font-bold text-slate-450 uppercase tracking-wider mt-1">Businesses</span>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-3.5 justify-center py-3 sm:py-1">
              <div className="w-10 h-10 rounded-full bg-blue-50/50 border border-blue-100/40 flex items-center justify-center text-blue-600 shrink-0">
                <ShieldCheck className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-black text-slate-900 leading-none">1</span>
                <span className="text-[8px] font-bold text-slate-450 uppercase tracking-wider mt-1">Vision</span>
              </div>
            </div>
=======
    {/* 2. OUR LANDMARK */}
<section className="py-10 bg-[#FCFCFA] border-y border-[#ECEAE4]">
  <div className="max-w-6xl mx-auto px-6 lg:px-12">
    {/* Header */}
    <div className="max-w-2xl">
      <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-sky-600">
        <div className="w-8 h-[2px] bg-sky-600 rounded-full" />
        OUR LANDMARK
      </span>
      <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900">
        Kohinoor Commercial II
      </h2>
      <p className="mt-4 text-[15px] leading-7 text-slate-600">
        Kohinoor City Office Towers Industrial Estate & Premises
        Co-operative Society Ltd. provides a premium commercial
        environment designed to support businesses through quality
        infrastructure, reliable services and a collaborative workplace.
      </p>
    </div>
    {/* Stats */}
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 rounded-2xl border border-[#ECEAE4] bg-white overflow-hidden">
      {/* Towers */}
      <div className="flex items-center gap-4 px-6 py-5 border-b md:border-b-0 md:border-r border-[#ECEAE4]">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
          <Building className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900">
            4
          </h3>
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
            Commercial Towers
          </p>
        </div>
      </div>
      {/* Clients */}
      <div className="flex items-center gap-4 px-6 py-5 border-b md:border-b-0 md:border-r border-[#ECEAE4]">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900">
            10+
          </h3>
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
            Corporate Clients
          </p>
        </div>
      </div>
      {/* Vision */}
      <div className="flex items-center gap-4 px-6 py-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900">
            1
          </h3>
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
            Shared Vision
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
     {/* 3. OUR CLIENTS */}
<section className="py-12 bg-[#FCFCFA] border-t border-[#ECEAE4]">
  <div className="max-w-7xl mx-auto px-6 lg:px-12">

    {/* Header */}
    <div className="max-w-2xl mb-10">

      <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-sky-600">

        <div className="w-8 h-[2px] bg-sky-500 rounded-full" />

        OUR CLIENTS

      </span>

      <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900">
        Businesses That Trust Us
      </h2>

      <p className="mt-3 text-slate-600 text-[15px] leading-7">
        Kohinoor Commercial II is home to renowned organizations across
        finance, engineering, logistics, education, real estate and
        professional services.
      </p>

    </div>

    {/* Clients */}

    <div className="grid lg:grid-cols-2 gap-x-16 gap-y-2">

      {[
        "Sterling Engineering Consultancy Services Pvt. Ltd.",
        "M. Pallonji Logistics Pvt. Ltd.",
        "Ashoka Sthapathya Pvt. Ltd.",
        "Nahar Retail Trading Services Ltd.",
        "Vishyam Estate Pvt. Ltd.",
        "National Stock Exchange of India Limited",
        "The Clearing Corporation of India Ltd.",
        "Indian Institute of Banking and Finance",
        "Indepesca Overseas Pvt. Ltd.",
        "Rhythm House Pvt. Ltd.",
        "Edelweiss",
      ].map((company, index) => (

        <div
          key={index}
          className="group flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300 hover:bg-[#F7F5EF]"
        >

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF6FF] text-sky-700 text-xs font-bold transition-all group-hover:bg-sky-600 group-hover:text-white">

            {String(index + 1).padStart(2, "0")}

          </div>

          <div className="flex-1 border-b border-[#ECEAE4] pb-3">

            <p className="text-[15px] leading-6 text-slate-700 group-hover:text-slate-900 transition-colors">

              {company}

            </p>
>>>>>>> e83ad75c48478eb69ecaf77a89342a29d8d384f7

          </div>

        </div>

<<<<<<< HEAD
      {/* 3. OUR ENGAGED CLIENTS / TOWERS GRID */}
      <section className="py-16 bg-slate-50/40 w-full border-t border-slate-100/80">
        <div className="max-w-[90rem] mx-auto px-6 md:px-12 flex flex-col gap-12">
          
          {/* Header */}
          <div className="flex flex-col items-center gap-3 max-w-xl mx-auto select-none">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Our Engaged Clients
            </h2>
            <div className="w-12 h-[2.5px] bg-[#0055d4] rounded-full" />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch max-w-5xl mx-auto w-full">
            {towersData.map((tower, idx) => (
              <motion.div
                key={tower.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative overflow-hidden p-6 sm:p-7 rounded-2xl border border-slate-100 bg-white hover:border-[#0055d4]/20 hover:shadow-[0_20px_40px_-15px_rgba(0,85,212,0.08)] hover:-translate-y-1.5 transition-all duration-500 ease-out flex flex-col justify-between"
              >
                {/* Accent top line on hover */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#0055d4] to-sky-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out z-20" />

                {/* Decorative background glow */}
                <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-sky-200/5 blur-2xl group-hover:bg-[#0055d4]/5 transition-colors duration-500 pointer-events-none z-0" />

                <div className="relative z-10 flex flex-col gap-5 h-full justify-between">
                  {/* Associated Offices */}
                  {tower.offices && tower.offices.length > 0 && (
                    <div className="flex flex-col gap-3 w-full">
                      <span className="flex items-center gap-1.5 text-[9px] font-bold text-[#0055d4]/90 uppercase tracking-widest select-none">
                        <Building className="w-3.5 h-3.5 stroke-[2.5]" />
                        Associated Offices
                      </span>
                      <ul className="flex flex-col gap-2.5">
                        {tower.offices.map((office, oIdx) => {
                          const cleanedName = office.replace(/^\s*\d+\.\s*/, "").trim();
                          return (
                            <li
                              key={oIdx}
                              className="flex items-start gap-2.5 text-slate-600 font-medium text-xs leading-snug tracking-wide list-none pl-0 text-left hover:text-slate-900 transition-colors duration-200"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0055d4]/40 mt-1.5 shrink-0 group-hover:bg-[#0055d4] transition-colors duration-300" />
                              <span>{cleanedName}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>
=======
      ))}

    </div>

  </div>
</section>
>>>>>>> e83ad75c48478eb69ecaf77a89342a29d8d384f7

    </div>
  );
}
