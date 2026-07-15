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


export default function AboutPage() {
  return (
    <div className="flex flex-col w-full pb-12 overflow-hidden bg-white">
       {/* 1. HERO PAGE BANNER & VISION SPLIT */}
<section className="relative py-10 md:py-12 px-6 md:px-12 max-w-7xl mx-auto w-full overflow-hidden">
  {/* Decorative Background */}
  <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-sky-100/20 blur-[80px] pointer-events-none" />
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
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 border border-sky-100">
            <Eye className="w-5 h-5 text-sky-600" />
          </div>
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
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

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
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 rounded-xl border border-[#ECEAE4] bg-white overflow-hidden">
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
      <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900">
        Our Prestigious Engaged Clients
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
        "Edelweiss Group",
        "American School of Bombay",
        "Safe Pro Fire Services",
        "Carnival Support Services India Pvt. Ltd.",
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

          </div>

        </div>

      ))}

    </div>

  </div>
</section>

    </div>
  );
}
