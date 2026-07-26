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
          data-lenis-prevent
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[340px] sm:max-w-[360px] bg-white border border-slate-100 rounded-xl shadow-md p-5 my-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3.5 right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer border border-slate-100/50 bg-white shadow-xs"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            {/* Content Container */}
            <div className="flex flex-col items-center text-center gap-4 mt-2">
              {/* Header Info */}
              <div className="flex flex-col gap-1 items-center select-none">
                <span className="text-[8.5px] text-sky-600 font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-50 border border-sky-100">
                  Doctor Appointment
                </span>
                <h3 className="text-base font-bold text-slate-950 mt-1.5">
                  Dr. {doctor.name}
                </h3>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  {doctor.specialty}
                </span>
              </div>

              {/* Doctor Details Grid */}
              <div className="w-full bg-slate-50 border border-slate-100/80 rounded-lg p-3 flex flex-col gap-2 text-[11px] select-none text-left">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px] shrink-0">Hours</span>
                  <span className="font-semibold text-slate-800 text-right">{doctor.schedule}</span>
                </div>
                {doctor.phone && (
                  <div className="flex justify-between items-center border-t border-slate-150 pt-1.5 gap-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px] shrink-0">Contact</span>
                    <span className="font-mono font-semibold text-slate-700 text-right">{doctor.phone}</span>
                  </div>
                )}
                {doctor.email && (
                  <div className="flex justify-between items-center border-t border-slate-150 pt-1.5 gap-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px] shrink-0">Email</span>
                    <span className="font-semibold text-slate-750 truncate max-w-[170px] text-right">{doctor.email}</span>
                  </div>
                )}
              </div>

              {/* Actions Grid */}
              <div className="flex gap-2 w-full pt-1">
                {doctor.phone && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 flex-1 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-[10px] uppercase tracking-wider transition-colors shadow-xs text-center cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-current" />
                    <span>WhatsApp</span>
                  </a>
                )}

                {doctor.email && (
                  <a
                    href={mailtoUrl}
                    className="flex items-center justify-center gap-1.5 flex-1 py-2 rounded-lg bg-slate-950 hover:bg-sky-600 text-white font-semibold text-[10px] uppercase tracking-wider transition-all duration-300 shadow-xs text-center cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Direct</span>
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
