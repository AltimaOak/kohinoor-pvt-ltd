"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Flame, CheckCircle, HelpCircle, Compass, Zap, HelpCircle as HelpIcon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type FloorSection = {
  id: string;
  name: string;
  floors: string;
  occupancy: string;
  amenities: string[];
  description: string;
  color: string;
};

const ZENITH_SECTIONS: FloorSection[] = [
  {
    id: "zenith-helipad",
    name: "Zenith Helipad & Cloud Lounge",
    floors: "Levels 46 – 48",
    occupancy: "Exclusive Operational",
    amenities: ["Private Helipad", "VVIP Boardrooms", "Meteorological Radar"],
    description: "The crown of Tower Zenith, offering private transport options, executive aviation facilities, and unparalleled views of the skyline.",
    color: "from-sky-400 to-sky-600",
  },
  {
    id: "zenith-penthouses",
    name: "Executive Sky Suites",
    floors: "Levels 36 – 45",
    occupancy: "92% Leased",
    amenities: ["Double-Height Glass", "Premium Concierge", "Thermal Cladding"],
    description: "Luxurious, customized office environments for corporate headquarters. Features panoramic glazing and individual reception galleries.",
    color: "from-sky-300 to-sky-500",
  },
  {
    id: "zenith-bridge",
    name: "Inter-Tower Skybridge & Gardens",
    floors: "Levels 24 – 26",
    occupancy: "Social Commons",
    amenities: ["Suspended Walkway", "Oxygen Cafeterias", "Leisure Amphitheater"],
    description: "A monumental suspended glass skybridge connecting Zenith and Apex. Features lush vertical biophilic gardens and modular break spaces.",
    color: "from-teal-300 to-sky-400",
  },
  {
    id: "zenith-corporate",
    name: "Corporate Zenith Offices",
    floors: "Levels 10 – 23",
    occupancy: "85% Leased",
    amenities: ["Smart HVAC Control", "Sound Dampening", "Acoustic Partitions"],
    description: "Spacious, high-efficiency corporate plates. Open-concept spaces optimized for tech enterprises and banking headquarters.",
    color: "from-sky-200 to-sky-400",
  },
  {
    id: "zenith-podium",
    name: "Lobby & Premium Retail Arcade",
    floors: "Levels 1 – 9",
    occupancy: "100% Leased",
    amenities: ["24/7 Biometric Check", "Kohinoor Grand Lobby", "High-End Retail"],
    description: "A massive, light-filled, 12-meter high atrium welcoming global executives. Host to fine dining, financial centers, and VVIP lounges.",
    color: "from-sky-100 to-sky-300",
  },
];

const APEX_SECTIONS: FloorSection[] = [
  {
    id: "apex-lounge",
    name: "Apex Sky Lounge & Observation Deck",
    floors: "Levels 36 – 38",
    occupancy: "Club Members Only",
    amenities: ["Michelin dining", "Heated Sky Terrace", "Premium Observatory"],
    description: "The peak of Tower Apex. A world-class private social club, networking lounge, and fully glazed panoramic observatory.",
    color: "from-sky-400 to-sky-600",
  },
  {
    id: "apex-startup",
    name: "Apex Co-Working & Startup Incubators",
    floors: "Levels 25 – 35",
    occupancy: "78% Occupied",
    amenities: ["Fiber-optic redundancy", "Podcasting rooms", "Ergonomic furniture"],
    description: "Flexible, ultra-modern coworking zones tailored for emerging unicorns, high-growth teams, and fintech enterprises.",
    color: "from-sky-300 to-sky-500",
  },
  {
    id: "apex-bridge",
    name: "Inter-Tower Skybridge & Gardens",
    floors: "Levels 24 – 26",
    occupancy: "Social Commons",
    amenities: ["Suspended Walkway", "Oxygen Cafeterias", "Leisure Amphitheater"],
    description: "A monumental suspended glass skybridge connecting Zenith and Apex. Features lush vertical biophilic gardens and modular break spaces.",
    color: "from-teal-300 to-sky-400",
  },
  {
    id: "apex-tech",
    name: "Tech Innovation Hubs",
    floors: "Levels 6 – 23",
    occupancy: "80% Leased",
    amenities: ["Server racks", "Liquid cooling readiness", "Collaborative hubs"],
    description: "Advanced engineering environments with heavy server-infrastructure capabilities, advanced ventilation, and robust safety layers.",
    color: "from-sky-200 to-sky-400",
  },
  {
    id: "apex-lobby",
    name: "Apex Arrival & Exhibition Gallery",
    floors: "Levels 1 – 5",
    occupancy: "Exhibits & Parking",
    amenities: ["Art Exhibition Hall", "EV Fast Charging", "Premium Concierge"],
    description: "Featuring a high-ceilinged tech display center, premium parking connections, and direct link to the central courtyard.",
    color: "from-sky-100 to-sky-300",
  },
];

export default function TowerShowcase() {
  const [activeTower, setActiveTower] = useState<"zenith" | "apex">("zenith");
  const [hoveredSection, setHoveredSection] = useState<FloorSection | null>(
    activeTower === "zenith" ? ZENITH_SECTIONS[1] : APEX_SECTIONS[1]
  );

  const sections = activeTower === "zenith" ? ZENITH_SECTIONS : APEX_SECTIONS;

  const toggleTower = (tower: "zenith" | "apex") => {
    setActiveTower(tower);
    setHoveredSection(tower === "zenith" ? ZENITH_SECTIONS[1] : APEX_SECTIONS[1]);
  };

  return (
    <div className="w-full">
      {/* Tower Selector Controls */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex p-1.5 rounded-full bg-slate-100 border border-slate-200/50 shadow-sm relative">
          <button
            onClick={() => toggleTower("zenith")}
            className={cn(
              "relative px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none",
              activeTower === "zenith" ? "text-white shadow-md" : "text-navy-700 hover:text-sky-500"
            )}
          >
            {activeTower === "zenith" && (
              <motion.span
                layoutId="towerToggleBg"
                className="absolute inset-0 bg-navy-900 rounded-full"
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              Tower Zenith <span className="text-[10px] text-sky-400 font-semibold">(48 Floors)</span>
            </span>
          </button>
          
          <button
            onClick={() => toggleTower("apex")}
            className={cn(
              "relative px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none",
              activeTower === "apex" ? "text-white shadow-md" : "text-navy-700 hover:text-sky-500"
            )}
          >
            {activeTower === "apex" && (
              <motion.span
                layoutId="towerToggleBg"
                className="absolute inset-0 bg-navy-900 rounded-full"
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              Tower Apex <span className="text-[10px] text-sky-400 font-semibold">(38 Floors)</span>
            </span>
          </button>
        </div>
      </div>

      {/* Main Interactive Interactive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Side: 3D-feeling Interactive Tower Graphic (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-sm aspect-[1/1.5] flex items-center justify-center p-6 border border-slate-200/50 glass-card rounded-3xl overflow-hidden shadow-xl">
            {/* Glowing background matrix behind the tower */}
            <div className="absolute inset-0 bg-gradient-radial-sky opacity-60 pointer-events-none" />
            
            {/* Interactive Tower Slabs */}
            <div className="relative flex flex-col justify-between w-48 h-[80%] items-center z-10">
              {/* Decorative Peak Spire */}
              <div className="w-1.5 h-12 bg-gradient-to-t from-sky-400 to-sky-600 rounded-t-full shadow-lg shadow-sky-500/40 relative">
                <div className="absolute top-0 -left-0.5 w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
              </div>

              {/* Loop through Tower Sections in Reverse Order (Top to Bottom) */}
              {[...sections].map((sec, idx) => {
                const isHovered = hoveredSection?.id === sec.id;
                
                // Visual variables based on section height
                let heightClass = "h-[14%]";
                let widthClass = "w-36";
                if (idx === 0) { heightClass = "h-[10%]"; widthClass = "w-28"; } // Top / Helipad
                if (idx === 1) { heightClass = "h-[18%]"; widthClass = "w-32"; } // Executive
                if (idx === 2) { heightClass = "h-[12%]"; widthClass = "w-34"; } // Bridge (slightly wider/special)
                if (idx === 3) { heightClass = "h-[26%]"; widthClass = "w-36"; } // Corporate
                if (idx === 4) { heightClass = "h-[18%]"; widthClass = "w-40"; } // Lobby / Podium

                return (
                  <motion.div
                    key={sec.id}
                    onMouseEnter={() => setHoveredSection(sec)}
                    className={cn(
                      "relative rounded-xl border cursor-pointer flex flex-col justify-center items-center transition-all duration-300 overflow-hidden shadow-inner",
                      heightClass,
                      widthClass,
                      isHovered 
                        ? "border-sky-400 bg-gradient-to-br from-sky-400/20 to-sky-500/25 shadow-lg shadow-sky-400/20 scale-[1.03]" 
                        : "border-white bg-white/40 hover:bg-white/60"
                    )}
                    style={{
                      boxShadow: isHovered ? "0 0 20px rgba(56, 189, 248, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.4)" : "inset 0 0 8px rgba(255,255,255,0.4)"
                    }}
                    whileHover={{ scale: 1.03 }}
                  >
                    {/* Glowing side neon strip */}
                    <div className={cn(
                      "absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b transition-all duration-300",
                      isHovered ? "from-sky-400 to-sky-600 opacity-100" : "from-slate-300 to-slate-400 opacity-40"
                    )} />

                    {/* Faux architectural window grids inside tower */}
                    <div className="absolute inset-0 grid grid-cols-6 gap-[2px] p-2 opacity-15 pointer-events-none">
                      {[...Array(24)].map((_, i) => (
                        <div key={i} className="bg-slate-700 rounded-[1px]" />
                      ))}
                    </div>

                    {/* Section Short Name */}
                    <span className={cn(
                      "text-[9px] uppercase tracking-widest font-extrabold text-center relative z-10 px-1",
                      isHovered ? "text-sky-700" : "text-navy-800"
                    )}>
                      {sec.name.split(" ")[0]}
                    </span>
                    <span className="text-[7px] text-slate-500 tracking-wide mt-0.5 relative z-10">
                      {sec.floors.split(" ")[1] ? sec.floors.split(" ")[1] + "-" + sec.floors.split(" ")[3] : sec.floors}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Floor Panel Stats (7 Columns) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {hoveredSection && (
              <motion.div
                key={hoveredSection.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-card border border-white/60 p-8 rounded-3xl shadow-xl flex flex-col gap-6"
              >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200/50 pb-5">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-sky-600 font-bold uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-sky-400" />
                      Section Highlight
                    </span>
                    <h3 className="text-xl font-bold tracking-tight text-navy-900 mt-1">
                      {hoveredSection.name}
                    </h3>
                  </div>
                  <div className="px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-[10px] font-bold uppercase tracking-wider text-sky-700 shrink-0 self-start md:self-center">
                    {hoveredSection.floors}
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-600 text-sm leading-relaxed">
                  {hoveredSection.description}
                </p>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">Occupancy Rate</span>
                    <span className="text-sm font-bold text-navy-800 mt-1 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-sky-500" />
                      {hoveredSection.occupancy}
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">Towers Link</span>
                    <span className="text-sm font-bold text-navy-800 mt-1 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-sky-500" />
                      {activeTower === "zenith" ? "Zenith (East Tower)" : "Apex (West Tower)"}
                    </span>
                  </div>
                </div>

                {/* Amenities List */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    Key Infrastructure Features
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {hoveredSection.amenities.map((amenity, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200/50 shadow-sm text-xs text-slate-700 hover:border-sky-300 transition-colors"
                      >
                        <Zap className="w-3 h-3 text-sky-400" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Quick Specifications */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: "Tower Height", val: activeTower === "zenith" ? "198 Meters" : "154 Meters" },
              { label: "High-speed Elevators", val: activeTower === "zenith" ? "18 (Double-Deck)" : "12 (Single-Deck)" },
              { label: "Green Certification", val: "LEED Platinum" },
              { label: "Smart HVAC", val: "Triple-redundant" },
            ].map((stat, i) => (
              <div key={i} className="p-4 border border-slate-200/40 bg-white/50 rounded-2xl flex flex-col shadow-sm">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">{stat.label}</span>
                <span className="text-xs font-bold text-navy-900 mt-1">{stat.val}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
