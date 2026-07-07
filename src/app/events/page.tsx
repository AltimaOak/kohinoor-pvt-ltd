"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, ChevronLeft, ChevronRight, X, Star, Sparkles, Users } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { getDb, EventItem } from "@/app/actions";

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | null;
}

function EventDetailModal({ isOpen, onClose, event }: EventDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Reset active image index and lightbox when event changes
  useEffect(() => {
    setActiveImageIndex(0);
    setIsLightboxOpen(false);
  }, [event, isOpen]);

  const images = event?.images && event.images.length > 0
    ? event.images
    : event?.imageSrc
      ? [event.imageSrc]
      : [];

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length > 0) {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length > 0) {
      setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // Keyboard navigation for Left and Right arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || images.length <= 1) return;
      if (e.key === "ArrowRight") {
        nextImage();
      } else if (e.key === "ArrowLeft") {
        prevImage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, images.length]);

  if (!event) return null;

  const Icon = (LucideIcons as any)[event.iconName] || LucideIcons.HelpCircle;
  const currentImage = images[activeImageIndex];

  return (
    <>
      <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-md overflow-y-auto flex justify-center items-center p-4 sm:p-6 md:p-10"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] my-auto animate-in fade-in-50 duration-200"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white text-slate-400 hover:text-slate-900 border border-slate-200/60 shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-center group"
              aria-label="Close modal"
            >
              <X className="w-4.5 h-4.5 transition-transform duration-300 group-hover:rotate-90" />
            </button>

            {/* Left side: Images (56% width on desktop) */}
            <div className="w-full md:w-[56%] bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-between overflow-hidden relative shrink-0">
              {images.length > 0 ? (
                <>
                  {/* Main image viewer area with fixed responsive height */}
                  <div className="relative w-full h-auto aspect-[4/3] sm:h-[420px] md:h-[550px] bg-slate-100/50 flex items-center justify-center p-4 overflow-hidden border-b border-slate-100">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeImageIndex}
                        src={currentImage}
                        alt={`${event.title} - Full view`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-xs hover:shadow-sm border border-[#ECECEC] bg-white select-none cursor-zoom-in transition-all duration-300"
                        loading="lazy"
                        onClick={() => setIsLightboxOpen(true)}
                      />
                    </AnimatePresence>

                    {/* Image indicator in top right */}
                    {images.length > 1 && (
                      <span className="absolute top-6 right-6 z-20 px-2.5 py-1 rounded-full bg-navy-950/65 backdrop-blur-xs text-white text-[10px] font-black tracking-wide select-none border border-white/10 shadow-sm">
                        {activeImageIndex + 1}/{images.length}
                      </span>
                    )}

                    {/* Navigation buttons */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 hover:bg-white/95 text-navy-900 flex items-center justify-center shadow-md hover:scale-105 transition-all z-20 cursor-pointer border border-slate-200/50 backdrop-blur-xs"
                          aria-label="Previous photo"
                        >
                          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 hover:bg-white/95 text-navy-900 flex items-center justify-center shadow-md hover:scale-105 transition-all z-20 cursor-pointer border border-slate-200/50 backdrop-blur-xs"
                          aria-label="Next photo"
                        >
                          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail gallery with recommended sizing */}
                  {images.length > 1 && (
                    <div className="w-full p-3 bg-white flex gap-3.5 overflow-x-auto justify-center shrink-0 border-t border-slate-100 scrollbar-none select-none">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative rounded-lg overflow-hidden shrink-0 border border-[#ECECEC] transition-all duration-300 hover:scale-105 cursor-pointer shadow-xs
                            w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[90px] md:h-[90px]
                            ${
                              idx === activeImageIndex
                                ? "border-sky-500 ring-2 ring-sky-500/20 scale-105"
                                : "hover:border-slate-400 opacity-80 hover:opacity-100"
                            }`}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* Placeholder gradient with fixed responsive heights */
                <div className="w-full h-auto aspect-[4/3] sm:h-[420px] md:h-[550px] bg-gradient-to-br from-slate-900 to-navy-950 flex flex-col items-center justify-center gap-4 p-8 text-center relative shrink-0">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.4),transparent_70%)]" />
                  <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-400/20 text-sky-400 flex items-center justify-center shadow-inner relative z-10">
                    <Icon className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <div className="flex flex-col gap-1 relative z-10">
                    <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">Kohinoor Events</span>
                    <p className="text-slate-400 text-xs max-w-[200px]">No event photos uploaded yet</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right side: Information (44% width on desktop) */}
            <div className="w-full md:w-[44%] p-5 sm:p-6 flex flex-col justify-between overflow-y-auto max-h-[400px] md:max-h-none md:h-auto gap-4">
              <div className="flex flex-col gap-3">
                {/* Event Badge */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[10px] border border-sky-100 bg-sky-50 text-sky-700 text-[10px] font-semibold uppercase tracking-wider">
                    <Icon className="w-3.5 h-3.5 text-sky-500" />
                    <span>Event Details</span>
                  </span>
                </div>

                {/* Event Title */}
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {event.title}
                </h2>

                <div className="h-px bg-[#F1F5F9] w-full my-0.5" />

                <div className="flex flex-col gap-4 mt-1.5">
                  {/* About This Event */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-sky-500 fill-sky-500/10 stroke-[2]" />
                      <span>About This Event</span>
                    </h4>
                    <p className="text-slate-700 text-sm leading-[1.7] whitespace-pre-wrap max-w-[42ch]">
                      {event.desc}
                    </p>
                  </div>

                  {/* Event Highlights */}
                  {event.highlights && event.highlights.length > 0 && (
                    <div className="flex flex-col gap-2 pt-1 text-left">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-sky-500 fill-sky-500/10 stroke-[2]" />
                        <span>Event Highlights</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {event.highlights.map((hl, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[10px] border border-slate-150 bg-white text-slate-700 text-[11px] font-medium transition-all hover:border-slate-350 shadow-xs"
                          >
                            <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-sky-500" />
                            {hl}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button CTA */}
              <div className="flex gap-3 mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white text-xs font-semibold transition-all shadow-md shadow-sky-500/10 hover:shadow-sky-500/25 active:scale-[0.99] group cursor-pointer"
                >
                  <span>Close</span>
                  <ChevronRight className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

      {/* Full-screen Lightbox Overlay Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm p-4 sm:p-8"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 z-[110] p-3 rounded-full bg-white/10 hover:bg-white/25 text-white hover:scale-105 transition-all cursor-pointer border border-white/10"
              aria-label="Close fullscreen view"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Main Lightbox Image Container */}
            <div className="relative max-w-7xl max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <motion.img
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 28, stiffness: 220 }}
                src={currentImage}
                alt={`${event.title} - Fullscreen view`}
                className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-lg border border-white/10 select-none bg-slate-900/30"
              />

              {/* Navigation buttons inside lightbox */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute -left-4 sm:-left-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all z-20 cursor-pointer border border-white/10"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute -right-4 sm:-right-16 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all z-20 cursor-pointer border border-white/10"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-6 h-6 stroke-[2.5]" />
                  </button>
                </>
              )}
            </div>

            {/* Title / Indicator Label */}
            <div className="mt-4 text-center text-white/80 text-xs font-bold font-display select-none">
              {event.title} ({activeImageIndex + 1}/{images.length})
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function EventCarousel({ images, title }: { images: string[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 relative group border-b border-slate-100">
      {/* Slide Image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${title} - Photo ${currentIndex + 1}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </AnimatePresence>

      {/* Navigation Arrows (Only show if multiple images exist) */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-navy-905 border border-slate-200/50 shadow-sm flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 z-10 hover:scale-105 cursor-pointer"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-4.5 h-4.5 stroke-[2.5]" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-navy-905 border border-slate-200/50 shadow-sm flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 z-10 hover:scale-105 cursor-pointer"
            aria-label="Next photo"
          >
            <ChevronRight className="w-4.5 h-4.5 stroke-[2.5]" />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex ? "bg-sky-500 w-3" : "bg-white/60"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getDb();
        setEvents(data.events);
      } catch (err) {
        console.error("Failed to load events:", err);
      }
    }
    loadEvents();
  }, []);

  return (
    <div className="flex flex-col w-full pb-8 overflow-hidden">
      
      {/* 1. HEADER PAGE BANNER */}
      <section className="relative pt-10 pb-6 px-6 md:px-12 max-w-7xl mx-auto w-full bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.08),transparent_60%)] z-10">
        <div className="absolute top-0 right-10 w-96 h-96 rounded-full bg-sky-200/5 blur-[80px] pointer-events-none" />

        <div className="max-w-3xl flex flex-col gap-4 text-left relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 text-[#0055d4] text-[10px] font-bold uppercase tracking-wider select-none"
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>COMMUNITY EVENTS</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]"
          >
            Community Gatherings & <br className="hidden sm:inline" />
            <span className="text-[#0055d4]">Cultural Events</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-505 text-sm md:text-base leading-relaxed max-w-2xl"
          >
            Bringing our corporate community together. Join our regular festive celebrations, employee engagement initiatives, and cultural events.
          </motion.p>
        </div>
      </section>

      {/* 2. EVENTS GRID */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10 -mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((evt, idx) => {
            const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[evt.iconName] || LucideIcons.HelpCircle;
            return (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                key={evt.id}
                onClick={() => setSelectedEvent(evt)}
                className="rounded-2xl border border-slate-200/80 bg-white hover:border-sky-300 hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-300 flex flex-col overflow-hidden group h-full cursor-pointer shadow-sm"
              >
                {/* Event Image Banner on Card */}
                {evt.imageSrc ? (
                  <div className="aspect-[16/10] w-full overflow-hidden relative border-b border-slate-100 bg-slate-50 shrink-0">
                    <img
                      src={evt.imageSrc}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ) : (
                  <div className="aspect-[16/10] w-full overflow-hidden relative border-b border-slate-100 bg-gradient-to-br from-sky-50 to-indigo-50/30 flex items-center justify-center shrink-0">
                    <Icon className="w-12 h-12 text-sky-400 opacity-50 group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-sky-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}

                <div className="p-5 flex flex-col gap-3 flex-grow relative bg-white">
                  <div className="flex justify-between items-center">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0 shadow-sm">
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                    {evt.images && evt.images.length > 1 && (
                      <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                        +{evt.images.length - 1} Photos
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-1">
                    <h3 className="text-base font-bold text-slate-900 leading-tight group-hover:text-sky-600 transition-colors">
                      {evt.title}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                      {evt.desc}
                    </p>
                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/80 flex justify-between items-center group-hover:bg-sky-50/50 transition-colors">
                  <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Explore Event</span>
                  <div className="w-6 h-6 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center group-hover:border-sky-300 transition-colors">
                    <LucideIcons.ArrowRight className="w-3 h-3 text-sky-600 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Event Details Modal */}
      <EventDetailModal
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
      />

    </div>
  );
}
