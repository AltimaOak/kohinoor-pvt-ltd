"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Compass,
  Sparkles,
  Droplet,
  Gift,
  Heart,
  Activity
} from "lucide-react";

const EVENTS = [
  {
    id: "evt-blood-donation",
    title: "Annual Corporate Blood Donation Drive",
    desc: "Partnering with the Red Cross Society to host a voluntary blood donation camp for all residents.",
    icon: Droplet,
  },
  {
    id: "evt-rangoli",
    title: "Grand Diwali Rangoli Competition",
    desc: "An inter-corporate artistic showdown celebrating the festival of lights with sustainable designs.",
    icon: Sparkles,
  },
  {
    id: "evt-independence",
    title: "Independence Day Cultural Gathering",
    desc: "Commemorating the national flag hoisting with cultural performances and community high-tea.",
    icon: Gift,
  },
  {
    id: "evt-yoga",
    title: "International Yoga Day Workshop",
    desc: "A revitalizing morning mindfulness and wellness session designed for working professionals.",
    icon: Heart,
  },
  {
    id: "evt-holi",
    title: "Eco-Friendly Holi Milan Celebration",
    desc: "Welcoming the festival of colors with dry organic colors, traditional music, and sweets.",
    icon: Activity,
  },
  {
    id: "evt-health",
    title: "Occupant Eye & General Health Checkup",
    desc: "A free diagnostic screening camp in partnership with local multi-specialty hospitals.",
    icon: Heart,
  },
  {
    id: "evt-plantation",
    title: "Green Canopy Monsoon Plantation",
    desc: "A collaborative tenant green drive planting native saplings around the business park.",
    icon: Compass,
  },
];

export default function EventsPage() {
  return (
    <div className="flex flex-col w-full pb-24 overflow-hidden">
      
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
            <Compass className="w-3.5 h-3.5 text-sky-400 animate-spin-slow" />
            <span>Community Events</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black font-display text-gradient-sky tracking-tight leading-[1.1]"
          >
            Community Gatherings & Cultural Events
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-sm md:text-base leading-relaxed"
          >
            Bringing our corporate community together. Join our regular festive celebrations, employee engagement contests, wellness workshops, and social care drives.
          </motion.p>
        </div>
      </section>

      {/* 2. EVENTS GRID */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EVENTS.map((evt, idx) => {
            const Icon = evt.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                key={evt.id}
                className="p-6 rounded-[28px] border border-slate-200/40 bg-white hover:border-sky-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 group shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
              >
                <div className="w-10.5 h-10.5 rounded-xl bg-sky-500/5 border border-sky-400/20 text-sky-500 flex items-center justify-center group-hover:scale-105 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 shrink-0">
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-bold text-navy-900 leading-tight group-hover:text-sky-500 transition-colors">
                    {evt.title}
                  </h3>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    {evt.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
