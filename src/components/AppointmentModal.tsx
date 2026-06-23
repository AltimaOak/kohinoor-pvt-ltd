"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, Calendar, MessageSquare } from "lucide-react";
import { DoctorItem } from "@/app/actions";

type AppointmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  doctor: DoctorItem | null;
};

export default function AppointmentModal({ isOpen, onClose, doctor }: AppointmentModalProps) {
  if (!doctor) return null;

  const generateMessageText = () => {
    return `Hello Dr. ${doctor.name}, I would like to book a consultation slot during your visiting hours (${doctor.schedule}) at Kohinoor City Office Towers.`;
  };

  const encodedText = encodeURIComponent(generateMessageText());
  const waPhone = doctor.phone ? doctor.phone.replace(/[^0-9]/g, "") : "";
  const whatsappUrl = `https://wa.me/${waPhone}?text=${encodedText}`;
  const mailtoUrl = `mailto:${doctor.email || ""}?subject=${encodeURIComponent(`Appointment Request - Kohinoor Towers`)}&body=${encodedText}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-md overflow-y-auto flex justify-center items-start sm:items-center p-4 sm:p-6 md:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[340px] sm:max-w-md bg-white border border-white/60 rounded-[20px] sm:rounded-[32px] shadow-2xl p-4 sm:p-6 md:p-8 my-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content Container */}
            <div className="flex flex-col items-center text-center gap-4 sm:gap-6 mt-2">
              {/* Header Info */}
              <div className="flex flex-col gap-1 sm:gap-1.5 items-center">
                <span className="text-[9px] sm:text-[10px] text-sky-600 font-extrabold uppercase tracking-widest px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-sky-50 border border-sky-100">
                  Doctor Appointment
                </span>
                <h3 className="text-lg sm:text-xl font-black text-navy-900 mt-1.5 sm:mt-2">
                  Dr. {doctor.name}
                </h3>
                <span className="text-[10px] sm:text-xs font-bold text-sky-500 tracking-wide">
                  {doctor.specialty}
                </span>
              </div>

              {/* Doctor Small Details Card */}
              <div className="w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2 sm:gap-2.5 text-left text-[11px] sm:text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
                  <span className="text-slate-500">Visiting Hours:</span>
                  <span className="font-bold text-navy-800 ml-auto text-right">{doctor.schedule}</span>
                </div>
                {doctor.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-500">Contact:</span>
                    <span className="font-mono text-slate-700 ml-auto">{doctor.phone}</span>
                  </div>
                )}
                {doctor.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
                    <span className="text-slate-500">Email:</span>
                    <span className="text-slate-700 ml-auto break-all text-right">{doctor.email}</span>
                  </div>
                )}
              </div>

              {/* Direct Booking Actions */}
              <div className="flex flex-col gap-2 sm:gap-3 w-full">
                {/* Send via WhatsApp */}
                {doctor.phone && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 sm:gap-2.5 w-full py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-[11px] sm:text-xs uppercase tracking-wider transition-colors shadow-md text-center cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    <span>Open WhatsApp Chat</span>
                  </a>
                )}

                {/* Send via Email */}
                {doctor.email && (
                  <a
                    href={mailtoUrl}
                    className="flex items-center justify-center gap-2 sm:gap-2.5 w-full py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-navy-900 hover:bg-sky-500 text-white font-extrabold text-[11px] sm:text-xs uppercase tracking-wider transition-colors shadow-md text-center cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send Request Email</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
