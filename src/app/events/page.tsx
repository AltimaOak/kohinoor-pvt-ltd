"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, ChevronLeft, ChevronRight, X, Star, Sparkles } from "lucide-react";
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
            className="relative w-full max-w-4xl bg-white border border-slate-200/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] my-auto animate-in fade-in-50 duration-200"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 md:bg-slate-100/80 backdrop-blur-sm text-slate-500 hover:text-navy-900 hover:bg-white md:hover:bg-slate-200 transition-all border border-slate-200/50 hover:scale-105 cursor-pointer shadow-sm"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left side: Images (58% width on desktop) */}
            <div className="w-full md:w-[58%] bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-between overflow-hidden relative shrink-0">
              {images.length > 0 ? (
                <>
                  {/* Main image viewer area with fixed responsive height */}
                  <div className="relative w-full h-auto aspect-[4/3] sm:h-[420px] md:h-[550px] bg-slate-100/50 flex items-center justify-center p-2 overflow-hidden border-b border-slate-100">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeImageIndex}
                        src={currentImage}
                        alt={`${event.title} - Full view`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="max-w-full max-h-full object-contain rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-200/50 bg-white select-none cursor-zoom-in hover:opacity-95 transition-opacity"
                        loading="lazy"
                        onClick={() => setIsLightboxOpen(true)}
                      />
                    </AnimatePresence>



                    {/* Image indicator in top right */}
                    {images.length > 1 && (
                      <span className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded-full bg-navy-950/65 backdrop-blur-xs text-white text-[10px] font-black tracking-wide select-none border border-white/10 shadow-sm">
                        {activeImageIndex + 1}/{images.length}
                      </span>
                    )}

                    {/* Navigation buttons */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 hover:bg-white/95 text-navy-900 flex items-center justify-center shadow-md hover:scale-105 transition-all z-20 cursor-pointer border border-slate-200/50 backdrop-blur-xs"
                          aria-label="Previous photo"
                        >
                          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 hover:bg-white/95 text-navy-900 flex items-center justify-center shadow-md hover:scale-105 transition-all z-20 cursor-pointer border border-slate-200/50 backdrop-blur-xs"
                          aria-label="Next photo"
                        >
                          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail gallery with recommended sizing */}
                  {images.length > 1 && (
                    <div className="w-full p-4 bg-white flex gap-3 overflow-x-auto justify-center shrink-0 border-t border-slate-100 scrollbar-none select-none">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-300 hover:scale-105 cursor-pointer shadow-sm
                            w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] md:w-[90px] md:h-[90px]
                            ${
                              idx === activeImageIndex
                                ? "border-sky-500 ring-2 ring-sky-500/20 scale-105"
                                : "border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100"
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

            {/* Right side: Information (42% width on desktop) */}
            <div className="w-full md:w-[42%] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[400px] md:max-h-none md:h-auto">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-sky-400/20 bg-sky-500/5 text-sky-700 text-[10px] font-bold uppercase tracking-wider">
                    <Icon className="w-3.5 h-3.5 text-sky-500" />
                    <span>Event Details</span>
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-navy-900 font-display leading-tight">
                  {event.title}
                </h2>

                <div className="h-px bg-slate-100 w-full my-1" />

                <div className="flex flex-col gap-5 mt-2">
                  {/* About This Event */}
                  <div className="flex flex-col gap-2">
                    <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5 font-display">
                      <Star className="w-4.5 h-4.5 text-sky-500 fill-sky-500/20 stroke-[2]" />
                      <span>About This Event</span>
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap pl-6">
                      {event.desc}
                    </p>
                  </div>

                  {/* Event Highlights */}
                  {event.highlights && event.highlights.length > 0 && (
                    <div className="flex flex-col gap-3 pt-2">
                      <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5 font-display">
                        <Sparkles className="w-4.5 h-4.5 text-sky-500 fill-sky-500/20 stroke-[2]" />
                        <span>Event Highlights</span>
                      </h4>
                      <div className="flex flex-wrap gap-2.5 pl-6">
                        {event.highlights.map((hl, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-900/15 bg-blue-50 text-blue-900 text-[11px] font-bold shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all"
                          >
                            <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-blue-900" />
                            {hl}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-8 pt-4 border-t border-slate-100">
                <button
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-md shadow-sky-500/10 hover:shadow-sky-500/20 hover:scale-[1.02] cursor-pointer"
                >
                  Close
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
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10 select-none bg-slate-900/30"
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
                className="rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group h-full cursor-pointer shadow-sm"
              >
                {/* Event Image Banner on Card */}
                {evt.imageSrc ? (
                  <div className="aspect-[16/10] w-full overflow-hidden relative border-b border-slate-100 bg-slate-50 shrink-0">
                    <img
                      src={evt.imageSrc}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/10] w-full overflow-hidden relative border-b border-slate-100 bg-gradient-to-br from-sky-50 to-indigo-50/30 flex items-center justify-center shrink-0">
                    <Icon className="w-10 h-10 text-sky-300 opacity-60" />
                  </div>
                )}

                <div className="p-5 sm:p-6 flex flex-col gap-4 flex-grow">
                  <div className="flex justify-between items-center">
                    <div className="w-9 h-9 rounded-lg bg-sky-500/5 border border-sky-400/10 text-sky-500 flex items-center justify-center shrink-0">
                      <Icon className="w-4.5 h-4.5 stroke-[2]" />
                    </div>
                    {evt.images && evt.images.length > 1 && (
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                        +{evt.images.length - 1} Photos
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-bold text-navy-900 leading-tight group-hover:text-sky-500 transition-colors">
                      {evt.title}
                    </h3>
                    <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-3">
                      {evt.desc}
                    </p>
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
