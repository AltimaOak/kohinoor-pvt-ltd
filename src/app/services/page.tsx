"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Compass,
  Shield,
  Cpu,
  Video,
  ArrowUpDown,
  Lock,
  Car,
  Zap,
  BatteryCharging,
  Flame
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { getDb, ServiceItem } from "@/app/actions";

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await getDb();
        setServices(data.services);
      } catch (err) {
        console.error("Failed to load services:", err);
      }
    }
    loadServices();
  }, []);

  return (
    <div className="flex flex-col w-full pb-20 overflow-hidden">
      
      {/* 1. HEADER SECTION */}
      <section className="relative pt-24 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.08),transparent_60%)]">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-10 w-96 h-96 rounded-full bg-sky-200/10 blur-[80px] pointer-events-none" />

        <div className="max-w-3xl flex flex-col gap-5 text-left relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-400/20 bg-sky-500/5 text-sky-700 text-[10px] font-bold w-max uppercase tracking-wider"
          >
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>Healthcare & Emergency</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black font-display text-gradient-sky tracking-tight leading-[1.1]"
          >
            Medical & Emergency Services
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-sm md:text-base leading-relaxed"
          >
            Explore our on-site medical facilities, standby ambulance logistics, and bi-weekly wellness camps coordinated to support the health of all occupants.
          </motion.p>
        </div>
      </section>

      {/* 2. SERVICES GRID */}
      <section className="max-w-5xl mx-auto px-6 md:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {services.map((svc, index) => {
            const Icon = (LucideIcons as any)[svc.iconName] || LucideIcons.HelpCircle;

            return (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                className="bg-white border border-slate-200/50 rounded-[32px] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-xl hover:border-sky-300 transition-all duration-500 relative overflow-hidden group hover:-translate-y-1.5"
              >
                {/* Glow Ambient behind card */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10",
                  svc.glowColor
                )} />

                <div className="flex flex-col gap-8 h-full justify-between">
                  <div className="flex flex-col gap-6">
                    {/* Icon Wrapper */}
                    <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-400/20 text-sky-500 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white shrink-0">
                      <Icon className="w-7 h-7 stroke-[2]" />
                    </div>

                    <div className="flex flex-col gap-3">
                      <h3 className="text-xl font-extrabold text-navy-900 tracking-tight">
                        {svc.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {svc.longDesc}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="h-px bg-slate-100 w-full" />

                    {/* Features checklist */}
                    <div className="flex flex-col gap-4">
                      <span className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">
                        Key Features & Support
                      </span>
                      <ul className="flex flex-col gap-3">
                        {svc.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-sky-500/10 border border-sky-400/20 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-sky-600 stroke-[2.5]" />
                            </div>
                            <span className="text-xs font-semibold text-slate-700 leading-tight">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. CORE AMENITIES GRID */}
      <section className="py-28 md:py-32 border-y border-slate-200/50 bg-[#F8FAFC] relative z-10 mt-12 w-full">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-16 w-full">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Utility & Security Grids</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-navy-900 font-display">
              Core Building Amenities
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Equipped with modern safety control checkpoints, automated energy feeds, and state-of-the-art building management networks.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[
              { label: "24x7 Security", icon: Shield, desc: "Continuous perimeter patrol and biometric checks" },
              { label: "BMS", icon: Cpu, desc: "Building Management System smart telemetry" },
              { label: "CCTV", icon: Video, desc: "High-definition security surveillance networks" },
              { label: "Lift", icon: ArrowUpDown, desc: "High-speed corporate passenger elevators" },
              { label: "Boom Barriers", icon: Lock, desc: "Automated RFID vehicular gate control systems" },
              { label: "Visitors Parking", icon: Car, desc: "Dedicated subterranean guest parking decks" },
              { label: "Power", icon: Zap, desc: "Dual grid feeds for consistent electricity" },
              { label: "Power Backup", icon: BatteryCharging, desc: "Heavy generator backup activation in 0.4s" },
              { label: "Fire Fighting Equipment", icon: Flame, desc: "Advanced localized sprinkler & detector grids" },
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="p-6 rounded-[28px] border border-slate-200/40 bg-white hover:border-sky-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-350 flex flex-col items-center text-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/5 border border-sky-400/10 text-sky-500 flex items-center justify-center group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 shrink-0">
                    <IconComp className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-sm font-bold text-navy-900 group-hover:text-sky-500 transition-colors">{item.label}</h4>
                    <p className="text-[10px] text-slate-500 leading-normal">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
