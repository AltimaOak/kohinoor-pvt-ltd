"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Mail, Building, User, Award, ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type RsvpModalProps = {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
};

export default function RsvpModal({ isOpen, onClose, eventName }: RsvpModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [designation, setDesignation] = useState("");
  const [towerInterest, setTowerInterest] = useState("Zenith");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Full name is required";
    if (!email.trim()) {
      newErrors.email = "Corporate email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid corporate email";
    }
    if (!company.trim()) newErrors.company = "Company name is required";
    if (!designation.trim()) newErrors.designation = "Corporate role is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate premium API round-trip
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/70 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white border border-white/60 glass-card rounded-3xl overflow-hidden shadow-2xl p-8 md:p-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Close Trigger */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>

            <AnimatePresence mode="wait">
              {!isSuccess ? (
                /* Interactive Form Screen */
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex flex-col gap-6"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] text-sky-600 font-bold uppercase tracking-widest flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                      Executive Invitation
                    </span>
                    <h3 className="text-xl font-bold tracking-tight text-navy-900 mt-1">
                      RSVP Registration
                    </h3>
                    <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                      Securing credentials for: <span className="font-bold text-navy-800">{eventName}</span>
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Full Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-extrabold text-navy-800">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="e.g. Adrian Carter"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={cn(
                            "w-full pl-10 pr-4 py-3 text-xs bg-slate-50 border rounded-2xl focus:outline-none focus:bg-white transition-colors text-slate-800",
                            errors.name ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-sky-500"
                          )}
                        />
                      </div>
                      {errors.name && <span className="text-[10px] text-red-500 font-medium pl-1">{errors.name}</span>}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-extrabold text-navy-800">
                        Corporate Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          placeholder="e.g. adrian@corp.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={cn(
                            "w-full pl-10 pr-4 py-3 text-xs bg-slate-50 border rounded-2xl focus:outline-none focus:bg-white transition-colors text-slate-800",
                            errors.email ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-sky-500"
                          )}
                        />
                      </div>
                      {errors.email && <span className="text-[10px] text-red-500 font-medium pl-1">{errors.email}</span>}
                    </div>

                    {/* Corporate Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Company Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase tracking-wider font-extrabold text-navy-800">
                          Company Name
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="e.g. Apex Ventures"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className={cn(
                              "w-full pl-10 pr-4 py-3 text-xs bg-slate-50 border rounded-2xl focus:outline-none focus:bg-white transition-colors text-slate-800",
                              errors.company ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-sky-500"
                            )}
                          />
                        </div>
                        {errors.company && <span className="text-[10px] text-red-500 font-medium pl-1">{errors.company}</span>}
                      </div>

                      {/* Corporate Role */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase tracking-wider font-extrabold text-navy-800">
                          Corporate Role
                        </label>
                        <div className="relative">
                          <Award className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="e.g. Chief Innovation Officer"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            className={cn(
                              "w-full pl-10 pr-4 py-3 text-xs bg-slate-50 border rounded-2xl focus:outline-none focus:bg-white transition-colors text-slate-800",
                              errors.designation ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-sky-500"
                            )}
                          />
                        </div>
                        {errors.designation && <span className="text-[10px] text-red-500 font-medium pl-1">{errors.designation}</span>}
                      </div>
                    </div>

                    {/* Tower Affiliation */}
                    <div className="flex flex-col gap-2 mt-1">
                      <label className="text-[10px] uppercase tracking-wider font-extrabold text-navy-800">
                        Primary Tower of Interest
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {["Zenith", "Apex", "External Partner"].map((tower) => {
                          const isSel = towerInterest === tower;
                          return (
                            <button
                              type="button"
                              key={tower}
                              onClick={() => setTowerInterest(tower)}
                              className={cn(
                                "py-2 px-3 rounded-xl border text-[10px] font-bold text-center transition-all cursor-pointer",
                                isSel
                                  ? "border-sky-500 bg-sky-500/10 text-sky-700"
                                  : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"
                              )}
                            >
                              {tower}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative flex items-center justify-center gap-2 overflow-hidden w-full py-4 mt-4 rounded-2xl bg-navy-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-sky-500 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>{isSubmitting ? "Generating Credentials..." : "Complete Registration"}</span>
                      {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </button>
                  </form>
                </motion.div>
              ) : (
                /* Success Animated Screen */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center text-center py-10 gap-6"
                >
                  {/* Glowing success check badge */}
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                      className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-400 to-sky-600 flex items-center justify-center text-white shadow-xl shadow-sky-500/30"
                    >
                      <Check className="w-8 h-8 stroke-[3.5]" />
                    </motion.div>
                    
                    {/* Visual burst bubbles */}
                    {[...Array(6)].map((_, i) => {
                      const angle = (i * 360) / 6;
                      const rad = (angle * Math.PI) / 180;
                      const distance = 40;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 1, x: 0, y: 0, scale: 0.2 }}
                          animate={{
                            opacity: 0,
                            x: Math.cos(rad) * distance,
                            y: Math.sin(rad) * distance,
                            scale: 1,
                          }}
                          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-sky-400 blur-[0.5px]"
                        />
                      );
                    })}
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold text-navy-900 tracking-tight">
                      Seat Successfully Reserved
                    </h3>
                    <p className="text-sm text-slate-600 max-w-sm">
                      Congratulations <span className="font-bold text-navy-800">{name}</span>! An official digital pass and calendar invite has been dispatched to <span className="font-semibold text-sky-600">{email}</span>.
                    </p>
                  </div>

                  <div className="p-4 border border-slate-100 bg-slate-50 rounded-2xl w-full flex flex-col gap-1.5 text-xs text-left max-w-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Access Tier:</span>
                      <span className="font-bold text-navy-800 uppercase tracking-wide">VVIP Access Pass</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Location:</span>
                      <span className="font-bold text-navy-800">Tower Zenith, Grand Lobby</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Security Gate:</span>
                      <span className="font-bold text-sky-600">Gate C-4 (Biometric Check)</span>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="px-8 py-3 rounded-full bg-navy-900 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md mt-2"
                  >
                    Return to Events
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
