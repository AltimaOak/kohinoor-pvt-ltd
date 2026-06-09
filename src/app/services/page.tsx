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
  Loader2,
  Plus,
  Minus,
  Coffee,
  Utensils,
  CreditCard,
  Volume2
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { getDb, ServiceItem, DoctorItem, buyPlantAction, buyCafeteriaAction, NurserySchema, PlantItem, CafeteriaSchema, CafeMenuItem } from "@/app/actions";
import AppointmentModal from "@/components/AppointmentModal";

function getWhatsAppUrl(phone: string, text: string): string {
  let digits = phone.replace(/[^0-9]/g, "");
  // Prepend 91 if it is 10 digits
  if (digits.length === 10) {
    digits = `91${digits}`;
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [doctors, setDoctors] = useState<DoctorItem[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCampModalOpen, setIsCampModalOpen] = useState(false);
  const [isMassageModalOpen, setIsMassageModalOpen] = useState(false);
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
  const [purchaseOrderId, setPurchaseOrderId] = useState("");

  // Cafeteria States
  const [cafeteria, setCafeteria] = useState<CafeteriaSchema | null>(null);
  const [isCafeteriaModalOpen, setIsCafeteriaModalOpen] = useState(false);
  const [cafeCart, setCafeCart] = useState<Record<string, number>>({});
  const [cafeActiveTab, setCafeActiveTab] = useState<"Drinks" | "Breakfast" | "Lunch">("Drinks");
  const [cafeStep, setCafeStep] = useState<"menu" | "checkout" | "payment" | "success">("menu");
  
  // Cafeteria Form State
  const [cafeName, setCafeName] = useState("");
  const [cafeEmail, setCafeEmail] = useState("");
  const [cafePhone, setCafePhone] = useState("");
  const [isSubmittingCafeOrder, setIsSubmittingCafeOrder] = useState(false);
  const [cafeOrderError, setCafeOrderError] = useState("");
  const [cafeOrderId, setCafeOrderId] = useState("");
  const [orderReadyState, setOrderReadyState] = useState<"idle" | "preparing" | "ready">("idle");
  const [readyAlertVisible, setReadyAlertVisible] = useState(false);

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
      setCafeteria(data.cafeteria || null);
    } catch (err) {
      console.error("Failed to load services data:", err);
    }
  }

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playNote = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      playNote(523.25, ctx.currentTime, 0.4); // C5
      playNote(659.25, ctx.currentTime + 0.15, 0.6); // E5
    } catch (e) {
      console.error("Audio Context error:", e);
    }
  };

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
            <span>Wellness & Support</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black font-display text-gradient-sky tracking-tight leading-[1.1]"
          >
            Occupant Services
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-sm md:text-base leading-relaxed"
          >
            Explore our on-site wellness facilities, premium robotic therapy sessions, medical checkups, and standby emergency transit systems designed for all occupants.
          </motion.p>
        </div>
      </section>

      {/* 2. SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {services.map((svc, index) => {
            const Icon = (LucideIcons as any)[svc.iconName] || LucideIcons.HelpCircle;
            const isMedicalCamp = svc.id === "svc-medical-camp";
            const isMassageChair = svc.id === "svc-massage-chair";
            const isClickable = isMedicalCamp || isMassageChair;

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
                  } else if (isMassageChair) {
                    setIsMassageModalOpen(true);
                  }
                }}
                className={cn(
                  "bg-white border border-slate-200/50 rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-xl transition-all duration-500 relative overflow-hidden group hover:-translate-y-1.5 flex flex-col justify-between",
                  isClickable ? "cursor-pointer" : "",
                  isMedicalCamp && "hover:border-sky-400",
                  isMassageChair && "hover:border-amber-400",
                  (!isMedicalCamp && !isMassageChair) && "hover:border-sky-300"
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
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shrink-0",
                      isMassageChair 
                        ? "bg-amber-500/10 border border-amber-400/20 text-amber-500 group-hover:bg-amber-500 group-hover:text-white"
                        : "bg-sky-500/10 border border-sky-400/20 text-sky-500 group-hover:bg-sky-500 group-hover:text-white"
                    )}>
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
                            <div className={cn(
                              "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border",
                              isMassageChair 
                                ? "bg-amber-500/10 border-amber-400/20 text-amber-600" 
                                : "bg-sky-500/10 border-sky-400/20 text-sky-600"
                            )}>
                              <Check className="w-3 h-3 stroke-[2.5]" />
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

                    {isMassageChair && (
                      <div className="mt-4 flex items-center justify-center gap-1.5 py-3.5 px-5 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-amber-600 group-hover:bg-amber-50 group-hover:text-white transition-all duration-350 font-bold text-xs uppercase tracking-wider">
                        <LucideIcons.Flame className="w-4 h-4 shrink-0 animate-pulse" />
                        <span>View Details & Book</span>
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
                        "Convenient Self-Pickup at Plaza",
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

          {/* Cafeteria Card */}
          {cafeteria && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (services.length + 1) * 0.15, ease: "easeOut" }}
              onClick={() => {
                setCafeStep("menu");
                setCafeCart({});
                setCafeOrderId("");
                setOrderReadyState("idle");
                setReadyAlertVisible(false);
                setIsCafeteriaModalOpen(true);
              }}
              className="bg-white border border-slate-200/50 rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-xl hover:border-amber-500 transition-all duration-500 relative overflow-hidden group hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
            >
              {/* Glow Ambient behind card */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" />

              <div className="flex flex-col gap-8 h-full justify-between">
                <div className="flex flex-col gap-6">
                  {/* Icon Wrapper */}
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-amber-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white shrink-0">
                    <Coffee className="w-7 h-7 stroke-[2]" />
                  </div>

                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-extrabold text-navy-900 tracking-tight">
                      Kohinoor Cafeteria
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {cafeteria.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="h-px bg-slate-100 w-full" />

                  {/* Features checklist */}
                  <div className="flex flex-col gap-4">
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">
                      Cafeteria Amenities
                    </span>
                    <ul className="flex flex-col gap-3">
                      {[
                        "Freshly Brewed Hot Coffee & Tea",
                        "Delicious Breakfast & Lunch Options",
                        "Quick Digital Payment & Instant Setup",
                        "Counter Collection Alerts"
                      ].map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-400/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-amber-600 stroke-[2.5]" />
                          </div>
                          <span className="text-xs font-semibold text-slate-700 leading-tight">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-1.5 py-3.5 px-5 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all duration-350 font-bold text-xs uppercase tracking-wider">
                    <Utensils className="w-4 h-4 shrink-0" />
                    <span>View Menu & Order</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
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
            className="fixed inset-0 z-40 bg-navy-950/70 backdrop-blur-md overflow-y-auto flex justify-center items-start sm:items-center p-4 sm:p-6 md:p-10"
            onClick={() => setIsCampModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl bg-slate-50 border border-white/60 rounded-[20px] sm:rounded-[30px] md:rounded-[36px] shadow-2xl p-4 sm:p-6 md:p-10 flex flex-col gap-6 md:gap-8 my-auto"
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

      {/* Animated Pop-out Modal for Massage Chair */}
      <AnimatePresence>
        {isMassageModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-navy-950/70 backdrop-blur-md overflow-y-auto flex justify-center items-start sm:items-center p-4 sm:p-6 md:p-10"
            onClick={() => setIsMassageModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-slate-50 border border-white/60 rounded-[20px] sm:rounded-[30px] md:rounded-[36px] shadow-2xl p-4 sm:p-6 md:p-10 flex flex-col gap-6 md:gap-8 my-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsMassageModalOpen(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer z-50"
              >
                <LucideIcons.X className="w-6 h-6" />
              </button>

              {/* Modal Header */}
              <div className="flex flex-col gap-3 text-left pr-10 md:pr-0">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  Premium Wellness Service
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-navy-900 font-display">
                  Tranquil Oasis Massage Chair
                </h2>
                <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
                  Step away from the corporate rush. Re-energize your mind and body with our premium robotic massage chair therapy, designed specifically to reduce fatigue and elevate your cognitive focus.
                </p>
              </div>

              {/* Centered Content Card */}
              <div className="w-full bg-white border border-slate-200/50 rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 md:p-8 lg:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.02)] hover:border-amber-300 transition-all duration-500 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-amber-500/[0.01] pointer-events-none" />
                
                <div className="flex flex-col gap-6 sm:gap-8">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-500 flex items-center justify-center shrink-0">
                        <Flame className="w-6 h-6 stroke-[2]" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-navy-900 leading-tight">Robot Massage Chair Session</h3>
                        <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Kohinoor Premium Experience</span>
                      </div>
                    </div>
                    
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-rose-50 text-rose-600 border border-rose-100 uppercase tracking-wider animate-pulse self-start sm:self-auto">
                      <Ticket className="w-3.5 h-3.5" />
                      Special Offer
                    </span>
                  </div>

                  <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/[0.02] border border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600">Limited-Time Pricing</span>
                      <span className="text-slate-500 text-xs">Unlock a premium session at an exclusive corporate rate:</span>
                    </div>
                    <div className="flex items-baseline gap-1 text-amber-600 shrink-0">
                      <span className="text-xl font-bold">₹</span>
                      <span className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-navy-900 to-amber-600">100</span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-400">/ Session</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-lg bg-amber-500/5 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/10">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Duration</span>
                        <span className="text-xs font-bold text-navy-800">20 Minute Session</span>
                      </div>
                    </div>
                    
                    <div className="p-3 sm:p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-lg bg-amber-500/5 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/10">
                        <CalendarRange className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Timings</span>
                        <span className="text-xs font-bold text-navy-800">8:30 AM – 8:00 PM</span>
                      </div>
                    </div>
                  </div>



                </div>

                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-5 sm:gap-6 pt-5 sm:pt-6 border-t border-slate-100 w-full">
                  
                  <a
                    href="tel:8879002525"
                    className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-3 shrink-0 group/phone cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0 group-hover/phone:scale-105 transition-transform">
                      <PhoneCall className="w-4.5 h-4.5 animate-pulse" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Direct Booking</span>
                      <span className="text-sm font-black text-navy-900 group-hover/phone:text-amber-500 font-mono transition-colors">
                        8879002525
                      </span>
                    </div>
                  </a>

                  <a
                    href="https://calendly.com/kohinoorcityofficekhcom2/tranquiloasismassagelounge?month=2026-06"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto sm:ml-auto inline-flex items-center justify-center gap-2 py-3 px-6 sm:py-3.5 sm:px-8 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_4px_20px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_25px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 cursor-pointer text-center"
                  >
                    <CalendarRange className="w-4 h-4" />
                    <span>Book Now</span>
                  </a>
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
                          deliveryMethod: "pickup" as const,
                          officeUnit: undefined
                        };

                        const res = await buyPlantAction(orderData);
                        if (res.success) {
                          setPurchaseOrderId(res.orderId || "");
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
                          Self-Pickup
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-slate-100 pt-2 font-semibold">
                        <span>Total Paid:</span>
                        <span className="text-emerald-600 font-black">₹{selectedPlant.price * buyQuantity}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-800 text-xs font-semibold w-full max-w-md text-left">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Receipt auto-generated & sent to **+91 {buyerPhone}** via Kohinoor WhatsApp Gateway.</span>
                    </div>

                    {/* Simulated WhatsApp Receipt on mobile */}
                    <div className="w-full max-w-md rounded-2xl overflow-hidden border border-emerald-600/30 shadow-md">
                      {/* Simulated Mobile Header */}
                      <div className="bg-[#075E54] text-white px-4 py-2.5 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white font-bold shrink-0 text-center">💬</div>
                        <div className="flex flex-col text-left">
                          <span className="text-[10px] font-bold leading-tight">Green Canopy Nursery</span>
                          <span className="text-[7px] opacity-80 leading-none">Online support counter</span>
                        </div>
                      </div>

                      {/* Chat Bubble Container */}
                      <div className="bg-[#ECE5DD] p-4 flex flex-col gap-2 min-h-[140px] text-left relative">
                        <div className="bg-white text-slate-800 rounded-lg p-3 text-[11px] shadow-sm max-w-[85%] self-start border border-slate-200">
                          <p className="font-extrabold text-[#075E54] border-b border-emerald-200/50 pb-1 mb-1.5 uppercase tracking-wide">
                            🟢 Order Receipt (#{(purchaseOrderId || 'ord-').substring(4, 11)})
                          </p>
                          <div className="flex flex-col gap-1 font-mono">
                            <div><strong>Customer:</strong> {buyerName}</div>
                            <div><strong>Contact:</strong> {buyerPhone}</div>
                            <div className="border-t border-dashed border-slate-300 my-1"></div>
                            <div className="flex justify-between">
                              <span>• {selectedPlant.name} x {buyQuantity}</span>
                              <span>₹{selectedPlant.price * buyQuantity}</span>
                            </div>
                            <div className="border-t border-dashed border-slate-300 my-1"></div>
                            <div className="flex justify-between font-extrabold text-[#075E54]">
                              <span>TOTAL PAID:</span>
                              <span>₹{selectedPlant.price * buyQuantity}</span>
                            </div>
                          </div>
                          <p className="mt-2 text-[8px] text-slate-500 text-center leading-normal italic">
                            Your purchase is confirmed. Please collect your plant from the Ground Floor, Tower B Plaza Area.
                          </p>
                        </div>
                        <span className="text-[8px] text-slate-400 self-start mt-0.5 ml-1">Just now</span>
                      </div>

                      {/* WhatsApp Action */}
                      <div className="bg-white p-3 border-t border-slate-100 flex justify-center">
                        <a
                          href={getWhatsAppUrl(
                            nursery?.contact || '8657902809',
                            `Hello Green Canopy Nursery, I have a query regarding my plant order #${purchaseOrderId}.`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Query Order on WhatsApp</span>
                        </a>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-normal max-w-[240px]">
                      Please visit the nursery at {nursery?.location || 'the nursery'} during hours ({nursery?.timing || 'working hours'}) with your email confirmation to collect your plant.
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

      {/* 6. CAFETERIA MODAL */}
      <AnimatePresence>
        {isCafeteriaModalOpen && cafeteria && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-navy-950/70 backdrop-blur-md p-4 md:p-6 flex items-center justify-center"
            onClick={() => setIsCafeteriaModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] bg-slate-50 border border-white/60 rounded-[20px] sm:rounded-[30px] md:rounded-[36px] shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col gap-6 overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsCafeteriaModalOpen(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer z-50"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Modal Header */}
              {cafeStep !== "success" && (
                <div className="flex flex-col gap-2.5 text-left pr-10 md:pr-0">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
                    <Coffee className="w-4 h-4 text-amber-500 animate-pulse" />
                    Corporate Dining Service
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-navy-900 font-display">
                    Kohinoor Executive Cafeteria
                  </h2>
                  <p className="text-slate-500 text-xs max-w-xl leading-relaxed">
                    {cafeteria.description}
                  </p>
                  
                  {/* Cafeteria Details strip */}
                  <div className="flex flex-wrap gap-3 mt-1.5 text-[10px] md:text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-slate-200/50 shadow-sm">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Location: <span className="font-semibold text-slate-800">{cafeteria.location}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-slate-200/50 shadow-sm">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Timings: <span className="font-semibold text-slate-800">{cafeteria.timing}</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-slate-200/50 shadow-sm">
                      <PhoneCall className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Contact: <span className="font-semibold text-slate-800">{cafeteria.contact}</span></span>
                    </div>
                  </div>
                </div>
              )}

              {/* Steps Layout */}
              {cafeStep === "menu" && (
                <div className="flex flex-col gap-5 text-left">
                  {/* Category Selection Tabs */}
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
                    {(["Drinks", "Breakfast", "Lunch"] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCafeActiveTab(cat)}
                        className={cn(
                          "px-4 py-2 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer",
                          cafeActiveTab === cat
                            ? "border-amber-500 text-amber-600 font-extrabold"
                            : "border-transparent text-slate-400 hover:text-slate-600"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Menu Items Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {cafeteria.menu
                      .filter((item) => item.category === cafeActiveTab)
                      .map((item) => {
                        const cartQty = cafeCart[item.id] || 0;
                        return (
                          <div
                            key={item.id}
                            className="bg-white border border-slate-200/60 rounded-2xl p-3 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md transition-all duration-300 flex flex-col justify-between group/cafeitem"
                          >
                            <div className="flex flex-col gap-3">
                              {/* Product Image */}
                              <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-100 relative shadow-inner">
                                {item.imageSrc ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={item.imageSrc}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover/cafeitem:scale-102 transition-transform duration-500"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <Utensils className="w-10 h-10 stroke-[1]" />
                                  </div>
                                )}
                                <div className={cn(
                                  "absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border shadow-sm",
                                  item.quantity > 0 
                                    ? "bg-amber-500/90 text-white border-amber-400" 
                                    : "bg-rose-500/90 text-white border-rose-400"
                                )}>
                                  {item.quantity > 0 ? `${item.quantity} Available` : "Sold Out"}
                                </div>
                              </div>

                              {/* Details */}
                              <div className="flex flex-col gap-1">
                                <div className="flex items-start justify-between gap-1.5">
                                  <h4 className="font-extrabold text-navy-900 text-sm leading-snug group-hover/cafeitem:text-amber-600 transition-colors">
                                    {item.name}
                                  </h4>
                                  <span className="font-black text-amber-600 text-sm shrink-0">
                                    ₹{item.price}
                                  </span>
                                </div>
                                <p className="text-slate-500 text-[10px] leading-relaxed line-clamp-2">
                                  {item.description}
                                </p>
                              </div>
                            </div>

                            {/* Quantity buttons */}
                            <div className="mt-3 flex items-center gap-2">
                              {cartQty > 0 ? (
                                <div className="flex items-center justify-between w-full border border-amber-200 rounded-xl bg-amber-500/5 p-1">
                                  <button
                                    onClick={() => setCafeCart({ ...cafeCart, [item.id]: cartQty - 1 })}
                                    className="w-7 h-7 rounded-lg bg-white border border-amber-200 text-amber-600 flex items-center justify-center hover:bg-amber-100 transition-colors cursor-pointer"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="text-xs font-black text-navy-900 px-2">{cartQty}</span>
                                  <button
                                    disabled={cartQty >= item.quantity}
                                    onClick={() => setCafeCart({ ...cafeCart, [item.id]: cartQty + 1 })}
                                    className="w-7 h-7 rounded-lg bg-white border border-amber-200 text-amber-600 flex items-center justify-center hover:bg-amber-100 transition-colors cursor-pointer disabled:opacity-50"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  disabled={item.quantity <= 0}
                                  onClick={() => setCafeCart({ ...cafeCart, [item.id]: 1 })}
                                  className={cn(
                                    "w-full py-2 rounded-xl font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer shadow-sm border",
                                    item.quantity > 0 
                                      ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-500" 
                                      : "bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200"
                                  )}
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Add to Cart</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Summary & Checkout Button */}
                  <div className="mt-4 p-4 bg-slate-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Cart Total</span>
                      <span className="text-xl font-black text-amber-600">
                        ₹{Object.entries(cafeCart).reduce((sum, [id, qty]) => {
                          const it = cafeteria.menu.find(m => m.id === id);
                          return sum + (it ? it.price * qty : 0);
                        }, 0)}
                      </span>
                    </div>

                    <button
                      disabled={Object.values(cafeCart).reduce((sum, qty) => sum + qty, 0) === 0}
                      onClick={() => setCafeStep("checkout")}
                      className={cn(
                        "w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-350 cursor-pointer text-center flex items-center justify-center gap-2",
                        Object.values(cafeCart).reduce((sum, qty) => sum + qty, 0) > 0
                          ? "bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                      )}
                    >
                      <span>Checkout Order</span>
                      <ShoppingBag className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              )}

              {cafeStep === "checkout" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!cafeName.trim() || !cafeEmail.trim() || !cafePhone.trim()) {
                      setCafeOrderError("Please fill in all details.");
                      return;
                    }
                    setCafeOrderError("");
                    setCafeStep("payment");
                  }}
                  className="flex flex-col gap-4 text-left"
                >
                  <h3 className="text-lg font-black text-navy-900 border-b border-slate-200 pb-2">Customer Details</h3>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Full Name</label>
                    <input
                      type="text"
                      required
                      value={cafeName}
                      onChange={(e) => setCafeName(e.target.value)}
                      placeholder="e.g. Tanmay Mhatre"
                      className="px-4 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-amber-500 bg-white text-slate-700 font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Email Address</label>
                      <input
                        type="email"
                        required
                        value={cafeEmail}
                        onChange={(e) => setCafeEmail(e.target.value)}
                        placeholder="tanmay@corp.com"
                        className="px-4 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-amber-500 bg-white text-slate-700 font-semibold"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Phone Number (WhatsApp)</label>
                      <input
                        type="tel"
                        required
                        value={cafePhone}
                        onChange={(e) => setCafePhone(e.target.value)}
                        placeholder="e.g. 9372025677"
                        className="px-4 py-3 border border-slate-200 rounded-xl text-xs w-full focus:outline-none focus:border-amber-500 bg-white text-slate-700 font-semibold font-mono"
                      />
                    </div>
                  </div>

                  {cafeOrderError && (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold">
                      {cafeOrderError}
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setCafeStep("menu")}
                      className="px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Back to Menu
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Proceed to Payment
                    </button>
                  </div>
                </form>
              )}

              {cafeStep === "payment" && (
                <div className="flex flex-col gap-5 text-left">
                  <h3 className="text-lg font-black text-navy-900 border-b border-slate-200 pb-2 flex items-center gap-1.5">
                    <CreditCard className="w-5 h-5 text-amber-500" />
                    <span>Bill Payment (Simulated)</span>
                  </h3>

                  {/* Order summary */}
                  <div className="p-4 bg-slate-100 rounded-xl flex flex-col gap-2.5 text-xs text-slate-600">
                    <span className="font-black text-navy-900 uppercase tracking-wide">Order Summary</span>
                    {Object.entries(cafeCart).map(([id, qty]) => {
                      const it = cafeteria.menu.find(m => m.id === id)!;
                      return (
                        <div key={id} className="flex justify-between font-semibold">
                          <span>{it.name} x {qty}</span>
                          <span>₹{it.price * qty}</span>
                        </div>
                      );
                    })}
                    <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-sm text-navy-900">
                      <span>Total to Pay:</span>
                      <span className="text-amber-600">
                        ₹{Object.entries(cafeCart).reduce((sum, [id, qty]) => {
                          const it = cafeteria.menu.find(m => m.id === id);
                          return sum + (it ? it.price * qty : 0);
                        }, 0)}
                      </span>
                    </div>
                  </div>

                  {/* Payment Form Details */}
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setIsSubmittingCafeOrder(true);
                      setCafeOrderError("");

                      try {
                        const orderItems = Object.entries(cafeCart).map(([itemId, qty]) => {
                          const menuItem = cafeteria.menu.find(m => m.id === itemId)!;
                          return {
                            itemId,
                            name: menuItem.name,
                            price: menuItem.price,
                            quantity: qty
                          };
                        });

                        const totalPrice = Object.entries(cafeCart).reduce((sum, [itemId, qty]) => {
                          const menuItem = cafeteria.menu.find(m => m.id === itemId)!;
                          return sum + (menuItem.price * qty);
                        }, 0);

                        const orderData = {
                          items: orderItems,
                          totalPrice,
                          userName: cafeName.trim(),
                          userEmail: cafeEmail.trim(),
                          userPhone: cafePhone.trim()
                        };

                        const res = await buyCafeteriaAction(orderData);
                        if (res.success && res.orderId) {
                          setCafeOrderId(res.orderId);
                          setCafeStep("success");
                          await loadData();
                          
                          // Trigger ready simulation
                          setOrderReadyState("preparing");
                          setTimeout(() => {
                            setOrderReadyState("ready");
                            setReadyAlertVisible(true);
                            // Synthesize sound
                            playChime();
                            // Alert
                            alert("Your Cafeteria Order is Ready! You can pickup your order from that cafeteria counter.");
                          }, 6000);
                        } else {
                          setCafeOrderError(res.error || "Failed to process cafeteria order.");
                        }
                      } catch (err) {
                        setCafeOrderError("An unexpected server error occurred.");
                      } finally {
                        setIsSubmittingCafeOrder(false);
                      }
                    }}
                    className="flex flex-col gap-4"
                  >
                    <div className="p-4 border border-amber-100 bg-amber-500/[0.02] rounded-xl flex flex-col gap-3">
                      <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Select Payment Method</span>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-3 rounded-lg border border-amber-300 bg-white flex flex-col items-center justify-center gap-1 cursor-pointer text-center">
                          <CreditCard className="w-5 h-5 text-amber-500" />
                          <span className="text-[9px] font-bold text-navy-800">Card</span>
                        </div>
                        <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-1 cursor-pointer text-center grayscale opacity-60">
                          <Check className="w-5 h-5 text-slate-500" />
                          <span className="text-[9px] font-bold text-slate-500">UPI</span>
                        </div>
                        <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-1 cursor-pointer text-center grayscale opacity-60">
                          <Compass className="w-5 h-5 text-slate-500" />
                          <span className="text-[9px] font-bold text-slate-500">NetBanking</span>
                        </div>
                      </div>

                      {/* Mock Card Inputs */}
                      <div className="flex flex-col gap-2 mt-2">
                        <input
                          type="text"
                          required
                          maxLength={16}
                          placeholder="Card Number (e.g. 4111 2222 3333 4444)"
                          defaultValue="4111222233334444"
                          className="px-3 py-2 border border-slate-200 rounded-lg text-xs w-full focus:outline-none focus:border-amber-500 text-slate-700 font-semibold font-mono"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            maxLength={5}
                            placeholder="MM/YY"
                            defaultValue="12/29"
                            className="px-3 py-2 border border-slate-200 rounded-lg text-xs w-full focus:outline-none focus:border-amber-500 text-slate-700 font-semibold font-mono"
                          />
                          <input
                            type="password"
                            required
                            maxLength={3}
                            placeholder="CVV"
                            defaultValue="123"
                            className="px-3 py-2 border border-slate-200 rounded-lg text-xs w-full focus:outline-none focus:border-amber-500 text-slate-700 font-semibold font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {cafeOrderError && (
                      <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold">
                        {cafeOrderError}
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => setCafeStep("checkout")}
                        className="px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingCafeOrder}
                        className={cn(
                          "px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-md flex items-center justify-center gap-1.5 cursor-pointer",
                          isSubmittingCafeOrder && "opacity-80 cursor-wait"
                        )}
                      >
                        {isSubmittingCafeOrder ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Confirm & Pay</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {cafeStep === "success" && (
                <div className="flex flex-col items-center gap-6 my-2">
                  <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center border border-amber-200">
                    <Check className="w-7 h-7 stroke-[3]" />
                  </div>

                  <div className="flex flex-col gap-1.5 text-center">
                    <h3 className="text-xl font-extrabold text-navy-900">Order Placed & Paid!</h3>
                    <p className="text-slate-500 text-xs max-w-[280px]">
                      Your payment has been successfully cleared. Your order is now in the kitchen.
                    </p>
                  </div>

                  {/* Order Ready Status Indicator */}
                  <div className="w-full max-w-md p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm text-left flex flex-col gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Preparation Live Tracker</span>
                    
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</div>
                        <span className="text-xs font-bold text-slate-800">Order Placed</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Paid</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        {orderReadyState === "preparing" ? (
                          <div className="w-6 h-6 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</div>
                        )}
                        <span className="text-xs font-bold text-slate-800">Preparing Food & Drink</span>
                      </div>
                      <span className="text-[10px] text-amber-500 font-bold animate-pulse">{orderReadyState === "preparing" ? "In Progress..." : "Completed"}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold", 
                          orderReadyState === "ready" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400 border border-slate-200"
                        )}>
                          {orderReadyState === "ready" ? "✓" : "3"}
                        </div>
                        <span className={cn("text-xs font-bold", orderReadyState === "ready" ? "text-slate-800" : "text-slate-400")}>Ready for Pickup</span>
                      </div>
                      <span className={cn("text-[10px] font-bold", orderReadyState === "ready" ? "text-emerald-600 animate-bounce" : "text-slate-400")}>
                        {orderReadyState === "ready" ? "Ready!" : "Pending"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-800 text-xs font-semibold w-full max-w-md text-left">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Receipt auto-generated & sent to **+91 {cafePhone}** via Kohinoor WhatsApp Gateway.</span>
                  </div>

                  {/* Simulated WhatsApp Receipt on mobile */}
                  <div className="w-full max-w-md rounded-2xl overflow-hidden border border-emerald-600/30 shadow-md">
                    {/* Simulated Mobile Header */}
                    <div className="bg-[#075E54] text-white px-4 py-2.5 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white font-bold shrink-0 text-center">💬</div>
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-bold leading-tight">Kohinoor Cafeteria</span>
                        <span className="text-[7px] opacity-80 leading-none">Online support counter</span>
                      </div>
                    </div>

                    {/* Chat Bubble Container */}
                    <div className="bg-[#ECE5DD] p-4 flex flex-col gap-2 min-h-[160px] text-left relative">
                      <div className="bg-white text-slate-800 rounded-lg p-3 text-[11px] shadow-sm max-w-[85%] self-start border border-slate-200">
                        <p className="font-extrabold text-[#075E54] border-b border-emerald-200/50 pb-1 mb-1.5 uppercase tracking-wide">
                          🟢 Order Receipt (#{(cafeOrderId || 'cafe-').substring(5, 12)})
                        </p>
                        <div className="flex flex-col gap-1 font-mono">
                          <div><strong>Customer:</strong> {cafeName}</div>
                          <div><strong>Contact:</strong> {cafePhone}</div>
                          <div className="border-t border-dashed border-slate-300 my-1"></div>
                          {Object.entries(cafeCart).map(([id, qty]) => {
                            const it = cafeteria.menu.find(m => m.id === id)!;
                            return (
                              <div key={id} className="flex justify-between">
                                <span>• {it.name} x {qty}</span>
                                <span>₹{it.price * qty}</span>
                              </div>
                            );
                          })}
                          <div className="border-t border-dashed border-slate-300 my-1"></div>
                          <div className="flex justify-between font-extrabold text-[#075E54]">
                            <span>TOTAL PAID:</span>
                            <span>₹{Object.entries(cafeCart).reduce((sum, [id, qty]) => {
                              const it = cafeteria.menu.find(m => m.id === id);
                              return sum + (it ? it.price * qty : 0);
                            }, 0)}</span>
                          </div>
                        </div>
                        <p className="mt-2 text-[8px] text-slate-500 text-center leading-normal italic">
                          Your order is confirmed. You will receive an alert once it is ready for counter pickup.
                        </p>
                      </div>
                      <span className="text-[8px] text-slate-400 self-start mt-0.5 ml-1">Just now</span>
                    </div>

                    {/* WhatsApp Action */}
                    <div className="bg-white p-3 border-t border-slate-100 flex justify-center">
                      <a
                        href={getWhatsAppUrl(
                          cafeteria?.contact || '8657902811',
                          `Hello Kohinoor Cafeteria, I have a query regarding my cafeteria order #${cafeOrderId}.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Query Order on WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCafeteriaModalOpen(false);
                    }}
                    className="w-full max-w-md py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-navy-900 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                  >
                    Close Cafeteria Portal
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual slide-down ready alert banner */}
      <AnimatePresence>
        {readyAlertVisible && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl shadow-2xl p-4 border border-amber-400 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Volume2 className="w-5 h-5 text-white animate-bounce" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-black uppercase tracking-wider">Order Ready!</span>
                <span className="text-[11px] opacity-90 leading-tight">Please collect your Cafeteria order from the counter.</span>
              </div>
            </div>
            <button
              onClick={() => setReadyAlertVisible(false)}
              className="p-1.5 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
