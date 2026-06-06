"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Mail, Phone, Calendar, Clock, FileText, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { bookAppointmentAction, DoctorItem } from "@/app/actions";

type AppointmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  doctor: DoctorItem | null;
};

export default function AppointmentModal({ isOpen, onClose, doctor }: AppointmentModalProps) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!doctor) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!userName.trim()) newErrors.userName = "Your name is required";
    if (!userPhone.trim()) {
      newErrors.userPhone = "Phone number is required";
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(userPhone.trim())) {
      newErrors.userPhone = "Enter a valid phone number";
    }
    if (!userEmail.trim()) {
      newErrors.userEmail = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(userEmail)) {
      newErrors.userEmail = "Enter a valid email address";
    }
    if (!date) newErrors.date = "Preferred date is required";
    if (!time) newErrors.time = "Preferred time is required";
    if (!message.trim()) newErrors.message = "Please describe the reason for your appointment";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateMessageText = () => {
    return `Hello Dr. ${doctor.name},

I would like to book an appointment with you. Here are my details:
- Name: ${userName}
- Phone: ${userPhone}
- Email: ${userEmail}
- Preferred Date: ${date}
- Preferred Time: ${time}
- Reason: ${message}

Please let me know if this slot is available. Thank you!`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await bookAppointmentAction({
        doctorId: doctor.id,
        doctorName: doctor.name,
        userName,
        userEmail,
        userPhone,
        date,
        time,
        message
      });

      if (res.success) {
        setIsSuccess(true);
      } else {
        setErrors({ submit: res.error || "Failed to schedule appointment." });
      }
    } catch (err) {
      setErrors({ submit: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate WhatsApp and Email Links
  const encodedText = encodeURIComponent(generateMessageText());
  // WhatsApp: Use the doctor's phone number from the DB (strip +, spaces, etc.)
  const waPhone = doctor.phone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${waPhone}?text=${encodedText}`;
  
  // Mailto: Send to doctor's email, Cc user, with subject and pre-filled body
  const mailtoUrl = `mailto:${doctor.email}?cc=${userEmail}&subject=${encodeURIComponent(`Appointment Request: ${userName}`)}&body=${encodedText}`;

  const handleClose = () => {
    // Reset state on close
    setUserName("");
    setUserEmail("");
    setUserPhone("");
    setDate("");
    setTime("");
    setMessage("");
    setErrors({});
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 backdrop-blur-md p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white border border-white/60 glass-card rounded-3xl overflow-hidden shadow-2xl p-8 md:p-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <AnimatePresence mode="wait">
              {!isSuccess ? (
                /* Appointment Booking Form */
                <motion.div
                  key="booking-form"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex flex-col gap-6"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] text-sky-600 font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                      Consultation Booking
                    </span>
                    <h3 className="text-xl font-black tracking-tight text-navy-900 mt-1">
                      Book an Appointment
                    </h3>
                    <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                      Scheduling request for: <span className="font-extrabold text-navy-800">{doctor.name}</span> <span className="text-slate-400">({doctor.specialty})</span>
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {errors.submit && (
                      <div className="p-3 text-xs bg-red-50 text-red-600 rounded-xl font-semibold border border-red-100">
                        {errors.submit}
                      </div>
                    )}

                    {/* Patient Name */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase tracking-wider font-extrabold text-navy-800">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Adrian Carter"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className={cn(
                          "w-full px-4 py-3 text-xs bg-slate-50 border rounded-2xl focus:outline-none focus:bg-white transition-colors text-slate-800",
                          errors.userName ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-sky-500"
                        )}
                      />
                      {errors.userName && <span className="text-[10px] text-red-500 font-medium pl-1">{errors.userName}</span>}
                    </div>

                    {/* Contact Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Email */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase tracking-wider font-extrabold text-navy-800">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                          <input
                            type="email"
                            placeholder="e.g. adrian@corp.com"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            className={cn(
                              "w-full pl-10 pr-4 py-3 text-xs bg-slate-50 border rounded-2xl focus:outline-none focus:bg-white transition-colors text-slate-800",
                              errors.userEmail ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-sky-500"
                            )}
                          />
                        </div>
                        {errors.userEmail && <span className="text-[10px] text-red-500 font-medium pl-1">{errors.userEmail}</span>}
                      </div>

                      {/* Phone */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase tracking-wider font-extrabold text-navy-800">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                          <input
                            type="tel"
                            placeholder="e.g. +91 98765 43210"
                            value={userPhone}
                            onChange={(e) => setUserPhone(e.target.value)}
                            className={cn(
                              "w-full pl-10 pr-4 py-3 text-xs bg-slate-50 border rounded-2xl focus:outline-none focus:bg-white transition-colors text-slate-800",
                              errors.userPhone ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-sky-500"
                            )}
                          />
                        </div>
                        {errors.userPhone && <span className="text-[10px] text-red-500 font-medium pl-1">{errors.userPhone}</span>}
                      </div>
                    </div>

                    {/* Schedule Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Date */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase tracking-wider font-extrabold text-navy-800">
                          Preferred Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                          <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={cn(
                              "w-full pl-10 pr-4 py-3 text-xs bg-slate-50 border rounded-2xl focus:outline-none focus:bg-white transition-colors text-slate-800",
                              errors.date ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-sky-500"
                            )}
                          />
                        </div>
                        {errors.date && <span className="text-[10px] text-red-500 font-medium pl-1">{errors.date}</span>}
                      </div>

                      {/* Time */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase tracking-wider font-extrabold text-navy-800">
                          Preferred Time
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                          <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className={cn(
                              "w-full pl-10 pr-4 py-3 text-xs bg-slate-50 border rounded-2xl focus:outline-none focus:bg-white transition-colors text-slate-800",
                              errors.time ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-sky-500"
                            )}
                          />
                        </div>
                        {errors.time && <span className="text-[10px] text-red-500 font-medium pl-1">{errors.time}</span>}
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase tracking-wider font-extrabold text-navy-800">
                        Reason for Appointment
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                        <textarea
                          placeholder="Please provide brief details (e.g. fever checkup, wellness consultation, cardiac report evaluation...)"
                          rows={3}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className={cn(
                            "w-full pl-10 pr-4 py-3 text-xs bg-slate-50 border rounded-2xl focus:outline-none focus:bg-white transition-colors text-slate-800 resize-none",
                            errors.message ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-sky-500"
                          )}
                        />
                      </div>
                      {errors.message && <span className="text-[10px] text-red-500 font-medium pl-1">{errors.message}</span>}
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative flex items-center justify-center gap-2 w-full py-4 mt-2 rounded-2xl bg-navy-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-sky-500 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <span>{isSubmitting ? "Processing Request..." : "Request Appointment"}</span>
                      {!isSubmitting && <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
                    </button>
                  </form>
                </motion.div>
              ) : (
                /* Success Screen with Dispatch Actions */
                <motion.div
                  key="booking-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center text-center py-6 gap-6"
                >
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                      className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-400 to-sky-600 flex items-center justify-center text-white shadow-xl shadow-sky-500/30"
                    >
                      <Check className="w-8 h-8 stroke-[3.5]" />
                    </motion.div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-black text-navy-900 tracking-tight">
                      Booking Registered!
                    </h3>
                    <p className="text-slate-600 text-xs max-w-sm leading-relaxed">
                      Your request has been successfully recorded in the campus health system. 
                      <span className="block font-bold text-navy-800 mt-2">
                        IMPORTANT: Please proceed to dispatch this booking directly to Dr. {doctor.name} using the channels below.
                      </span>
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 border border-slate-100 bg-slate-50 rounded-2xl w-full flex flex-col gap-2 text-xs text-left max-w-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Doctor:</span>
                      <span className="font-extrabold text-navy-800">{doctor.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Scheduled Date:</span>
                      <span className="font-bold text-navy-800">{date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Preferred Time:</span>
                      <span className="font-bold text-sky-600">{time}</span>
                    </div>
                  </div>

                  {/* Dispatch CTA Buttons */}
                  <div className="flex flex-col gap-3 w-full max-w-sm mt-2">
                    {/* Send via WhatsApp */}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md text-center cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <span>Send to Doctor WhatsApp</span>
                    </a>

                    {/* Send via Email */}
                    <a
                      href={mailtoUrl}
                      className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl bg-navy-900 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md text-center cursor-pointer"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Send via Email Client</span>
                    </a>
                  </div>

                  <button
                    onClick={handleClose}
                    className="px-8 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-wider transition-colors mt-2 cursor-pointer"
                  >
                    Done & Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
