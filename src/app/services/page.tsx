"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
  Flame,
  Sparkles,
  Ticket,
  Clock,
  CalendarRange,
  PhoneCall,
  MessageSquare,
  QrCode,
  Leaf,
  ShoppingBag,
  Info,
  MapPin,
  Calendar,
  X,
  AlertCircle,
  Loader2
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { getDb, ServiceItem, DoctorItem, buyPlantAction, NurserySchema, PlantItem } from "@/app/actions";
import AppointmentModal from "@/components/AppointmentModal";

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [doctors, setDoctors] = useState<DoctorItem[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCampModalOpen, setIsCampModalOpen] = useState(false);
  const [activeQrDoctorId, setActiveQrDoctorId] = useState("dr-amit-verma");

  // Plant Nursery States
  const [nursery, setNursery] = useState<NurserySchema | null>(null);
  const [isNurseryModalOpen, setIsNurseryModalOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<PlantItem | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  // Buy Form State
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");
  const [officeUnit, setOfficeUnit] = useState("");
  const [isSubmittingPurchase, setIsSubmittingPurchase] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [purchaseError, setPurchaseError] = useState("");

  const activeQrDoctor = doctors.find(d => d.id === activeQrDoctorId) || doctors[0];
  const qrWhatsAppUrl = activeQrDoctor 
    ? `https://wa.me/${activeQrDoctor.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        `Hello Dr. ${activeQrDoctor.name}, I would like to book an appointment via the Kohinoor Services Hub.`
      )}`
    : "";

  const qrCodeUrl = qrWhatsAppUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrWhatsAppUrl)}`
    : "";

  async function loadData() {
    try {
      const data = await getDb();
      setServices(data.services);
      setDoctors(data.doctors || []);
      setNursery(data.nursery || null);
    } catch (err) {
      console.error("Failed to load services data:", err);
    }
  }

  useEffect(() => {
    loadData();
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
            const isMedicalCamp = svc.id === "svc-medical-camp";

            return (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                onClick={() => {
                  if (isMedicalCamp) {
                    setIsCampModalOpen(true);
                  }
                }}
                className={cn(
                  "bg-white border border-slate-200/50 rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-xl hover:border-sky-300 transition-all duration-500 relative overflow-hidden group hover:-translate-y-1.5 flex flex-col justify-between",
                  isMedicalCamp && "cursor-pointer hover:border-sky-400"
                )}
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

                    {isMedicalCamp && (
                      <div className="mt-4 flex items-center justify-center gap-1.5 py-3.5 px-5 rounded-2xl bg-sky-500/5 border border-sky-500/10 text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-all duration-350 font-bold text-xs uppercase tracking-wider">
                        <LucideIcons.CalendarRange className="w-4 h-4 shrink-0" />
                        <span>View Doctors & Book</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Plant Nursery Card */}
          {nursery && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: services.length * 0.15, ease: "easeOut" }}
              onClick={() => setIsNurseryModalOpen(true)}
              className="bg-white border border-slate-200/50 rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-xl hover:border-emerald-300 transition-all duration-500 relative overflow-hidden group hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
            >
              {/* Glow Ambient behind card */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" />

              <div className="flex flex-col gap-8 h-full justify-between">
                <div className="flex flex-col gap-6">
                  {/* Icon Wrapper */}
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white shrink-0">
                    <Leaf className="w-7 h-7 stroke-[2]" />
                  </div>

                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-extrabold text-navy-900 tracking-tight">
                      Green Canopy Nursery
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {nursery.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="h-px bg-slate-100 w-full" />

                  {/* Features checklist */}
                  <div className="flex flex-col gap-4">
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">
                      Nursery Amenities
                    </span>
                    <ul className="flex flex-col gap-3">
                      {[
                        "Lush Indoor & Outdoor Plants",
                        "Self-Pickup or Office Delivery",
                        "Expert Botanical Care Advice"
                      ].map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                          </div>
                          <span className="text-xs font-semibold text-slate-700 leading-tight">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-1.5 py-3.5 px-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-350 font-bold text-xs uppercase tracking-wider">
                    <ShoppingBag className="w-4 h-4 shrink-0" />
                    <span>Browse & Buy Plants</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* 2.5. TRANQUIL OASIS PREMIUM SERVICE SECTION */}
      <section className="relative py-20 px-6 md:px-12 max-w-7xl mx-auto w-full bg-[radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.06),transparent_50%)]">
        {/* Decorative backdrop elements */}
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-sky-200/5 blur-[70px] pointer-events-none" />
        <div className="absolute top-10 left-1/3 w-96 h-96 rounded-full bg-indigo-200/5 blur-[90px] pointer-events-none" />

        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col gap-4 text-center md:text-left mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-400/20 bg-sky-500/5 text-sky-700 text-[10px] font-bold w-max uppercase tracking-wider mx-auto md:mx-0">
              <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
              <span>Premium Wellness Service</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-navy-900 font-display">
              Tranquil Oasis
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
              Step away from the corporate rush. Re-energize your mind and body with our premium robotic massage chair therapy, designed specifically to reduce fatigue and elevate your cognitive focus.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            
            {/* Left Column: Details & CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:col-span-7 bg-white border border-slate-200/50 rounded-[28px] p-6 md:p-8 lg:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.02)] hover:shadow-xl hover:border-sky-300 transition-all duration-500 flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Subtle hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-sky-500/[0.01] pointer-events-none" />
              
              <div className="flex flex-col gap-8">
                
                {/* Header of card with Special Offer Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-500 flex items-center justify-center shrink-0">
                      <Flame className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-navy-900 leading-tight">Robot Massage Chair Session</h3>
                      <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Kohinoor Premium Experience</span>
                    </div>
                  </div>
                  
                  {/* Badge */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-rose-50 text-rose-600 border border-rose-100 uppercase tracking-wider animate-pulse self-start sm:self-auto">
                    <Ticket className="w-3.5 h-3.5" />
                    Special Offer
                  </span>
                </div>

                {/* Offer Price Highlight (₹100 only) */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-500/10 to-indigo-500/[0.02] border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-600">Limited-Time Pricing</span>
                    <span className="text-slate-500 text-xs">Unlock a premium session at an exclusive corporate rate:</span>
                  </div>
                  <div className="flex items-baseline gap-1 text-sky-600 shrink-0">
                    <span className="text-xl font-bold">₹</span>
                    <span className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-navy-900 to-sky-600">100</span>
                    <span className="text-sm font-semibold text-slate-400">/ Session</span>
                  </div>
                </div>

                {/* Specifications Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-sky-500/5 text-sky-500 flex items-center justify-center shrink-0 border border-sky-500/10">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Duration</span>
                      <span className="text-xs font-bold text-navy-800">20 Minute Session</span>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-sky-500/5 text-sky-500 flex items-center justify-center shrink-0 border border-sky-500/10">
                      <CalendarRange className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Timings</span>
                      <span className="text-xs font-bold text-navy-800">8:30 AM – 8:00 PM</span>
                    </div>
                  </div>
                </div>

                {/* Therapy Description (Text Only) */}
                <div className="flex flex-col gap-3 p-5 border border-slate-100 rounded-2xl bg-slate-50/50">
                  <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                    Zero-Gravity Robotic Therapy
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Equipped with multi-point body tracking rollers, gentle lumbar heating, customized airbag compression, and zero-gravity recline modes for complete physical decompression and cognitive rejuvenation.
                  </p>
                </div>

              </div>

              {/* Call to Action Row */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-6 border-t border-slate-100 w-full">
                
                {/* Phone Call Trigger */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-10 h-10 rounded-full bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                    <PhoneCall className="w-4.5 h-4.5 animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Direct Booking</span>
                    <a href="tel:8879002525" className="text-sm font-black text-navy-900 hover:text-sky-500 font-mono transition-colors">
                      8879002525
                    </a>
                  </div>
                </div>

                {/* Prominent CTA button */}
                <a
                  href={`https://wa.me/918879002525?text=${encodeURIComponent(
                    "Hello, I would like to book a 20-minute Tranquil Oasis Massage Chair session at Kohinoor City Office Towers."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto sm:ml-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-extrabold text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_4px_20px_rgba(56,189,248,0.3)] hover:shadow-[0_6px_25px_rgba(56,189,248,0.4)] hover:-translate-y-0.5 cursor-pointer text-center"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Book Now</span>
                </a>
              </div>

            </motion.div>

            {/* Right Column: Dynamic QR Booking Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
              className="lg:col-span-5 flex flex-col justify-center relative group"
            >
              {/* Outer Glow Backing */}
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/20 to-indigo-500/10 rounded-[36px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative w-full max-w-sm sm:max-w-md mx-auto bg-gradient-to-br from-navy-950 to-slate-900 border border-slate-800 text-white rounded-[32px] p-6 sm:p-8 flex flex-col justify-between items-center text-center shadow-xl group-hover:shadow-2xl transition-all duration-500 min-h-[360px] overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-[40px] pointer-events-none" />
                
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/20 text-sky-400 flex items-center justify-center">
                    <QrCode className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold tracking-tight">Scan to Book on Mobile</h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-[240px] mx-auto">
                      Scan the QR code with your phone camera to book a session instantly via WhatsApp.
                    </p>
                  </div>
                </div>

                <div className="my-6 p-6 bg-white/95 rounded-[24px] shadow-2xl flex items-center justify-center min-h-[180px] min-w-[180px] border border-sky-500/15 relative overflow-hidden group/qr">
                  {/* Glowing backdrop inside QR container */}
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-indigo-500/5 pointer-events-none" />

                  {/* Camera view finder corner marks */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-sky-400/60 rounded-tl pointer-events-none" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-sky-400/60 rounded-tr pointer-events-none" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-sky-400/60 rounded-bl pointer-events-none" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-sky-400/60 rounded-br pointer-events-none" />

                  {/* QR Image Wrapper */}
                  <div className="relative overflow-hidden rounded-xl p-1 bg-white">
                    {/* Laser Scanner Line */}
                    <div className="absolute inset-x-0 h-0.5 bg-sky-400 shadow-[0_0_8px_#38bdf8] animate-scan-laser pointer-events-none" />
                    
                    <Image
                      src="/images/tranquil_oasis_qr.png"
                      alt="Scan to book Tranquil Oasis"
                      width={140}
                      height={140}
                      className="rounded-lg object-contain transition-transform duration-350 group-hover/qr:scale-[1.03]"
                      priority
                    />
                  </div>
                </div>

                <div className="w-full">
                  <span className="text-[10px] uppercase font-bold text-sky-400 tracking-widest block">
                    Quick Booking Access
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Pre-filled chat will open on your phone
                  </span>
                </div>
              </div>
            </motion.div>

          </div>
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
                  className="p-4 sm:p-6 rounded-[20px] sm:rounded-[28px] border border-slate-200/40 bg-white hover:border-sky-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-350 flex flex-col items-center text-center gap-4 group"
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

      {/* Animated Pop-out Modal for Medical Camp / Visiting Doctors */}
      <AnimatePresence>
        {isCampModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-navy-950/70 backdrop-blur-md p-4 md:p-6 flex items-center justify-center"
            onClick={() => setIsCampModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl max-h-[90vh] md:max-h-[85vh] bg-slate-50 border border-white/60 rounded-[20px] sm:rounded-[30px] md:rounded-[36px] shadow-2xl p-4 sm:p-6 md:p-10 flex flex-col gap-6 md:gap-8 overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsCampModalOpen(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer z-50"
              >
                <LucideIcons.X className="w-6 h-6" />
              </button>

              {/* Modal Header */}
              <div className="flex flex-col gap-3 text-left pr-10 md:pr-0">
                <span className="text-xs font-bold text-sky-600 uppercase tracking-widest flex items-center gap-1.5">
                  <LucideIcons.HeartHandshake className="w-4 h-4 text-sky-500" />
                  On-Site Medical Consultation
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-navy-900 font-display">
                  Visiting Doctors & Specialists
                </h2>
                <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
                  Schedule direct consultations with our visiting medical professionals. Book appointments online to save time or scan the terminal QR code to schedule on your mobile device.
                </p>
              </div>

              {/* Split Content layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                {/* Doctors List */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  {doctors.map((doctor, idx) => {
                    const isSelectedForQr = activeQrDoctorId === doctor.id;
                    return (
                      <motion.div
                        key={doctor.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                        onClick={() => setActiveQrDoctorId(doctor.id)}
                        className={cn(
                          "bg-white border rounded-[20px] sm:rounded-3xl p-4 sm:p-5 md:p-6 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 cursor-pointer relative overflow-hidden group/doc",
                          isSelectedForQr 
                            ? "border-sky-500 shadow-[0_4px_25px_rgba(56,189,248,0.15)] bg-sky-500/[0.02]" 
                            : "border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.01)] hover:shadow-md hover:border-slate-300"
                        )}
                      >
                        {/* Left Active border bar */}
                        <div className={cn(
                          "absolute top-0 left-0 bottom-0 w-1 transition-all duration-300",
                          isSelectedForQr ? "bg-sky-500" : "bg-transparent"
                        )} />

                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center border shrink-0 transition-all duration-300", 
                            isSelectedForQr ? "bg-sky-500 text-white border-sky-400" : doctor.avatarColor
                          )}>
                            <LucideIcons.Stethoscope className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <div className="flex flex-col gap-1 sm:gap-1.5">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <h4 className="text-sm sm:text-base font-extrabold text-navy-900 tracking-tight leading-tight">
                                {doctor.name}
                              </h4>
                              {isSelectedForQr && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-extrabold bg-sky-100 text-sky-700 uppercase tracking-wide">
                                  Active QR
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] sm:text-xs text-sky-600 font-bold tracking-wide">
                              {doctor.specialty}
                            </span>
                            
                            <div className="flex flex-col gap-1 mt-1 text-[10px] sm:text-[11px] text-slate-500">
                              <div className="flex items-center gap-1.5">
                                <LucideIcons.CalendarRange className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                                <span>Visiting: <span className="font-semibold text-slate-700">{doctor.schedule}</span></span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <LucideIcons.Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                                <span className="font-mono text-slate-700">{doctor.phone}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <LucideIcons.Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                                <span className="text-slate-700 break-all">{doctor.email}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent toggling the QR code selector when booking
                            setSelectedDoctor(doctor);
                            setIsModalOpen(true);
                          }}
                          className={cn(
                            "w-full sm:w-auto sm:self-center px-4 py-2.5 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-300 shrink-0 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer",
                            isSelectedForQr
                              ? "bg-navy-900 text-white hover:bg-sky-500"
                              : "bg-slate-100 text-slate-700 hover:bg-navy-900 hover:text-white"
                          )}
                        >
                          <LucideIcons.Calendar className="w-3.5 h-3.5" />
                          Book Appointment
                        </button>
                      </motion.div>
                    );
                  })}
                  
                  {doctors.length === 0 && (
                    <div className="text-center py-10 border border-dashed border-slate-200 rounded-3xl text-slate-400 text-sm">
                      No visiting doctors currently scheduled.
                    </div>
                  )}
                </div>

                {/* QR Card - Desktop Only */}
                <div className="hidden lg:flex bg-gradient-to-br from-navy-950 to-slate-900 rounded-[32px] p-6 text-white shadow-xl flex-col justify-between items-center text-center border border-slate-800 relative overflow-hidden min-h-[380px]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-[40px] pointer-events-none" />
                  
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400 flex items-center justify-center">
                      <LucideIcons.QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold tracking-tight">Mobile QR Booking</h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed max-w-[200px] mx-auto">
                        Scan with your phone to book directly with <strong>{activeQrDoctor?.name || 'doctor'}</strong> via WhatsApp.
                      </p>
                    </div>
                  </div>

                  <div className="my-4 p-3 bg-white rounded-2xl shadow-xl flex items-center justify-center min-h-[128px] min-w-[128px]">
                    {qrCodeUrl ? (
                      <img
                        src={qrCodeUrl}
                        alt={`QR Code to Book with ${activeQrDoctor?.name || 'Doctor'}`}
                        className="w-28 h-28 rounded-xl"
                      />
                    ) : (
                      <div className="w-28 h-28 bg-slate-800 animate-pulse rounded-xl flex items-center justify-center text-[10px] text-slate-500">
                        Generating...
                      </div>
                    )}
                  </div>

                  <div className="w-full">
                    <span className="text-[9px] uppercase font-bold text-sky-400 tracking-widest block">
                      Quick Access Scan
                    </span>
                    <span className="text-[9px] text-slate-500 mt-0.5 block">
                      Point camera to begin
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDoctor(null);
        }}
        doctor={selectedDoctor}
      />

      {/* 4. PLANT NURSERY DETAIL MODAL */}
      <AnimatePresence>
        {isNurseryModalOpen && nursery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-navy-950/70 backdrop-blur-md p-4 md:p-6 flex items-center justify-center"
            onClick={() => setIsNurseryModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl max-h-[90vh] md:max-h-[85vh] bg-slate-50 border border-white/60 rounded-[20px] sm:rounded-[30px] md:rounded-[36px] shadow-2xl p-4 sm:p-6 md:p-10 flex flex-col gap-6 md:gap-8 overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsNurseryModalOpen(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer z-50"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Modal Header */}
              <div className="flex flex-col gap-3 text-left pr-10 md:pr-0">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-500 animate-bounce" />
                  Kohinoor Green Facility
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-navy-900 font-display">
                  Green Canopy Plant Nursery
                </h2>
                <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
                  {nursery.description}
                </p>
                
                {/* Nursery Details strip */}
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200/50 shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Location: <span className="font-semibold text-slate-800">{nursery.location}</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200/50 shadow-sm">
                    <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Timings: <span className="font-semibold text-slate-800">{nursery.timing}</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200/50 shadow-sm">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Contact: <span className="font-semibold text-slate-800">{nursery.contact}</span></span>
                  </div>
                </div>
              </div>

              {/* Grid of Plants */}
              <div className="flex flex-col gap-6">
                <h3 className="text-lg font-black text-navy-900 border-b border-slate-200 pb-2 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-500" />
                  <span>Available Plants for Purchase</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nursery.plants.map((plant) => (
                    <div
                      key={plant.id}
                      className="bg-white border border-slate-200/60 rounded-3xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group/plant"
                    >
                      <div className="flex flex-col gap-4">
                        {/* Plant Image Container */}
                        <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 relative shadow-inner">
                          {plant.imageSrc ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={plant.imageSrc}
                              alt={plant.name}
                              className="w-full h-full object-cover group-hover/plant:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Leaf className="w-12 h-12 stroke-[1]" />
                            </div>
                          )}
                          
                          {/* Stock status indicator */}
                          <div className={cn(
                            "absolute top-3 right-3 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider border shadow-sm",
                            plant.quantity > 0 
                              ? "bg-emerald-500/90 text-white border-emerald-400" 
                              : "bg-rose-500/90 text-white border-rose-400"
                          )}>
                            {plant.quantity > 0 ? `${plant.quantity} In Stock` : "Out of Stock"}
                          </div>
                        </div>

                        {/* Plant details */}
                        <div className="flex flex-col gap-2 text-left">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-extrabold text-navy-900 text-base leading-snug group-hover/plant:text-emerald-600 transition-colors">
                              {plant.name}
                            </h4>
                            <span className="font-black text-emerald-600 text-lg shrink-0">
                              ₹{plant.price}
                            </span>
                          </div>
                          <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                            {plant.description}
                          </p>
                        </div>
                      </div>

                      {/* Buy Button */}
                      <button
                        disabled={plant.quantity <= 0}
                        onClick={() => {
                          setSelectedPlant(plant);
                          setBuyQuantity(1);
                          setDeliveryMethod("pickup");
                          setOfficeUnit("");
                          setPurchaseSuccess(false);
                          setPurchaseError("");
                          setIsBuyModalOpen(true);
                        }}
                        className={cn(
                          "w-full mt-4 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer shadow-sm",
                          plant.quantity > 0 
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md" 
                            : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                        )}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{plant.quantity > 0 ? "Buy Now" : "Unavailable"}</span>
                      </button>
                    </div>
                  ))}
                </div>

                {nursery.plants.length === 0 && (
                  <div className="text-center py-12 border border-dashed border-slate-200 rounded-3xl text-slate-400 text-sm">
                    No plants currently available in the nursery database.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. BUY PLANT MODAL */}
      <AnimatePresence>
        {isBuyModalOpen && selectedPlant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/75 backdrop-blur-md p-4"
            onClick={() => setIsBuyModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white border border-white/60 rounded-[24px] sm:rounded-[32px] shadow-2xl p-5 sm:p-6 md:p-8 overflow-y-auto max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsBuyModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer z-50"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Form container */}
              <div className="flex flex-col text-left gap-5">
                <div className="flex flex-col gap-1 items-center text-center">
                  <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-100">
                    Nursery Checkout
                  </span>
                  <h3 className="text-lg font-black text-navy-900 mt-2">
                    Purchase {selectedPlant.name}
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold">
                    Unit Price: ₹{selectedPlant.price} | Stock: {selectedPlant.quantity} units
                  </span>
                </div>

                {!purchaseSuccess ? (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!buyerName.trim() || !buyerEmail.trim() || !buyerPhone.trim()) {
                        setPurchaseError("Please fill out all contact fields.");
                        return;
                      }
                      if (buyQuantity < 1 || buyQuantity > selectedPlant.quantity) {
                        setPurchaseError(`Please enter a quantity between 1 and ${selectedPlant.quantity}.`);
                        return;
                      }
                      if (deliveryMethod === "delivery" && !officeUnit.trim()) {
                        setPurchaseError("Please enter your office/unit number for delivery.");
                        return;
                      }

                      setIsSubmittingPurchase(true);
                      setPurchaseError("");

                      try {
                        const orderData = {
                          plantId: selectedPlant.id,
                          plantName: selectedPlant.name,
                          userName: buyerName.trim(),
                          userEmail: buyerEmail.trim(),
                          userPhone: buyerPhone.trim(),
                          quantity: buyQuantity,
                          totalPrice: selectedPlant.price * buyQuantity,
                          deliveryMethod,
                          officeUnit: deliveryMethod === "delivery" ? officeUnit.trim() : undefined
                        };

                        const res = await buyPlantAction(orderData);
                        if (res.success) {
                          setPurchaseSuccess(true);
                          await loadData();
                        } else {
                          setPurchaseError(res.error || "Failed to process purchase.");
                        }
                      } catch (err) {
                        setPurchaseError("An unexpected server error occurred.");
                      } finally {
                        setIsSubmittingPurchase(false);
                      }
                    }}
                    className="flex flex-col gap-4"
                  >
                    {/* Buyer Contact details */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Your Name</label>
                      <input
                        type="text"
                        required
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="e.g. Adrian Carter"
                        className="px-4 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-500 bg-slate-50/50 text-slate-700 font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Email Address</label>
                        <input
                          type="email"
                          required
                          value={buyerEmail}
                          onChange={(e) => setBuyerEmail(e.target.value)}
                          placeholder="adrian@corp.com"
                          className="px-4 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-500 bg-slate-50/50 text-slate-700 font-semibold"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={buyerPhone}
                          onChange={(e) => setBuyerPhone(e.target.value)}
                          placeholder="e.g. 8657902810"
                          className="px-4 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-500 bg-slate-50/50 text-slate-700 font-semibold font-mono"
                        />
                      </div>
                    </div>

                    {/* Quantity Selector and Total Price */}
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Quantity</label>
                        <input
                          type="number"
                          min={1}
                          max={selectedPlant.quantity}
                          required
                          value={buyQuantity}
                          onChange={(e) => setBuyQuantity(parseInt(e.target.value) || 1)}
                          className="w-20 px-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 bg-white font-bold"
                        />
                      </div>

                      <div className="flex flex-col items-end gap-0.5 text-right">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Total Price</span>
                        <span className="text-xl font-black text-emerald-600">
                          ₹{selectedPlant.price * buyQuantity}
                        </span>
                      </div>
                    </div>

                    {/* Delivery / Handoff method */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Handoff Method</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setDeliveryMethod("pickup")}
                          className={cn(
                            "py-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer",
                            deliveryMethod === "pickup"
                              ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          )}
                        >
                          Self-Pickup
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeliveryMethod("delivery")}
                          className={cn(
                            "py-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer",
                            deliveryMethod === "delivery"
                              ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          )}
                        >
                          Office Delivery
                        </button>
                      </div>
                    </div>

                    {/* Office unit if delivery selected */}
                    {deliveryMethod === "delivery" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="flex flex-col gap-1.5 overflow-hidden"
                      >
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Office Tower & Unit Number</label>
                        <input
                          type="text"
                          required
                          value={officeUnit}
                          onChange={(e) => setOfficeUnit(e.target.value)}
                          placeholder="e.g. Tower B, Level 18, Unit 1804"
                          className="px-4 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-emerald-500 bg-slate-50/50 text-slate-700 font-semibold"
                        />
                      </motion.div>
                    )}

                    {purchaseError && (
                      <div className="flex items-center gap-2 p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-600 text-xs font-semibold leading-relaxed">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                        <span>{purchaseError}</span>
                      </div>
                    )}

                    {/* Submit/Submit states */}
                    <button
                      type="submit"
                      disabled={isSubmittingPurchase}
                      className={cn(
                        "w-full py-4.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer",
                        isSubmittingPurchase && "opacity-80 cursor-wait"
                      )}
                    >
                      {isSubmittingPurchase ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Processing Order...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4.5 h-4.5" />
                          <span>Confirm Purchase</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  // Purchase Success view
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center gap-5 my-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-200">
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <h4 className="font-extrabold text-lg text-navy-900">Purchase Confirmed!</h4>
                      <p className="text-slate-500 text-xs leading-relaxed max-w-[280px]">
                        Your order for **{buyQuantity}x {selectedPlant.name}** has been processed successfully.
                      </p>
                    </div>

                    <div className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2.5 text-left text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Handoff Method:</span>
                        <span className="font-bold text-navy-800 uppercase tracking-wide">
                          {deliveryMethod === "pickup" ? "Self-Pickup" : "Office Delivery"}
                        </span>
                      </div>
                      {deliveryMethod === "delivery" && (
                        <div className="flex justify-between">
                          <span>Delivery Unit:</span>
                          <span className="font-bold text-navy-800 font-mono text-right">{officeUnit}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-slate-100 pt-2 font-semibold">
                        <span>Total Paid:</span>
                        <span className="text-emerald-600 font-black">₹{selectedPlant.price * buyQuantity}</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-normal max-w-[240px]">
                      {deliveryMethod === "pickup"
                        ? `Please visit the nursery at ${nursery?.location || 'the nursery'} during hours (${nursery?.timing || 'working hours'}) with your email confirmation to collect your plant.`
                        : `The nursery team will deliver your plant to ${officeUnit} shortly during operating hours.`}
                    </p>

                    <button
                      onClick={() => {
                        setIsBuyModalOpen(false);
                        setIsNurseryModalOpen(false);
                      }}
                      className="mt-2 w-full py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-navy-900 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                    >
                      Close Portal
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
