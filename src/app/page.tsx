"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Compass,
  ArrowUpRight,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Zap,
  Shield,
  Video,
  ArrowUpDown,
  Car,
  BatteryCharging,
  Flame,
  HeartPulse,
  ShoppingCart,
  Soup,
  Plane,
  Building
} from "lucide-react";
import InteractiveGallery from "@/components/InteractiveGallery";
import { getDb, ContactsData } from "@/app/actions";

const MassageChairIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
    >
      <defs>
        {/* Mask for background elements (cuts out around the armrest base and stand) */}
        <mask id="bg-mask">
          <rect x="0" y="0" width="100" height="100" fill="white" />
          <path
            d="M27 45 h25 c 3 0, 5 2, 5 5 v22 h -35 v -22 c 0 -3, 2 -5, 5 -5 z"
            fill="black"
            stroke="black"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <rect x="22" y="70" width="37" height="6" rx="3" fill="black" stroke="black" strokeWidth="4" />
        </mask>
        {/* Mask for the base (cuts out the button hole) */}
        <mask id="base-mask">
          <rect x="0" y="0" width="100" height="100" fill="white" />
          <circle cx="48" cy="53" r="3.5" fill="black" />
        </mask>
      </defs>

      {/* Background elements (backrest and person) */}
      <g mask="url(#bg-mask)">
        {/* Chair Backrest */}
        <rect x="48" y="16" width="16" height="60" rx="8" transform="rotate(28 56 46)" />
        {/* Head */}
        <circle cx="61" cy="21" r="7.5" />
        {/* Torso */}
        <path d="M59 27 L48 44" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
        {/* Thigh */}
        <path d="M48 44 L29 55" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
        {/* Shin */}
        <path d="M29 55 L16 67" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
        {/* Arm */}
        <path d="M53 32 C48 37, 46 39, 38 39" fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" />
      </g>

      {/* Foreground elements */}
      {/* Base with button hole */}
      <path
        d="M27 45 h25 c 3 0, 5 2, 5 5 v22 h -35 v -22 c 0 -3, 2 -5, 5 -5 z"
        mask="url(#base-mask)"
      />
      {/* Base Stand */}
      <rect x="22" y="70" width="37" height="6" rx="3" />
    </svg>
  );
};

export default function LandingPage() {
  const [contacts, setContacts] = useState<ContactsData | null>(null);

  useEffect(() => {
    async function loadContacts() {
      try {
        const data = await getDb();
        setContacts(data.contacts);
      } catch (err) {
        console.error("Failed to load contacts:", err);
      }
    }
    loadContacts();
  }, []);

  return (
    <div className="flex flex-col w-full pb-12 overflow-hidden">

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[75vh] w-full flex items-center overflow-hidden">
        {/* Background Image - Sharp and Un-blurred */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero_bg.jpg"
            alt="Kohinoor Towers Complex"
            className="w-full h-full object-cover object-center"
          />
          {/* Transparent soft gradient overlay to ensure 100% building image visibility on right, with text contrast on left */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-950/30 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 pt-20 pb-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center w-full">
            {/* Hero Content (8 Columns) */}
            <div className="lg:col-span-8 flex flex-col gap-3 text-left max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-center gap-1.5 text-sky-400 text-[10px] sm:text-xs font-black uppercase tracking-wider select-none mb-2"
              >
                <div className="flex flex-col gap-[3px] w-3 shrink-0">
                  <div className="h-[2px] bg-sky-400 w-3 rounded-full" />
                  <div className="h-[2px] bg-sky-400 w-2 rounded-full" />
                </div>
                <span>WELCOME TO KOHINOOR</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-4xl md:text-5xl lg:text-6.5xl font-black font-display tracking-tight text-white leading-[1.1]"
              >
                Where Business Meets Opportunity
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-[2.5px] bg-[#0055d4] w-8 my-4"
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-slate-100 text-sm md:text-base leading-relaxed max-w-xl mt-0.5 font-medium"
              >
                Kohinoor City Office Towers Industrial Estate & Premises Co-op Society Ltd. offers premium office spaces, modern infrastructure, and a secure environment designed to help your business grow.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-5"
              >
                <Link
                  href="#about"
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-[#0055d4] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 rounded-sm select-none"
                >
                  <span>ABOUT US</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>



      {/* 3. ABOUT PREVIEW SECTION */}
      <section id="about" className="pt-8 md:pt-10 pb-10 md:pb-12 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Text Columns (7 Columns) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 flex flex-col gap-4"
        >
          <span className="text-xs font-bold text-sky-600 uppercase tracking-widest flex items-center gap-1.5">
            <Award className="w-4 h-4 text-sky-500" />
            Establishment & Location
          </span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 font-display leading-tight">
            Kohinoor Commercial - II
          </h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            Kohinoor Commercial - II in Kurla West, Mumbai is a premier commercial destination that satisfactorily caters to the demands of its customer base. Built on a core belief of customer centricity, the business park has established long-term relationships and built an outstanding reputation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="flex gap-4 group">
              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:border-sky-200 group-hover:bg-sky-50/50 transition-colors duration-300">
                <Compass className="w-5 h-5 text-slate-500 group-hover:text-sky-600 transition-colors" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-semibold text-slate-950">Kurla West Commercial Hub</h4>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Ideally situated in Kurla West, Mumbai, providing prime business accessibility and connectivity.
                </p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:border-sky-200 group-hover:bg-sky-50/50 transition-colors duration-300">
                <CheckCircle2 className="w-5 h-5 text-slate-500 group-hover:text-sky-600 transition-colors" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-semibold text-slate-950">Customer Centricity</h4>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Prioritizing a positive customer experience and top-notch quality for all business operations.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 uppercase tracking-widest hover:text-sky-700 transition-colors group"
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
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-5 sm:p-6 rounded-xl border border-slate-200/60 bg-white hover:border-slate-300 hover:shadow-xs transition-all duration-200 flex items-start gap-5 group"
          >
            <div className="px-2.5 py-1 bg-sky-50 border border-sky-100 rounded-md text-sky-600 font-bold text-[10px] uppercase tracking-wider shrink-0">
              TRUST
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-semibold text-slate-950 group-hover:text-sky-600 transition-colors">100+ Reviews</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Strong reputation built on trust, quality offerings, and long-term customer relationships.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. CORE AMENITIES GRID */}
      <section className="py-10 md:py-12 border-y border-slate-200/50 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-10 w-full">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">PREMISES & AMENITIES</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-navy-900 font-display">
              Core Building Amenities
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Equipped with 24/7 security, backup power, passenger elevators, and state-of-the-art building systems.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { label: "24x7 Security", icon: Shield, desc: "Continuous perimeter patrol and visitor management" },
              { label: "Tranquil Massage Room", icon: MassageChairIcon, desc: "Re-energize your mind and body with our massage chair therapy" },
              { label: "CCTV", icon: Video, desc: "High-definition security surveillance throughout the premises" },
              { label: "Lift", icon: ArrowUpDown, desc: "High-speed corporate passenger elevators" },
              { label: "Medical Room", icon: HeartPulse, desc: "First-aid medical room and emergency healthcare support" },
              { label: "Visitors Parking", icon: Car, desc: "Dedicated guest and visitor parking spaces" },
              { label: "Power", icon: Zap, desc: "Dual grid feeds for consistent electricity" },
              { label: "Power Backup", icon: BatteryCharging, desc: "Heavy-duty generator backup power support" },
              { label: "Fire Fighting Equipment", icon: Flame, desc: "Advanced localized sprinkler & detector systems" },
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="p-4 sm:p-5 rounded-xl border border-slate-100 bg-white hover:border-slate-200 transition-all duration-200 flex flex-col items-center text-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-sky-50 group-hover:border-sky-200 group-hover:text-sky-600 transition-all duration-300 shrink-0">
                    <IconComp className="w-5.5 h-5.5 stroke-[1.8]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-xs font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">{item.label}</h4>
                    <p className="text-[10px] text-slate-500 leading-normal">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE GALLERY SECTION */}
      <section className="pt-10 md:pt-12 pb-6 md:pb-8 max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-8">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
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

      {/* 6. NEARBY LANDMARKS SECTION */}
      <section className="pt-6 md:pt-8 pb-10 md:pb-12 bg-white text-slate-800 relative w-full">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left side: Header info */}
            <div className="lg:col-span-5 flex flex-col gap-4 text-left">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-widest flex items-center gap-1.5">
                <Compass className="w-4.5 h-4.5 text-sky-500 animate-spin-slow" />
                Connectivity & Location
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-navy-900 font-display leading-tight">
                Prime Location & <br className="hidden md:inline" /> Nearby Landmarks
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Kohinoor City Office Towers is strategically located in Kurla (West) with unparalleled proximity to public transit, healthcare, premium shopping malls, and elite dining options.
              </p>
      
              <div className="flex items-center gap-6 text-slate-500">
                <div className="w-px h-1 bg-slate-200" />
                <div className="flex flex-col">
                
                </div>
              </div>
            </div>

            {/* Right side: Landmarks list widget styled like the image */}
            <div className="lg:col-span-7 w-full max-w-lg mx-auto lg:ml-auto">
              <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col gap-4">
                <h3 className="text-base font-bold tracking-tight text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <MapPin className="w-4.5 h-4.5 text-sky-500" />
                  <span>Nearby Landmarks</span>
                </h3>

                <div className="flex flex-col">
                  {[
                    {
                      name: "Vidyavihar Station",
                      distance: "1.0 km away",
                      time: null,
                      icon: MapPin,
                    },
                    {
                      name: "CritiCare Asia Hospital",
                      distance: "0.5 km away",
                      time: null,
                      icon: HeartPulse,
                    },
                    {
                      name: "Phoenix Marketcity",
                      distance: "0.6 km away",
                      time: null,
                      icon: ShoppingCart,
                    },
                    {
                      name: "Kohinoor Elite",
                      distance: "0.9 km away",
                      time: null,
                      icon: Soup,
                    },
                    {
                      name: "Don Bosco Institute",
                      distance: "250 m away",
                      time: null,
                      icon: Building,
                    },
                    {
                      name: "Airport",
                      distance: "5.9 km away",
                      time: null,
                      icon: Plane,
                    },
                  ].map((landmark, idx) => {
                    const LandmarkIcon = landmark.icon;
                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-4 py-2 ${
                          idx !== 5 ? "border-b border-slate-100" : ""
                        } hover:bg-slate-50 px-2 rounded-lg transition-all duration-200`}
                      >
                        <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-500">
                          <LandmarkIcon className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex flex-col text-left">
                          <h4 className="text-sm font-semibold text-slate-900 leading-normal">{landmark.name}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            <span className="font-semibold text-sky-600">{landmark.distance}</span>
                            {landmark.time && (
                              <span className="text-slate-400 font-medium"> ({landmark.time})</span>
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LEASING ENQUIRY & CONTACT SECTION */}
      <section id="contact" className="py-10 md:py-12 max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="flex flex-col gap-8 text-center items-center">
          <div className="flex flex-col gap-2 items-center">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest flex items-center gap-1.5">
              <Mail className="w-4.5 h-4.5 text-sky-400" />
              Corporate Relations
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-navy-900 font-display leading-tight">
              Contact & Address
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mt-0.5 max-w-lg">
              Interested in establishing your headquarters or acquiring commercial space? Reach out directly to our team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-4 text-left">
            {/* Site Address Card */}
            {contacts && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="p-5 border border-slate-100 bg-white shadow-xs flex flex-col justify-between gap-4 hover:shadow-sm hover:border-slate-200 transition-all duration-200 rounded-xl"
              >
                <div className="flex flex-col gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Physical Site Address</span>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight mt-1">Kohinoor Office Towers</h4>
                  </div>
                  <div className="w-full pt-3 border-t border-slate-100">
                    <a
                      href={contacts.siteAddressMapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-slate-600 hover:text-sky-600 transition-colors block leading-relaxed py-0.5 whitespace-pre-line"
                      title={contacts.siteAddress}
                    >
                      {contacts.siteAddress}
                    </a>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={contacts.siteAddressMapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-sky-200 bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white transition-all duration-300 font-semibold text-xs"
                  >
                    View on Maps
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            )}

            {/* Manager Cards */}
            {contacts?.managers.slice(0, 2).map((mgr, idx) => (
              <motion.div
                key={mgr.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * (idx + 1) }}
                className="p-5 border border-slate-100 bg-white shadow-xs flex flex-col justify-between gap-4 hover:shadow-sm hover:border-slate-200 transition-all duration-200 rounded-xl w-full"
              >
                <div className="flex flex-col gap-3">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600">{mgr.category}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">{mgr.name}</h4>
                    <p className="text-xs text-slate-500 font-semibold mt-1">{mgr.role}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-3 border-t border-slate-100 w-full mt-auto">
                  <a
                    href={`tel:${mgr.phone}`}
                    className="group/btn flex items-center gap-3 px-3 py-2 rounded-lg border border-slate-100 bg-slate-50 hover:border-sky-200 hover:bg-sky-50/40 transition-all duration-300 w-full"
                  >
                    <div className="w-7 h-7 rounded bg-slate-100 border border-slate-200/30 text-slate-500 flex items-center justify-center shrink-0 group-hover/btn:scale-105 transition-transform">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800 group-hover/btn:text-sky-600 transition-colors whitespace-nowrap overflow-x-auto no-scrollbar py-0.5">
                      {mgr.phone}
                    </span>
                  </a>
                  <a
                    href={`mailto:${mgr.email}`}
                    className="group/btn flex items-center gap-3 px-3 py-2 rounded-lg border border-slate-100 bg-slate-50 hover:border-sky-200 hover:bg-sky-50/40 transition-all duration-300 w-full"
                  >
                    <div className="w-7 h-7 rounded bg-slate-100 border border-slate-200/30 text-slate-500 flex items-center justify-center shrink-0 group-hover/btn:scale-105 transition-transform">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800 group-hover/btn:text-sky-600 transition-colors whitespace-nowrap overflow-x-auto no-scrollbar py-0.5">
                      {mgr.email}
                    </span>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
