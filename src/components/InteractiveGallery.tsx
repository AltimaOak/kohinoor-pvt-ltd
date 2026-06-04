"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, Building } from "lucide-react";
import { getDb, PhotoItem } from "@/app/actions";

export default function InteractiveGallery() {
  const [galleryItems, setGalleryItems] = useState<PhotoItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PhotoItem | null>(null);

  useEffect(() => {
    async function loadPhotos() {
      try {
        const data = await getDb();
        setGalleryItems(data.photos);
      } catch (err) {
        console.error("Failed to load photos:", err);
      }
    }
    loadPhotos();
  }, []);

  return (
    <div className="w-full">
      {/* Gallery Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {galleryItems.map((item, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
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

                <div className="flex flex-col gap-1 pt-6 mt-6 border-t border-slate-100 text-[10px] text-slate-400">
                  <span className="font-extrabold text-sky-600">KOHINOOR CITY OFFICE TOWERS</span>
                  <span className="text-[8px] uppercase tracking-wide">INDUSTRIAL ESTATE & PREMISES CO-OP SOCIETY LTD. COMMERCIAL - II</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
