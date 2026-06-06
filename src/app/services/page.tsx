"use client";

import React, { useState, useEffect } from "react";
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
  Flame
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { getDb, ServiceItem, DoctorItem } from "@/app/actions";
import AppointmentModal from "@/components/AppointmentModal";

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [doctors, setDoctors] = useState<DoctorItem[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCampModalOpen, setIsCampModalOpen] = useState(false);
  const [activeQrDoctorId, setActiveQrDoctorId] = useState("dr-amit-verma");

  const activeQrDoctor = doctors.find(d => d.id === activeQrDoctorId) || doctors[0];
  const qrWhatsAppUrl = activeQrDoctor 
    ? `https://wa.me/${activeQrDoctor.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        `Hello Dr. ${activeQrDoctor.name}, I would like to book an appointment via the Kohinoor Services Hub.`
      )}`
    : "";

  const qrCodeUrl = qrWhatsAppUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrWhatsAppUrl)}`
    : "";

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getDb();
        setServices(data.services);
        setDoctors(data.doctors || []);
      } catch (err) {
        console.error("Failed to load services data:", err);
      }
    }
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

    </div>
  );
}
