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
  Building,
  MoreVertical,
  Train,
  ChevronRight,
  ShoppingBag,
  Utensils,
  Building2,
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
  const [expandedReviews, setExpandedReviews] = useState<{ [key: number]: boolean }>({});

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
      <section className="relative min-h-[65vh] w-full flex items-center overflow-hidden">
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
      <section id="about" className="pt-6 pb-6 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Text Columns (7 Columns) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 flex flex-col gap-3"
        >
          <span className="text-[11px] font-bold text-sky-600 uppercase tracking-widest flex items-center gap-1.5">
            <Award className="w-4 h-4 text-sky-500" />
            Establishment & Location
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 font-display leading-tight">
            Kohinoor Commercial - II
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Kohinoor Commercial - II in Kurla West, Mumbai is a premier commercial destination that satisfactorily caters to the demands of its customer base. Built on a core belief of customer centricity, the business park has established long-term relationships and built an outstanding reputation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            <div className="flex gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:border-sky-200 group-hover:bg-sky-50/50 transition-colors duration-300">
                <Compass className="w-4 h-4 text-slate-500 group-hover:text-sky-600 transition-colors" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-semibold text-slate-950">Kurla West Commercial Hub</h4>
                <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                  Ideally situated in Kurla West, Mumbai, providing prime business accessibility and connectivity.
                </p>
              </div>
            </div>

            <div className="flex gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:border-sky-200 group-hover:bg-sky-50/50 transition-colors duration-300">
                <CheckCircle2 className="w-4 h-4 text-slate-500 group-hover:text-sky-600 transition-colors" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-semibold text-slate-950">Customer Centricity</h4>
                <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
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
        <div className="lg:col-span-5 flex flex-col gap-4">

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white hover:shadow-sm transition-all duration-300 flex flex-col gap-3 group w-full relative overflow-hidden"
          >
            <style dangerouslySetInnerHTML={{ __html: `
              .reviews-scroll::-webkit-scrollbar {
                width: 4px;
              }
              .reviews-scroll::-webkit-scrollbar-track {
                background: transparent;
              }
              .reviews-scroll::-webkit-scrollbar-thumb {
                background: #E2E8F0;
                border-radius: 10px;
              }
              .reviews-scroll::-webkit-scrollbar-thumb:hover {
                background: #CBD5E1;
              }
            `}} />

            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 w-full">
              <div className="flex flex-col gap-2 text-left">
                <h4 className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                  Kohinoor City Office Towers.
                </h4>
                <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[10px] uppercase tracking-wider">
                  <span>Verified Reviews</span>
                  <svg className="w-3.5 h-3.5 text-blue-500 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-13 5l-4-4 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col items-end gap-0.5 shrink-0">
                <div className="flex items-center gap-1">
                  <span className="text-amber-500 text-sm">★</span>
                  <span className="text-base font-bold text-slate-950">4.0</span>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold">358 user reviews</p>
              </div>
            </div>

            <div 
              className="flex flex-col gap-3.5 max-h-[220px] overflow-y-auto pr-1.5 reviews-scroll"
            >
              {[
                {
                  author: "Sudarshan",
                  stars: 5,
                  text: "The building is well designed and houses the State Bank of India and some others. Parking is poorly lit and full of auto-rickshaws which seem to parked for ages. One wonders why they are not plying on the road. There is a 1 ft wall that one",
                  fullText: "The building is well designed and houses the State Bank of India and some others. Parking is poorly lit and full of auto-rickshaws which seem to parked for ages. One wonders why they are not plying on the road. There is a 1 ft wall that one has to cross or bypass to get into the building.",
                  hasReadMore: true,
                  initial: "S",
                  avatarBg: "bg-[#fdf0e7] text-[#c2410c]"
                },
                {
                  author: "ADITYA OJHA (Aditya)",
                  stars: 5,
                  text: "Quite good place for all the businesses. Perfect facilities and services available here. But it lacks in security when it is compared to",
                  fullText: "Quite good place for all the businesses. Perfect facilities and services available here. But it lacks in security when it is compared to other business parks.",
                  hasReadMore: true,
                  initial: "A",
                  avatarBg: "bg-[#f0f9ff] text-[#0369a1]"
                },
                {
                  author: "Nitin R.",
                  stars: 5,
                  text: "Good corporate offices hub but area surrounding are congested during peak traffic hours.",
                  hasReadMore: false,
                  initial: "N",
                  avatarBg: "bg-[#f5f3ff] text-[#6d28d9]"
                },
                {
                  author: "Saurabh P.",
                  stars: 5,
                  text: "Well maintained business park, neat and clean with multiple amenities. Great location and connectivity.",
                  hasReadMore: false,
                  initial: "S",
                  avatarBg: "bg-[#fff1f2] text-[#be123c]"
                },
                {
                  author: "Sameer S.",
                  stars: 5,
                  text: "Best office location in Kurla, very close to BKC and local railway station.",
                  hasReadMore: false,
                  initial: "S",
                  avatarBg: "bg-[#ecfdf5] text-[#047857]"
                },
                {
                  author: "Kiran M.",
                  stars: 5,
                  text: "The security is very strict, cleanliness is top notch. High class commercial offices.",
                  hasReadMore: false,
                  initial: "K",
                  avatarBg: "bg-[#f0fdfa] text-[#0f766e]"
                },
                {
                  author: "Prakash B.",
                  stars: 4,
                  text: "Good place to work, fast lifts and clean washrooms. Parking space is also available.",
                  hasReadMore: false,
                  initial: "P",
                  avatarBg: "bg-[#ecfeff] text-[#0e7490]"
                },
                {
                  author: "Sheetal T.",
                  stars: 4,
                  text: "Nice commercial complex, standard facilities. Food options are close by.",
                  hasReadMore: false,
                  initial: "S",
                  avatarBg: "bg-[#fdf4ff] text-[#a21caf]"
                },
                {
                  author: "Sunita D.",
                  stars: 5,
                  text: "Beautiful architecture, clean lobbies. Very professional crowd.",
                  hasReadMore: false,
                  initial: "S",
                  avatarBg: "bg-[#fffbeb] text-[#b45309]"
                },
                {
                  author: "Ashish G.",
                  stars: 5,
                  text: "Premium office infrastructure, well-connected to LBS road and BKC.",
                  hasReadMore: false,
                  initial: "A",
                  avatarBg: "bg-[#fdf2f8] text-[#be185d]"
                }
              ].map((rev, idx) => {
                const isExpanded = expandedReviews[idx];
                const displayText = rev.hasReadMore
                  ? (isExpanded ? rev.fullText : rev.text)
                  : rev.text;

                return (
                  <div key={idx} className="flex gap-2.5 pb-3 border-b border-slate-100 last:pb-0 last:border-b-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${rev.avatarBg}`}>
                      {rev.initial}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-slate-900 truncate text-left">
                          {rev.author}
                        </span>
                      </div>
                      <div className="flex text-amber-500 text-[10px] leading-none mt-0.5">
                        {Array.from({ length: rev.stars }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                        {Array.from({ length: 5 - rev.stars }).map((_, i) => (
                          <span key={i} className="text-slate-200">★</span>
                        ))}
                      </div>
                      <p className="text-slate-600 text-[11px] leading-normal mt-1.5 font-normal text-left">
                        {displayText}
                      </p>
                      {rev.hasReadMore && (
                        <button
                          onClick={() => setExpandedReviews(prev => ({ ...prev, [idx]: !prev[idx] }))}
                          className="text-blue-600 font-bold text-[10px] mt-1.5 hover:underline cursor-pointer block text-left"
                        >
                          {isExpanded ? "Read less" : "Read more"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3.5 border-t border-slate-100 flex items-center justify-center w-full text-xs text-slate-400 font-semibold">
              <span className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors cursor-pointer shrink-0">
                ↓ Scroll to read more
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. CORE AMENITIES GRID */}
      <section className="py-6 border-y border-slate-200/50 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-6 w-full">
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
      <section className="pt-6 pb-4 max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-6">
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

{/* 6. NEARBY LANDMARKS */}
<section className="py-8 bg-gradient-to-b from-white to-slate-50">
  <div className="max-w-7xl mx-auto px-6 lg:px-12">

    <div className="grid lg:grid-cols-[1fr_520px] gap-8 items-center">

      {/* LEFT */}

      <div>

        <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-bold text-sky-600">

          <Compass className="w-4 h-4" />

          CONNECTIVITY & LOCATION

        </span>

        <h2 className="mt-2 text-3xl md:text-4xl leading-tight font-black text-slate-900">

          Prime Location &

          <br />

          <span className="text-sky-600">

         Nearby Landmarks

          </span>

          <br />


        </h2>

        <div className="mt-4 w-16 h-[3px] bg-sky-600 rounded-full" />

        <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600">

          Kohinoor City Office Towers enjoys a strategic location in Kurla
          (West), offering excellent access to transportation, healthcare,
          premium shopping destinations and business hubs across Mumbai.

        </p>

        <div className="mt-6 grid sm:grid-cols-2 gap-4">

          {[
            {
              title: "Excellent Connectivity",
              desc: "Easy access to public transport",
              icon: Train,
            },
            {
              title: "Healthcare Access",
              desc: "Leading hospitals nearby",
              icon: HeartPulse,
            },
            {
              title: "Shopping & Lifestyle",
              desc: "Premium malls within minutes",
              icon: ShoppingBag,
            },
            {
              title: "Dining Options",
              desc: "Restaurants & cafés nearby",
              icon: Utensils,
            },
          ].map((item, index) => {

            const Icon = item.icon;

            return (

              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-sky-200 hover:shadow-md"
              >

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">

                    <Icon className="w-5 h-5 text-sky-600" />

                  </div>

                  <div>

                    <h4 className="font-semibold text-slate-900 text-sm">

                      {item.title}

                    </h4>

                    <p className="text-sm text-slate-500 mt-1">

                      {item.desc}

                    </p>

                  </div>

                </div>

              </div>

            );

          })}

        </div>

      </div>

      {/* RIGHT */}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">

          <div className="w-6 h-6 rounded-md bg-sky-600 text-white flex items-center justify-center">

            <MapPin className="w-3 h-3" />

          </div>

          <h3 className="text-xl md:text-2xl font-bold text-slate-900">

            Nearby Landmarks

          </h3>

        </div>

        <div>

          {[
            {
              name: "Vidyavihar Station",
              distance: "1.0 km",
              icon: Train,
            },
            {
              name: "CritiCare Asia Hospital",
              distance: "0.5 km",
              icon: HeartPulse,
            },
            {
              name: "Phoenix Marketcity",
              distance: "0.6 km",
              icon: ShoppingCart,
            },
            {
              name: "Kohinoor Elite",
              distance: "0.9 km",
              icon: Building2,
            },
            {
              name: "Don Bosco Institute",
              distance: "250 m",
              icon: Building,
            },
            {
              name: "Airport",
              distance: "5.9 km",
              icon: Plane,
            },
          ].map((item, i) => {

            const Icon = item.icon;

            return (

              <div
                key={i}
                className="flex items-center justify-between px-5 py-3 border-b last:border-0 border-slate-100 hover:bg-slate-50 transition"
              >

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">

                    <Icon className="w-4 h-4 text-slate-600" />

                  </div>

                  <span className="font-medium text-slate-900 text-sm">

                    {item.name}

                  </span>

                </div>

                <div className="flex items-center gap-5">

                  <span className="font-semibold text-sky-600">

                    {item.distance} away

                  </span>

                  <ChevronRight className="w-5 h-5 text-slate-400" />

                </div>

              </div>

            );

          })}

        </div>

        <div className="px-5 py-4 bg-slate-50 flex items-center gap-3">

          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center border shrink-0">

            <MapPin className="w-4 h-4 text-sky-600" />

          </div>

          <p className="text-sm text-slate-600">

            Strategic location that keeps your business connected to

            <span className="font-semibold text-slate-900">
              {" "}what matters most.
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
      {/* 7. LEASING ENQUIRY & CONTACT SECTION */}
      <section id="contact" className="py-6 max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="flex flex-col gap-6 text-center items-center">
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
