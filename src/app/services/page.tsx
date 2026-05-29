"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  Plane,
  Coffee,
  Sparkles,
  Airplay,
  Leaf,
  Monitor,
  Check,
  Building2,
  Compass
} from "lucide-react";
import { cn } from "@/lib/utils";

type ServiceItem = {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  shortDesc: string;
  longDesc: string;
  features: string[];
  glowColor: string;
};

const SERVICES: ServiceItem[] = [
  {
    id: "svc-sec",
    title: "Biometric Border Security",
    icon: ShieldCheck,
    shortDesc: "24/7 double-encrypted biometrics, thermal surveillance, and intelligent turnstiles.",
    longDesc: "Host to global headquarters, security remains absolute. Both towers Zenith and Apex feature custom biometric turnstiles, thermal analytics, VIP facial recognition access, and triple-redundant local surveillance rooms.",
    features: ["Biometric Facial Scanning", "VVIP Private Access Elevators", "Intruder Analytics AI"],
    glowColor: "from-sky-500/20 to-sky-600/30",
  },
  {
    id: "svc-pow",
    title: "Triple-Redundant Power & Net",
    icon: Zap,
    shortDesc: "Dual grid feeds, localized server vault blocks, and heavy battery networks.",
    longDesc: "Ensuring zero downtime. Equipped with triple-redundant solar capture panel networks, double-grid main power connections, and on-site subterranean generators ensuring full operational backups in 0.4 seconds.",
    features: ["Double Power Grid Feeds", "Underground Fiber Ring", "0.4s Generator Handshake"],
    glowColor: "from-sky-400/20 to-sky-500/30",
  },
  {
    id: "svc-avi",
    title: "Peak VVIP Aviation",
    icon: Plane,
    shortDesc: "Tower Zenith rooftop helicopter decks, flight coordinating, and sky lounge links.",
    longDesc: "Skip the highway traffic. Tower Zenith's peak hosts a heavy-rated double helipad deck built for twin-engine executive helicopters. Direct VVIP secure lift leads straight into penthouses and the Grand Atrium.",
    features: ["Double Helipad Decks", "Corporate Pilot Rest Suites", "Dedicated Flight Dispatchers"],
    glowColor: "from-teal-400/20 to-sky-500/30",
  },
  {
    id: "svc-din",
    title: "Michelin Dining & Clubs",
    icon: Coffee,
    shortDesc: "High-altitude members-only dining, observation lounges, and VIP catering.",
    longDesc: "Cater to top executives and corporate partners. Offering members-only access to Michelin-starred dining outlets, glass-walled observation sky gardens, and dedicated catering services for executive boardrooms.",
    features: ["Michelin-Starred Outlets", "Observation Deck Access", "Boardroom Silver Service"],
    glowColor: "from-sky-300/20 to-sky-400/30",
  },
  {
    id: "svc-con",
    title: "Premium Concierge & Valet",
    icon: Sparkles,
    shortDesc: "Executive reception support, EV fast charging, and secure VVIP underground parking.",
    longDesc: "From arrival to exit, hospitality is seamless. The subterranean level connects 6 floors of secure executive parking, EV supercharging docks, and automated valet delivery systems managed by our lobby concierges.",
    features: ["Executive Subterranean Valet", "EV Superchargers", "Personalized Reception Services"],
    glowColor: "from-sky-200/20 to-sky-300/30",
  },
  {
    id: "svc-aut",
    title: "Unified Tenant Automation",
    icon: Airplay,
    shortDesc: "Localized climate control, motorized blinds, and automatic smart lighting profiles.",
    longDesc: "Control your corporate environment completely. Floor plates feature integrated smart hubs allowing facilities managers to customize thermodynamic envelopes, solar tracking motorized louvers, and lighting profile schedules.",
    features: ["Solar-Tracking Louvers", "Localized Thermal Envelopes", "Smart Facility Dashboards"],
    glowColor: "from-sky-500/10 to-sky-400/25",
  },
  {
    id: "svc-hvac",
    title: "LEED Bio-Air HVAC Filtration",
    icon: Leaf,
    shortDesc: "Advanced HEPA filtration, CO2 monitoring, and biophilic oxygen gardens.",
    longDesc: "Prioritizing wellness. The complex air cycles through high-efficiency HEPA-14 scrubbers every 8 minutes. Coupled with CO2 indoor indicators and active indoor biophilic gardens, workplace productivity is elevated.",
    features: ["HEPA-14 Particle Scrubbers", "Real-Time CO2 Indoor Monitoring", "Biophilic Oxygen Bridges"],
    glowColor: "from-teal-500/15 to-sky-400/20",
  },
  {
    id: "svc-media",
    title: "Ultra-Conferencing Suites",
    icon: Monitor,
    shortDesc: "Glazed modular boardrooms, high-definition teleconference walls, and soundproofing.",
    longDesc: "Communicate with global branches effortlessly. Fully furnished executive boardrooms with acoustic soundproofing, automated projection screens, surround telepresence, and localized buffet servers.",
    features: ["Acoustic Soundproofing", "4K Telepresence Walls", "Glazed Modular Partitions"],
    glowColor: "from-sky-400/15 to-sky-300/20",
  },
];

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(SERVICES[0]);

  return (
    <div className="flex flex-col w-full pb-20 overflow-hidden">
      
      {/* 1. HEADER SECTION */}
      <section className="relative pt-20 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-10 w-96 h-96 rounded-full bg-sky-200/10 blur-[80px] pointer-events-none" />

        <div className="max-w-3xl flex flex-col gap-5 text-left relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-400/20 bg-sky-500/5 text-sky-700 text-[10px] font-bold w-max uppercase tracking-wider"
          >
            <Compass className="w-3.5 h-3.5 text-sky-400 animate-spin-slow" />
            <span>Operational Capabilities</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black font-display text-gradient-sky tracking-tight leading-[1.1]"
          >
            Futuristic Commercial Infrastructure & Services
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-sm md:text-base leading-relaxed"
          >
            Explore our state-of-the-art building amenities and operational support systems. Engineered to secure, power, and coordinate premier enterprises.
          </motion.p>
        </div>
      </section>

      {/* 2. SERVICES INTERACTIVE GRID */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start w-full relative z-10">
        
        {/* Left Side: Services Card Grid (7 Columns) */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((svc) => {
            const Icon = svc.icon;
            const isSelected = selectedService?.id === svc.id;

            return (
              <motion.div
                key={svc.id}
                onClick={() => setSelectedService(svc)}
                className={cn(
                  "cursor-pointer p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden group shadow-sm hover:shadow-md",
                  isSelected
                    ? "border-sky-500 bg-sky-500/5 scale-[1.02]"
                    : "border-slate-200/50 bg-white hover:border-sky-300 hover:scale-[1.01]"
                )}
                whileHover={{ scale: isSelected ? 1.02 : 1.01 }}
              >
                {/* Glow Ambient behind card */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10",
                  svc.glowColor
                )} />

                <div className="flex flex-col gap-4">
                  {/* Icon Wrapper */}
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0",
                    isSelected
                      ? "bg-sky-500 text-white"
                      : "bg-sky-500/5 border border-sky-400/20 text-sky-500 group-hover:bg-sky-500 group-hover:text-white"
                  )}>
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>

                  <h3 className="text-sm font-bold text-navy-900">
                    {svc.title}
                  </h3>
                  
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    {svc.shortDesc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Side: High-Fidelity Details Panel (5 Columns) */}
        <div className="lg:col-span-5 sticky top-24">
          <AnimatePresence mode="wait">
            {selectedService && (
              <motion.div
                key={selectedService.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="glass-card border border-white/60 p-8 rounded-3xl shadow-xl flex flex-col gap-6"
              >
                {/* Icon & Title */}
                <div className="flex items-center gap-4 border-b border-slate-200/50 pb-5">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/20">
                    {React.createElement(selectedService.icon, { className: "w-6 h-6 stroke-[2]" })}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-widest text-sky-600 font-extrabold">Active Highlight</span>
                    <h3 className="text-md font-extrabold text-navy-900 mt-0.5">
                      {selectedService.title}
                    </h3>
                  </div>
                </div>

                {/* Long Description */}
                <p className="text-slate-600 text-xs leading-relaxed">
                  {selectedService.longDesc}
                </p>

                {/* Specific features checklist */}
                <div className="flex flex-col gap-3">
                  <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                    Technical Specifications
                  </span>
                  <ul className="flex flex-col gap-2.5 text-xs text-slate-700">
                    {selectedService.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-sky-500/10 border border-sky-400/20 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-sky-600 stroke-[2.5]" />
                        </div>
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="h-px bg-slate-100 my-1" />

                {/* Operational tag */}
                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                  <span className="font-bold text-sky-500 uppercase tracking-wider">Operational Integrity</span>
                  <span>•</span>
                  <span>Fully Managed System</span>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </section>

    </div>
  );
}
