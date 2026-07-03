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
  HeartPulse
} from "lucide-react";
import { getDb, ContactsData } from "@/app/actions";

export default function ContactPage() {
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
    <div className="flex flex-col w-full pb-10 sm:pb-20 overflow-hidden">
      
      {/* 1. HEADER PAGE BANNER */}
      <section className="relative pt-16 pb-10 md:pt-24 md:pb-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto w-full bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.08),transparent_60%)]">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-10 w-96 h-96 rounded-full bg-sky-200/10 blur-[80px] pointer-events-none" />

        <div className="max-w-3xl flex flex-col gap-5 text-left relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-400/20 bg-sky-500/5 text-sky-700 text-[10px] font-bold w-max uppercase tracking-wider"
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
      <section className="max-w-5xl mx-auto px-6 md:px-12 w-full relative z-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6 text-center items-center">
            <h3 className="text-xl font-extrabold text-navy-900 tracking-tight">
              Corporate Headquarters
            </h3>
            
            <ul className="flex flex-col gap-5 text-sm text-slate-600 text-left w-full mt-4 max-w-lg">
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

              <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-6 w-full">
                {/* Police Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="p-5 border border-yellow-300 bg-yellow-50/60 rounded-2xl flex flex-col gap-4 text-left hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:border-yellow-400 active:bg-yellow-200/60 hover:bg-yellow-100/40 transition-all duration-200 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/[0.04] rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-400/20 text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-yellow-600">Police Station</span>
                      <h4 className="text-sm font-extrabold text-navy-900 leading-tight">Vinobha Bhave Police Station</h4>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1 text-xs text-slate-500 leading-normal pt-2 border-t border-yellow-200">
                    <span className="font-extrabold uppercase text-[8px] text-slate-400">Address</span>
                    <span className="text-slate-600">3 VCM+PM5, MIG Colony, Vinobha Bhave Naga, Kurla West, Kurla, Mumbai – 400070</span>
                  </div>

                  <div className="flex flex-col gap-2.5 pt-4 border-t border-yellow-200">
                    <span className="font-extrabold uppercase text-[8px] text-slate-400">Phone Numbers</span>
                    <a
                      href="tel:0222620826"
                      className="group/btn flex items-center gap-3 p-3 rounded-xl border border-yellow-300 bg-white hover:bg-yellow-500 hover:text-white hover:border-yellow-500 transition-all duration-200 text-xs font-bold text-navy-800"
                    >
                      <Phone className="w-4 h-4 text-yellow-500 group-hover/btn:text-white transition-colors shrink-0" />
                      <span>02-22620826</span>
                    </a>
                    <a
                      href="tel:02222644405"
                      className="group/btn flex items-center gap-3 p-3 rounded-xl border border-yellow-300 bg-white hover:bg-yellow-500 hover:text-white hover:border-yellow-500 transition-all duration-200 text-xs font-bold text-navy-800"
                    >
                      <Phone className="w-4 h-4 text-yellow-500 group-hover/btn:text-white transition-colors shrink-0" />
                      <span>022-22644405</span>
                    </a>
                  </div>
                </motion.div>

                {/* Fire Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="p-5 border border-rose-300 bg-rose-50/60 rounded-2xl flex flex-col gap-4 text-left hover:shadow-[0_0_30px_rgba(244,63,94,0.3)] hover:border-rose-400 active:bg-rose-200/60 hover:bg-rose-100/40 transition-all duration-200 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/[0.04] rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-400/20 text-rose-600 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300 flex items-center justify-center shrink-0">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-rose-600">Fire Station</span>
                      <h4 className="text-sm font-extrabold text-navy-900 leading-tight">KURLA Fire Station</h4>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 text-xs text-slate-500 leading-normal pt-2 border-t border-rose-200">
                    <span className="font-extrabold uppercase text-[8px] text-slate-400">Address</span>
                    <span className="text-slate-600">3VMP+QCW, Lal Bahadur Shastri Marg, Vidyavihar West, Kurla, Mumbai – 400070</span>
                  </div>

                  <div className="flex flex-col gap-2.5 pt-4 border-t border-rose-200">
                    <span className="font-extrabold uppercase text-[8px] text-slate-400">Phone Number</span>
                    <a
                      href="tel:02225039200"
                      className="group/btn flex items-center gap-3 p-3 rounded-xl border border-rose-300 bg-white hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-200 text-xs font-bold text-navy-800"
                    >
                      <Phone className="w-4 h-4 text-rose-500 group-hover/btn:text-white transition-colors shrink-0" />
                      <span>022 25039200</span>
                    </a>
                  </div>
                </motion.div>

                {/* Hospital & Ambulance Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="p-5 border border-emerald-300 bg-emerald-50/60 rounded-2xl flex flex-col gap-4 text-left hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:border-emerald-400 active:bg-emerald-200/60 hover:bg-emerald-100/40 transition-all duration-200 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/[0.04] rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 flex items-center justify-center shrink-0">
                      <HeartPulse className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600">Hospital & Medical</span>
                      <h4 className="text-sm font-extrabold text-navy-900 leading-tight">Criticare Asia Hospital</h4>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 text-xs text-slate-500 leading-normal pt-2 border-t border-emerald-200">
                    <span className="font-extrabold uppercase text-[8px] text-slate-400">Address</span>
                    <span className="text-slate-600">Building No. 1, Kirol Road, LBS Marg, Near Kohinoor School, Kurla West, Mumbai – 400070</span>
                  </div>

                  <div className="flex flex-col gap-2 pt-4 border-t border-emerald-200">
                    <span className="font-extrabold uppercase text-[8px] text-slate-400">Hospital Lines</span>
                    <a
                      href="tel:02267556755"
                      className="group/btn flex items-center gap-3 p-3 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-200 text-xs font-bold text-navy-800"
                    >
                      <Phone className="w-4 h-4 text-emerald-500 group-hover/btn:text-white transition-colors shrink-0" />
                      <span>022 67556755</span>
                    </a>
                    <a
                      href="tel:9930693333"
                      className="group/btn flex items-center gap-3 p-3 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-200 text-xs font-bold text-navy-800"
                    >
                      <Phone className="w-4 h-4 text-emerald-500 group-hover/btn:text-white transition-colors shrink-0" />
                      <span>9930693333</span>
                    </a>
                
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Key Management & Administration Contacts */}
            <div className="w-full mt-10 sm:mt-16 max-w-5xl mx-auto">
              <h3 className="text-xl md:text-2xl font-black text-navy-900 tracking-tight text-center mb-8">
                Administration & Operations Directory
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {contacts.managers.map((mgr, idx) => (
                  <motion.div
                    key={mgr.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="p-6 border border-slate-200 bg-white shadow-sm flex flex-col gap-6 text-left hover:border-slate-300 hover:shadow-md transition-all duration-200 rounded-2xl"
                  >
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-600">{mgr.category}</span>
                      <h4 className="text-base font-extrabold text-navy-900 mt-4 leading-none">{mgr.name}</h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1.5">{mgr.role}</p>
                    </div>
                    
                    <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                      <a
                        href={`tel:${mgr.phone}`}
                        className="group/btn flex items-center gap-3 p-2.5 rounded-xl border border-slate-200/50 bg-white hover:border-sky-300 hover:bg-sky-500/5 transition-all duration-200"
                      >
                        <div className="w-8 h-8 rounded-lg bg-sky-500/5 border border-sky-400/10 text-sky-600 flex items-center justify-center shrink-0 group-hover/btn:scale-105 transition-transform">
                          <Phone className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-navy-800 group-hover/btn:text-sky-600 transition-colors">{mgr.phone}</span>
                      </a>
                      
                      <a
                        href={`mailto:${mgr.email}`}
                        className="group/btn flex items-center gap-3 p-2.5 rounded-xl border border-slate-200/50 bg-white hover:border-sky-300 hover:bg-sky-500/5 transition-all duration-200 min-w-0"
                      >
                        <div className="w-8 h-8 rounded-lg bg-sky-500/5 border border-sky-400/10 text-sky-600 flex items-center justify-center shrink-0 group-hover/btn:scale-105 transition-transform">
                          <Mail className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-navy-800 group-hover/btn:text-sky-600 transition-colors break-all sm:break-normal sm:whitespace-nowrap">
                          {mgr.email}
                        </span>
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
