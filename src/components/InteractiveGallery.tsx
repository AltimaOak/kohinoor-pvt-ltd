"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, Sparkles, Building, Coffee, Layers, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

type GalleryItem = {
  id: string;
  title: string;
  category: "exterior" | "interior" | "lounge" | "amenities";
  categoryLabel: string;
  src: string;
  description: string;
};

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-ext-1",
    title: "Double Tower Horizon View",
    category: "exterior",
    categoryLabel: "Exterior",
    src: "/images/tower_exterior.png",
    description: "Sleek double-tower structures clad in double-glazed reflective energy glass under a glowing sky.",
  },
  {
    id: "gal-int-1",
    title: "Kohinoor Grand Atrium",
    category: "interior",
    categoryLabel: "Interior",
    src: "/images/lobby_entrance.png",
    description: "12-meter high triple-volume atrium featuring white marble finishes and fluid architectural lines.",
  },
  {
    id: "gal-lou-1",
    title: "Zenith Helipad & Sky Lounge",
    category: "lounge",
    categoryLabel: "Sky Lounge",
    src: "/images/sky_lounge.png",
    description: "Suspended outdoor lounge platform presenting 360-degree skyline vistas and aviation services.",
  },
  {
    id: "gal-int-2",
    title: "High-Tech Executive Offices",
    category: "interior",
    categoryLabel: "Interior",
    src: "/images/office_interior.png",
    description: "Ergonomic executive environments built with modular glass partitioners and integrated automation systems.",
  },
  {
    id: "gal-ame-1",
    title: "Oxygen Biophilic Gardens",
    category: "amenities",
    categoryLabel: "Amenities",
    src: "/images/amenities_gardens.png",
    description: "Lush tropical green walls and indoor cascades spanning the inter-tower connecting sky-bridge.",
  },
  {
    id: "gal-lou-2",
    title: "The Apex Michelin Observatory",
    category: "lounge",
    categoryLabel: "Sky Lounge",
    src: "/images/amenities_dining.png",
    description: "High-altitude fine dining and VIP social lounge overlooking the coastal district.",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Showcase", icon: Layers },
  { id: "exterior", label: "Architecture", icon: Building },
  { id: "interior", label: "Interiors", icon: Compass },
  { id: "lounge", label: "Sky Lounges", icon: Coffee },
  { id: "amenities", label: "Amenities", icon: Sparkles },
];

export default function InteractiveGallery() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredItems = GALLERY_ITEMS.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  return (
    <div className="w-full">
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "relative flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 focus:outline-none shadow-sm",
                isActive
                  ? "text-white"
                  : "bg-white/80 border border-slate-200/50 text-navy-800 hover:text-sky-500 hover:border-sky-300"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="galleryTabActive"
                  className="absolute inset-0 bg-navy-900 rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              <Icon className="w-3.5 h-3.5 relative z-10 shrink-0" />
              <span className="relative z-10">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group cursor-pointer relative overflow-hidden rounded-3xl border border-slate-200/50 bg-white shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500"
            >
              {/* Overlay Glass Highlights */}
              <div className="absolute top-4 left-4 z-10 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-white/40 text-[9px] font-extrabold uppercase tracking-widest text-sky-600 shadow-sm">
                {item.categoryLabel}
              </div>

              <div className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-md border border-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
                <Maximize2 className="w-3.5 h-3.5 text-navy-900" />
              </div>

              {/* Image Frame */}
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 relative">
                {/* Fallback stylized gradient card if image fails/loads */}
                <div className="absolute inset-0 bg-gradient-to-br from-sky-100 to-sky-200/40 flex items-center justify-center p-4">
                  <Building className="w-12 h-12 text-sky-300 opacity-40 animate-pulse" />
                </div>
                
                {/* Real Image */}
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover relative z-10 group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    // Hide broken image icon, display fallback
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              {/* Title Card */}
              <div className="p-5 relative bg-white flex flex-col gap-1 border-t border-slate-100">
                <h4 className="text-sm font-bold text-navy-900 group-hover:text-sky-500 transition-colors">
                  {item.title}
                </h4>
                <p className="text-slate-500 text-xs line-clamp-1">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-md p-6"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 30 }}
              className="relative w-full max-w-4xl bg-white border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[85vh] md:max-h-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-navy-900/60 hover:bg-sky-500 text-white backdrop-blur-md transition-colors border border-white/10"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              {/* Visual Side (Left) */}
              <div className="md:w-3/5 bg-slate-100 flex items-center justify-center overflow-hidden relative min-h-[250px] md:min-h-0">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center">
                  <Building className="w-16 h-16 text-sky-300 opacity-40" />
                </div>
                <img
                  src={selectedItem.src}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover relative z-10"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              {/* Text Side (Right) */}
              <div className="md:w-2/5 p-8 flex flex-col justify-between bg-white text-navy-900 overflow-y-auto">
                <div className="flex flex-col gap-4">
                  <span className="px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-[9px] font-extrabold uppercase tracking-widest text-sky-700 w-max">
                    {selectedItem.categoryLabel}
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-navy-900">
                    {selectedItem.title}
                  </h3>
                  <div className="h-px bg-slate-100 my-1" />
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100 text-xs text-slate-400">
                  <span className="font-bold text-sky-500">KOHINOOR</span>
                  <span>•</span>
                  <span>Premium Commercial Concept</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
