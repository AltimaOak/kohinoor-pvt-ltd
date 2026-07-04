"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Compass,
  Flame,
  ShieldAlert,
  HeartPulse,
  ArrowUpRight
} from "lucide-react";
import { getDb, ContactsData } from "@/app/actions";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const [contacts, setContacts] = useState<ContactsData | null>(null);
  const [activeCard, setActiveCard] = useState<"police" | "fire" | "hospital" | null>(null);

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

  if (!contacts) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Find all unique manager emails for the head section
  const managerEmails = Array.from(new Set(contacts.managers.map(m => m.email)));

  return (
    <div className="flex flex-col w-full pb-6 sm:pb-12 overflow-hidden bg-white">
      
      {/* 1. HEADER PAGE BANNER */}
      <section className="relative pt-12 pb-8 md:pt-16 md:pb-10 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto w-full bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.08),transparent_60%)]">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-10 w-96 h-96 rounded-full bg-sky-200/10 blur-[80px] pointer-events-none" />

        <div className="max-w-3xl flex flex-col gap-3 text-left relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-sky-50 border border-sky-100 text-sky-700 text-[10px] font-bold w-max uppercase tracking-wider"
          >
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>Contact Us</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black font-display text-gradient-sky tracking-tight leading-[1.1]"
          >
            GET IN TOUCH
          </motion.h1>
        </div>
      </section>

      {/* 2. CONTACT DETAILS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full relative z-10">
        <div className="flex flex-col gap-6 sm:gap-10">
          <div className="flex flex-col gap-6 items-center">
            <h3 className="text-xl font-extrabold text-navy-900 tracking-tight text-center">
              Corporate Headquarters
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full mt-4 items-stretch">
              {/* Left Column: Contact Cards */}
              <div className="lg:col-span-6 flex flex-col justify-center w-full">
                <ul className="flex flex-col gap-5 text-sm text-slate-600 text-left w-full max-w-lg mx-auto lg:mx-0">
                  <motion.li
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex items-start gap-4 p-4 sm:p-5 bg-white border border-slate-200/40 rounded-[20px] sm:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] group hover:border-sky-300 transition-all duration-300"
                  >
                    <div className="w-10.5 h-10.5 rounded-xl bg-sky-500/5 border border-sky-400/20 flex items-center justify-center shrink-0 text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-300">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Physical Site Address</span>
                      <a
                        href={contacts.siteAddressMapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-navy-800 font-bold mt-1.5 leading-relaxed hover:text-sky-500 transition-colors whitespace-pre-line"
                      >
                        {contacts.siteAddress}
                      </a>
                    </div>
                  </motion.li>
                  
                  {managerEmails.length > 0 && (
                    <motion.li
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="flex items-start gap-4 p-4 sm:p-5 bg-white border border-slate-200/40 rounded-[20px] sm:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] group hover:border-sky-300 transition-all duration-300"
                    >
                      <div className="w-10.5 h-10.5 rounded-xl bg-sky-500/5 border border-sky-400/20 flex items-center justify-center shrink-0 text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-300">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Corporate & Operations Email</span>
                        {managerEmails.map((email, idx) => (
                          <a
                            key={idx}
                            href={`mailto:${email}`}
                            className="text-navy-800 font-bold hover:text-sky-500 transition-colors break-all"
                          >
                            {email}
                          </a>
                        ))}
                      </div>
                    </motion.li>
                  )}
                </ul>
              </div>

              {/* Right Column: Google Maps Iframe */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-6 w-full h-[280px] sm:h-[340px] rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:border-sky-300 hover:shadow-md transition-all duration-300"
              >
                <iframe
                  title="Google Map showing corporate office address location"
                  src="https://maps.google.com/maps?q=19.081129,72.886431&t=&z=17&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </motion.div>
            </div>
          </div>

            {/* Emergency Contacts Section */}
            <div className="w-full mt-10 sm:mt-16 max-w-5xl mx-auto">
              <div className="flex flex-col items-center gap-2 mb-8 text-center">
                <h3 className="text-xl md:text-2xl font-black text-navy-900 tracking-tight">
                  Emergency Contacts Directory
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
                  Important local emergency assistance numbers. Click on any contact number to launch your dialer immediately.
                </p>
              </div>

          {/* Grid */}
          <div role="tablist" className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full items-start">
            
            {/* Police Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onClick={() => setActiveCard(activeCard === "police" ? null : "police")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveCard(activeCard === "police" ? null : "police");
                }
              }}
              tabIndex={0}
              role="tab"
              aria-selected={activeCard === "police"}
              className={cn(
                "p-5 border border-slate-100 border-t-2 rounded-xl flex flex-col gap-4 text-left transition-all duration-300 ease-in-out group cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 outline-none h-full",
                activeCard === "police"
                  ? "bg-[#FFF8E6] border-t-[#F4B400] shadow-md -translate-y-1"
                  : "bg-white border-t-amber-500/30 hover:border-t-[#F4B400] shadow-xs hover:bg-[#FFF8E6] hover:shadow-md hover:-translate-y-1"
              )}
            >
              <div className="flex items-center gap-3.5">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300",
                  activeCard === "police"
                    ? "bg-[#FDE9A9] text-[#C88700]"
                    : "bg-slate-50 text-slate-400 group-hover:bg-[#FDE9A9] group-hover:text-[#C88700]"
                )}>
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className={cn(
                    "text-[10px] font-bold tracking-wider uppercase transition-colors duration-300",
                    activeCard === "police" ? "text-[#C88700]" : "text-slate-400 group-hover:text-[#C88700]"
                  )}>
                    Police Station
                  </span>
                  <h4 className={cn(
                    "text-base font-bold leading-tight mt-0.5 tracking-tight transition-colors duration-300",
                    activeCard === "police" ? "text-[#9A6700]" : "text-slate-900 group-hover:text-[#9A6700]"
                  )}>
                    Vinobha Bhave Police Station
                  </h4>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">Address</span>
                  <span className="text-xs text-slate-500 leading-relaxed mt-0.5">
                    3 VCM+PM5, MIG Colony, Vinobha Bhave Naga, Kurla West, Kurla, Mumbai – 400070
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2" onClick={(e) => e.stopPropagation()}>
                <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">Phone Numbers</span>
                <a
                  href="tel:0222620826"
                  className={cn(
                    "group/phone flex justify-between items-center p-3 rounded-lg border transition-all duration-300 cursor-pointer",
                    activeCard === "police"
                      ? "bg-[#FFF4CC] border-[#FDE9A9] text-[#9A6700] hover:bg-[#FFF2B3]"
                      : "bg-slate-50 border-slate-100 text-slate-750 group-hover:bg-[#FFF4CC]/70 group-hover:border-[#FDE9A9]/60 group-hover:text-[#9A6700] hover:bg-[#FFF4CC] hover:border-[#FDE9A9] hover:text-[#9A6700]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Phone className={cn(
                      "w-4 h-4 shrink-0 transition-colors duration-300",
                      activeCard === "police" ? "text-[#C88700]" : "text-slate-400 group-hover:text-[#C88700]"
                    )} />
                    <span className="text-xs font-semibold">
                      022-22620826
                    </span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                </a>
                <a
                  href="tel:02222644405"
                  className={cn(
                    "group/phone flex justify-between items-center p-3 rounded-lg border transition-all duration-300 cursor-pointer",
                    activeCard === "police"
                      ? "bg-[#FFF4CC] border-[#FDE9A9] text-[#9A6700] hover:bg-[#FFF2B3]"
                      : "bg-slate-50 border-slate-100 text-slate-750 group-hover:bg-[#FFF4CC]/70 group-hover:border-[#FDE9A9]/60 group-hover:text-[#9A6700] hover:bg-[#FFF4CC] hover:border-[#FDE9A9] hover:text-[#9A6700]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Phone className={cn(
                      "w-4 h-4 shrink-0 transition-colors duration-300",
                      activeCard === "police" ? "text-[#C88700]" : "text-slate-400 group-hover:text-[#C88700]"
                    )} />
                    <span className="text-xs font-semibold">
                      022-22644405
                    </span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            </motion.div>

            {/* Fire Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onClick={() => setActiveCard(activeCard === "fire" ? null : "fire")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveCard(activeCard === "fire" ? null : "fire");
                }
              }}
              tabIndex={0}
              role="tab"
              aria-selected={activeCard === "fire"}
              className={cn(
                "p-5 border border-slate-100 border-t-2 rounded-xl flex flex-col gap-4 text-left transition-all duration-300 ease-in-out group cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 outline-none h-full",
                activeCard === "fire"
                  ? "bg-[#FFF1F1] border-t-[#EF4444] shadow-md -translate-y-1"
                  : "bg-white border-t-rose-500/30 hover:border-t-[#EF4444] shadow-xs hover:bg-[#FFF1F1] hover:shadow-md hover:-translate-y-1"
              )}
            >
              <div className="flex items-center gap-3.5">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300",
                  activeCard === "fire"
                    ? "bg-[#FFD6D6] text-[#DC2626]"
                    : "bg-rose-50 text-rose-600 group-hover:bg-[#FFD6D6] group-hover:text-[#DC2626]"
                )}>
                  <Flame className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className={cn(
                    "text-[10px] font-bold tracking-wider uppercase transition-colors duration-300",
                    activeCard === "fire" ? "text-[#DC2626]" : "text-slate-400 group-hover:text-[#DC2626]"
                  )}>
                    Fire Station
                  </span>
                  <h4 className={cn(
                    "text-base font-bold leading-tight mt-0.5 tracking-tight transition-colors duration-300",
                    activeCard === "fire" ? "text-[#B91C1C]" : "text-slate-900 group-hover:text-[#B91C1C]"
                  )}>
                    KURLA Fire Station
                  </h4>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">Address</span>
                  <span className="text-xs text-slate-500 leading-relaxed mt-0.5">
                    3VMP+QCW, Lal Bahadur Shastri Marg, Vidyavihar West, Kurla, Mumbai – 400070
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2" onClick={(e) => e.stopPropagation()}>
                <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">Phone Number</span>
                <a
                  href="tel:02225039200"
                  className={cn(
                    "group/phone flex justify-between items-center p-3 rounded-lg border transition-all duration-300 cursor-pointer",
                    activeCard === "fire"
                      ? "bg-[#FFE5E5] border-[#FFD6D6] text-[#B91C1C] hover:bg-[#FFD3D3]"
                      : "bg-slate-50 border-slate-100 text-slate-750 group-hover:bg-[#FFE5E5]/70 group-hover:border-[#FFD6D6]/60 group-hover:text-[#B91C1C] hover:bg-[#FFE5E5] hover:border-[#FFD6D6] hover:text-[#B91C1C]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Phone className={cn(
                      "w-4 h-4 shrink-0 transition-colors duration-300",
                      activeCard === "fire" ? "text-[#DC2626]" : "text-slate-400 group-hover:text-[#DC2626]"
                    )} />
                    <span className="text-xs font-semibold">
                      022-25039200
                    </span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            </motion.div>

            {/* Hospital & Ambulance Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={() => setActiveCard(activeCard === "hospital" ? null : "hospital")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveCard(activeCard === "hospital" ? null : "hospital");
                }
              }}
              tabIndex={0}
              role="tab"
              aria-selected={activeCard === "hospital"}
              className={cn(
                "p-5 border border-slate-100 border-t-2 rounded-xl flex flex-col gap-4 text-left transition-all duration-300 ease-in-out group cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 outline-none h-full",
                activeCard === "hospital"
                  ? "bg-[#F0FFF6] border-t-[#22C55E] shadow-md -translate-y-1"
                  : "bg-white border-t-emerald-500/30 hover:border-t-[#22C55E] shadow-xs hover:bg-[#F0FFF6] hover:shadow-md hover:-translate-y-1"
              )}
            >
              <div className="flex items-center gap-3.5">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300",
                  activeCard === "hospital"
                    ? "bg-[#DDFCE8] text-[#15803D]"
                    : "bg-emerald-50 text-emerald-600 group-hover:bg-[#DDFCE8] group-hover:text-[#15803D]"
                )}>
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className={cn(
                    "text-[10px] font-bold tracking-wider uppercase transition-colors duration-300",
                    activeCard === "hospital" ? "text-[#15803D]" : "text-slate-400 group-hover:text-[#15803D]"
                  )}>
                    Hospital & Medical
                  </span>
                  <h4 className={cn(
                    "text-base font-bold leading-tight mt-0.5 tracking-tight transition-colors duration-300",
                    activeCard === "hospital" ? "text-[#166534]" : "text-slate-900 group-hover:text-[#166534]"
                  )}>
                    Criticare Asia Hospital
                  </h4>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">Address</span>
                  <span className="text-xs text-slate-500 leading-relaxed mt-0.5">
                    Building No. 1, Kirol Road, LBS Marg, Near Kohinoor School, Kurla West, Mumbai – 400070
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2" onClick={(e) => e.stopPropagation()}>
                <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">Hospital Lines</span>
                <a
                  href="tel:02267556755"
                  className={cn(
                    "group/phone flex justify-between items-center p-3 rounded-lg border transition-all duration-300 cursor-pointer",
                    activeCard === "hospital"
                      ? "bg-[#E8FFF0] border-[#DDFCE8] text-[#166534] hover:bg-[#CEFAD6]"
                      : "bg-slate-50 border-slate-100 text-slate-750 group-hover:bg-[#E8FFF0]/70 group-hover:border-[#DDFCE8]/60 group-hover:text-[#166534] hover:bg-[#E8FFF0] hover:border-[#DDFCE8] hover:text-[#166534]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Phone className={cn(
                      "w-4 h-4 shrink-0 transition-colors duration-300",
                      activeCard === "hospital" ? "text-[#15803D]" : "text-slate-400 group-hover:text-[#15803D]"
                    )} />
                    <span className="text-xs font-semibold">
                      022-67556755
                    </span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                </a>
                <a
                  href="tel:9930693333"
                  className={cn(
                    "group/phone flex justify-between items-center p-3 rounded-lg border transition-all duration-300 cursor-pointer",
                    activeCard === "hospital"
                      ? "bg-[#E8FFF0] border-[#DDFCE8] text-[#166534] hover:bg-[#CEFAD6]"
                      : "bg-slate-50 border-slate-100 text-slate-750 group-hover:bg-[#E8FFF0]/70 group-hover:border-[#DDFCE8]/60 group-hover:text-[#166534] hover:bg-[#E8FFF0] hover:border-[#DDFCE8] hover:text-[#166534]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Phone className={cn(
                      "w-4 h-4 shrink-0 transition-colors duration-300",
                      activeCard === "hospital" ? "text-[#15803D]" : "text-slate-400 group-hover:text-[#15803D]"
                    )} />
                    <span className="text-xs font-semibold">
                      9930693333
                    </span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>

      {/* 4. ADMIN & OPERATIONS DIRECTORY SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 w-full relative z-10 py-10">
        <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight text-center mb-5">
          Administration & Operations Directory
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {contacts.managers.map((mgr, idx) => (
            <motion.div
              key={mgr.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="p-5 border border-slate-100 bg-white shadow-xs flex flex-col gap-4 text-left hover:border-slate-200 hover:shadow-sm transition-all duration-200 rounded-xl"
            >
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600">{mgr.category}</span>
                <h4 className="text-sm font-bold text-slate-900 mt-3 leading-none">{mgr.name}</h4>
                <p className="text-xs text-slate-500 font-semibold mt-1">{mgr.role}</p>
              </div>
              
              <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
                <a
                  href={`tel:${mgr.phone}`}
                  className="group/btn flex items-center gap-3 px-3 py-2 rounded-lg border border-slate-100 bg-slate-50 hover:border-sky-200 hover:bg-sky-50/40 transition-all duration-300"
                >
                  <div className="w-7 h-7 rounded bg-slate-100 border border-slate-200/30 text-slate-500 flex items-center justify-center shrink-0 group-hover/btn:scale-105 transition-transform">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 group-hover/btn:text-sky-600 transition-colors">{mgr.phone}</span>
                </a>
                
                <a
                  href={`mailto:${mgr.email}`}
                  className="group/btn flex items-center gap-3 px-3 py-2 rounded-lg border border-slate-100 bg-slate-50 hover:border-sky-200 hover:bg-sky-50/40 transition-all duration-300 min-w-0"
                >
                  <div className="w-7 h-7 rounded bg-slate-100 border border-slate-200/30 text-slate-500 flex items-center justify-center shrink-0 group-hover/btn:scale-105 transition-transform">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 group-hover/btn:text-sky-600 transition-colors break-all">
                    {mgr.email}
                  </span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
