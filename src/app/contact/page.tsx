"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Compass
} from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex flex-col w-full pb-20 overflow-hidden">
      
      {/* 1. HEADER PAGE BANNER */}
      <section className="relative pt-24 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.08),transparent_60%)]">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-10 w-96 h-96 rounded-full bg-sky-200/10 blur-[80px] pointer-events-none" />

        <div className="max-w-3xl flex flex-col gap-5 text-left relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-400/20 bg-sky-500/5 text-sky-700 text-[10px] font-bold w-max uppercase tracking-wider"
          >
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>Connect & Details</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black font-display text-gradient-sky tracking-tight leading-[1.1]"
          >
            Corporate Relations & Access
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-sm md:text-base leading-relaxed"
          >
            Establish your corporate footprint at KOHINOOR CITY OFFICE TOWERS. Learn more about our location details, hotlines, or coordinate direct visits.
          </motion.p>
        </div>
      </section>

      {/* 2. CONTACT DETAILS SECTION */}
      <section className="max-w-3xl mx-auto px-6 md:px-12 w-full relative z-10">
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
                className="flex items-start gap-4 p-5 bg-white border border-slate-200/40 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] group hover:border-sky-300 transition-all duration-300"
              >
                <div className="w-10.5 h-10.5 rounded-xl bg-sky-500/5 border border-sky-400/20 flex items-center justify-center shrink-0 text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Physical Site Address</span>
                  <a
                    href="https://maps.app.goo.gl/9LrPP3YqcKRDdi2t5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-navy-800 font-bold mt-1.5 leading-relaxed hover:text-sky-500 transition-colors"
                  >
                    KOHINOOR CITY OFFICE TOWERS, Landmark Ave,<br />
                    Business District, Tower B, Level 18
                  </a>
                </div>
              </motion.li>
              
              <motion.li
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-start gap-4 p-5 bg-white border border-slate-200/40 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] group hover:border-sky-300 transition-all duration-300"
              >
                <div className="w-10.5 h-10.5 rounded-xl bg-sky-500/5 border border-sky-400/20 flex items-center justify-center shrink-0 text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Corporate & Operations Email</span>
                  <a
                    href="mailto:devendra.sali@kohinoorcommercial2.in"
                    className="text-navy-800 font-bold mt-1.5 hover:text-sky-500 transition-colors"
                  >
                    devendra.sali@kohinoorcommercial2.in
                  </a>
                  <a
                    href="mailto:roshan.patil@kohinoorcommercial2.in"
                    className="text-navy-800 font-bold hover:text-sky-500 transition-colors"
                  >
                    roshan.patil@kohinoorcommercial2.in
                  </a>
                </div>
              </motion.li>
            </ul>

            {/* Key Management & Administration Contacts */}
            <div className="w-full mt-20 max-w-5xl mx-auto">
              <h3 className="text-xl md:text-2xl font-black text-navy-900 tracking-tight text-center mb-8">
                Administration & Operations Directory
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {/* Devendra Sali */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="p-8 rounded-[32px] border border-slate-200/50 bg-gradient-to-br from-white to-slate-50/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col gap-6 text-left hover:-translate-y-1.5 hover:shadow-xl hover:border-sky-400/30 transition-all duration-300 relative group"
                >
                  <div>
                    <span className="text-[9px] font-black uppercase text-sky-500 tracking-widest px-2.5 py-1 rounded-md bg-sky-500/5 border border-sky-400/10">Property & Facility</span>
                    <h4 className="text-xl font-black text-navy-900 mt-4 leading-none">Devendra Sali</h4>
                    <p className="text-xs text-slate-500 font-semibold mt-1.5">Property Manager</p>
                  </div>
                  
                  <div className="flex flex-col gap-3.5 pt-4 border-t border-slate-200/50">
                    <a
                      href="tel:8657902806"
                      className="group/btn flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-200/50 bg-white hover:border-sky-300 hover:bg-sky-500/5 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-xl bg-sky-500/5 border border-sky-400/10 text-sky-600 flex items-center justify-center shrink-0 group-hover/btn:scale-110 transition-transform">
                        <Phone className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-sm font-bold text-navy-800 group-hover/btn:text-sky-600 transition-colors">8657902806</span>
                    </a>
                    
                    <a
                      href="mailto:devendra.sali@kohinoorcommercial2.in"
                      className="group/btn flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-200/50 bg-white hover:border-sky-300 hover:bg-sky-500/5 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-xl bg-sky-500/5 border border-sky-400/10 text-sky-600 flex items-center justify-center shrink-0 group-hover/btn:scale-110 transition-transform">
                        <Mail className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-sm font-bold text-navy-800 group-hover/btn:text-sky-600 transition-colors break-all">
                        devendra.sali@kohinoorcommercial2.in
                      </span>
                    </a>
                  </div>
                </motion.div>

                {/* Roshan Patil */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="p-8 rounded-[32px] border border-slate-200/50 bg-gradient-to-br from-white to-slate-50/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col gap-6 text-left hover:-translate-y-1.5 hover:shadow-xl hover:border-emerald-400/30 transition-all duration-300 relative group"
                >
                  <div>
                    <span className="text-[9px] font-black uppercase text-emerald-600 tracking-widest px-2.5 py-1 rounded-md bg-emerald-500/5 border border-emerald-400/10">Security & Safety</span>
                    <h4 className="text-xl font-black text-navy-900 mt-4 leading-none">Roshan Patil</h4>
                    <p className="text-xs text-slate-500 font-semibold mt-1.5">Security Manager</p>
                  </div>
                  
                  <div className="flex flex-col gap-3.5 pt-4 border-t border-slate-200/50">
                    <a
                      href="tel:8657902808"
                      className="group/btn flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-200/50 bg-white hover:border-sky-300 hover:bg-sky-500/5 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-xl bg-sky-500/5 border border-sky-400/10 text-sky-600 flex items-center justify-center shrink-0 group-hover/btn:scale-110 transition-transform">
                        <Phone className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-sm font-bold text-navy-800 group-hover/btn:text-sky-600 transition-colors">8657902808</span>
                    </a>
                    
                    <a
                      href="mailto:roshan.patil@kohinoorcommercial2.in"
                      className="group/btn flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-200/50 bg-white hover:border-sky-300 hover:bg-sky-500/5 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-xl bg-sky-500/5 border border-sky-400/10 text-sky-600 flex items-center justify-center shrink-0 group-hover/btn:scale-110 transition-transform">
                        <Mail className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-sm font-bold text-navy-800 group-hover/btn:text-sky-600 transition-colors break-all">
                        roshan.patil@kohinoorcommercial2.in
                      </span>
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
