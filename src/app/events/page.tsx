"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Compass,
  ArrowRight,
  Sparkles,
  Users,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import EventCountdown from "@/components/EventCountdown";
import RsvpModal from "@/components/RsvpModal";

type EventItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  desc: string;
  slotsLeft: number;
};

const EVENTS: EventItem[] = [
  {
    id: "evt-summit",
    title: "Kohinoor Annual Business & Tech Summit",
    category: "Corporate Keynote",
    date: "October 12, 2026",
    time: "09:00 AM – 04:00 PM EST",
    location: "Tower Zenith, Grand Lobby Atrium",
    desc: "A massive confluence of tech founders, VCs, and commercial real-estate leaders. Featuring talks on AI operational models and enterprise scalability.",
    slotsLeft: 18,
  },
  {
    id: "evt-fintech",
    title: "Fintech Innovation Panel & Mixer",
    category: "Technology panel",
    date: "November 05, 2026",
    time: "06:00 PM – 09:00 PM EST",
    location: "Tower Apex, Level 28 Incubator Hub",
    desc: "Discussing the decentralization of institutional banking frameworks. Hosting local blockchain innovators, startup nodes, and angel backers.",
    slotsLeft: 34,
  },
  {
    id: "evt-esg",
    title: "Biophilic Architecture & ESG Seminar",
    category: "Sustainability",
    date: "November 23, 2026",
    time: "02:00 PM – 05:00 PM EST",
    location: "Inter-Tower Skybridge, Level 24 Gardens",
    desc: "Inspecting the environmental parameters that compose modern sustainable skyscrapers. Reviewing LEED Platinum checklists and thermal dynamics.",
    slotsLeft: 12,
  },
  {
    id: "evt-executive",
    title: "VVIP Venture Capital Roundtable",
    category: "VVIP Closed Boardroom",
    date: "December 10, 2026",
    time: "10:00 AM – 01:00 PM EST",
    location: "Tower Zenith, Level 47 Executive Suites",
    desc: "A private, closed-door boardroom seminar connecting institutional venture heads with commercial operators. Invitation-only requirements apply.",
    slotsLeft: 5,
  },
];

export default function EventsPage() {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [selectedEventName, setSelectedEventName] = useState("");

  const triggerRsvp = (eventName: string) => {
    setSelectedEventName(eventName);
    setRsvpOpen(true);
  };

  return (
    <div className="flex flex-col w-full pb-20 overflow-hidden">
      
      {/* 1. HEADER PAGE BANNER */}
      <section className="relative pt-20 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full">
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
            Business Summits & Strategic Mixers
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-sm md:text-base leading-relaxed"
          >
            Empowering tenants and industry partners with premium networking environments. Host to closed roundtables, tech panels, and wellness mix events.
          </motion.p>
        </div>
      </section>

      {/* 2. EVENT COUNTDOWN ELEMENT */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 w-full mb-16 relative z-10">
        <EventCountdown />
      </section>

      {/* 3. UPCOMING EVENTS GRID */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col gap-12 relative z-10">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-widest flex items-center gap-1">
            <Users className="w-4 h-4 text-sky-400" />
            Agenda Listings
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-navy-900 font-display">
            Upcoming Commercial Summits
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {EVENTS.map((evt, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              key={evt.id}
              className="p-8 rounded-3xl border border-slate-200/50 bg-white hover:border-sky-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between gap-6 group"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-[9px] font-extrabold uppercase tracking-widest text-sky-700">
                    {evt.category}
                  </span>
                  
                  <span className="text-[10px] text-orange-600 font-bold bg-orange-50 border border-orange-200/40 px-2.5 py-1 rounded-full">
                    Only {evt.slotsLeft} seats left
                  </span>
                </div>

                <h3 className="text-md font-bold text-navy-900 leading-tight group-hover:text-sky-500 transition-colors mt-2">
                  {evt.title}
                </h3>

                <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                  {evt.desc}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-500 text-[10px] font-semibold border-t border-slate-100 pt-4 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span>{evt.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span className="truncate">{evt.time.split(" – ")[0]}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span className="truncate">{evt.location.split(", ")[1]}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100/50">
                <span className="text-[10px] text-slate-400">
                  Venue: {evt.location.split(", ")[0]}
                </span>
                
                <button
                  onClick={() => triggerRsvp(evt.title)}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-navy-900 hover:bg-sky-500 text-white font-bold text-[10px] uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                >
                  <span>Reserve Seat</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. PAST EVENTS HIGHLIGHTS GALLERY */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col gap-12 relative z-10">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-widest flex items-center gap-1">
            <Award className="w-4 h-4 text-sky-400" />
            Corporate Legacy
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-navy-900 font-display">
            Past Landmark Gatherings
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Institutional Groundbreak Gala (2025)",
              desc: "A structural celebration gathering local planners, engineers, and financial stakeholders to toast the finalization of cladding works.",
            },
            {
              title: "Future Cities Green Skyscraper Forum",
              desc: "Host to the regional green skyscraper coalition. Disseminating research on double-glazed smart glass facades and biophilic oxygen levels.",
            },
            {
              title: "Unicorn Pitch Night & Angel Meetup",
              desc: "Connecting 12 early-stage startups inside Tower Apex with high-net venture partners. Sparking total funding deals over $15M.",
            }
          ].map((pastEvt, idx) => (
            <div key={idx} className="p-6 rounded-3xl border border-slate-200/30 bg-white/50 flex flex-col gap-3 shadow-sm">
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-extrabold">Completed Gathering</span>
              <h4 className="text-xs font-bold text-navy-900 mt-1">{pastEvt.title}</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed">{pastEvt.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE REGISTRATION RSVP MODAL */}
      <RsvpModal
        isOpen={rsvpOpen}
        onClose={() => setRsvpOpen(false)}
        eventName={selectedEventName}
      />

    </div>
  );
}
