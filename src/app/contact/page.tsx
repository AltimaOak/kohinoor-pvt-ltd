"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  Sparkles,
  Send,
  Building,
  CheckCircle2,
  Users,
  Grid
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    interest: "Tower Zenith (Leasing)",
    spaceRequired: "5,000 - 15,000 SQ FT",
    message: ""
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Corporate email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid corporate email";
    }
    if (!formData.company.trim()) newErrors.company = "Company name is required";
    if (!formData.message.trim()) newErrors.message = "Message requirements are required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        interest: "Tower Zenith (Leasing)",
        spaceRequired: "5,000 - 15,000 SQ FT",
        message: ""
      });
      setTimeout(() => setSuccess(false), 8000);
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full pb-20 overflow-hidden">
      
      {/* 1. HEADER PAGE BANNER */}
      <section className="relative pt-20 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-10 w-96 h-96 rounded-full bg-sky-200/10 blur-[80px] pointer-events-none" />

        <div className="max-w-3xl flex flex-col gap-5 text-left relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-400/20 bg-sky-500/5 text-sky-700 text-[10px] font-bold w-max uppercase tracking-wider"
          >
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>Connect & Lease</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black font-display text-gradient-sky tracking-tight leading-[1.1]"
          >
            Initiate Corporate Relations
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-sm md:text-base leading-relaxed"
          >
            Establish your corporate footprint at Kohinoor Complex. Submit a leasing request, coordinate high-level site inspections, or reach our technical support teams.
          </motion.p>
        </div>
      </section>

      {/* 2. CONTACT DETAILS & LEASING FORM */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start w-full relative z-10">
        
        {/* Left Side: Real-Estate Contact Specifications (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          {/* Operations directory */}
          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-bold text-navy-900 tracking-tight">
              Corporate Headquarters
            </h3>
            
            <ul className="flex flex-col gap-5 text-sm text-slate-600">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/5 border border-sky-400/20 flex items-center justify-center shrink-0 text-sky-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Physical Site Address</span>
                  <span className="text-navy-800 font-medium mt-0.5 leading-relaxed">
                    Kohinoor Complex, Landmark Ave,<br />
                    Business District, Tower B, Level 18
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/5 border border-sky-400/20 flex items-center justify-center shrink-0 text-sky-600">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Leasing Hotline</span>
                  <span className="text-navy-800 font-bold mt-0.5 hover:text-sky-500 transition-colors">+1 (555) 019-2831</span>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/5 border border-sky-400/20 flex items-center justify-center shrink-0 text-sky-600">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Corporate Email</span>
                  <span className="text-navy-800 font-bold mt-0.5 hover:text-sky-500 transition-colors">relations@kohinoorcomplex.com</span>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/5 border border-sky-400/20 flex items-center justify-center shrink-0 text-sky-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Operational Hours</span>
                  <span className="text-navy-800 font-medium mt-0.5">Monday – Friday, 09:00 AM – 06:00 PM EST</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="h-px bg-slate-200" />

          {/* Interactive stylized blueprint mini-map */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Site Access Grid</span>
            <div className="relative aspect-[16/9] w-full rounded-2xl border border-slate-200/50 bg-white shadow-inner p-4 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-radial-sky opacity-40 pointer-events-none" />
              {/* Geometric Grid Wireframe representing access road and twin towers */}
              <svg viewBox="0 0 100 50" className="w-full h-full text-slate-300 stroke-[0.8] stroke-current fill-none">
                <g className="opacity-20"><line x1="0" y1="25" x2="100" y2="25" /><line x1="50" y1="0" x2="50" y2="50" /></g>
                {/* Towers silhouettes from top down */}
                <rect x="25" y="15" width="16" height="16" rx="3" className="stroke-sky-400/60 fill-sky-500/5 hover:fill-sky-500/10 cursor-help transition-all" />
                <rect x="58" y="18" width="14" height="14" rx="3" className="stroke-sky-400/60 fill-sky-500/5 hover:fill-sky-500/10 cursor-help transition-all" />
                <path d="M41 23 H 58" strokeWidth="0.8" strokeDasharray="1 1" className="stroke-sky-500" /> {/* Bridge */}
                
                {/* Text overlays */}
                <text x="33" y="25" dominantBaseline="middle" textAnchor="middle" className="text-[3px] font-bold fill-navy-800 border-none">TOWER A</text>
                <text x="65" y="27" dominantBaseline="middle" textAnchor="middle" className="text-[3px] font-bold fill-navy-800 border-none">TOWER B</text>
                <text x="50" y="38" dominantBaseline="middle" textAnchor="middle" className="text-[2px] font-semibold fill-slate-400 border-none">Landmark Boulevard</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Side: Leasing / Relations Enquiry Form (7 Columns) */}
        <div className="lg:col-span-7">
          <div className="glass-card border border-white/60 p-8 md:p-10 rounded-3xl shadow-xl">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-12 flex flex-col items-center gap-6"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-400 to-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/20">
                    <CheckCircle2 className="w-9 h-9 stroke-[2]" />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold text-navy-900 tracking-tight">Leasing Request Logged</h3>
                    <p className="text-sm text-slate-600 max-w-sm mx-auto">
                      Thank you. Your corporate profile and requirements have been transmitted to our relations desk. An operational partner will reach out to schedule an audit.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-sky-600 font-bold uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                      Digital Submission
                    </span>
                    <h3 className="text-lg font-bold text-navy-900 tracking-tight mt-1">
                      Leasing & General Enquiry
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-extrabold text-navy-800">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Adrian Carter"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={cn(
                          "w-full px-4 py-3 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none transition-all text-slate-800",
                          errors.name ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-sky-500"
                        )}
                      />
                      {errors.name && <span className="text-[9px] text-red-500 font-medium pl-1">{errors.name}</span>}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-extrabold text-navy-800">
                        Corporate Email
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. adrian@corp.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={cn(
                          "w-full px-4 py-3 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none transition-all text-slate-800",
                          errors.email ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-sky-500"
                        )}
                      />
                      {errors.email && <span className="text-[9px] text-red-500 font-medium pl-1">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-extrabold text-navy-800">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. +1 (555) 019-2831"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl focus:bg-white focus:outline-none transition-all text-slate-800"
                      />
                    </div>

                    {/* Company */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-extrabold text-navy-800">
                        Company Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Apex Ventures"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className={cn(
                          "w-full px-4 py-3 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none transition-all text-slate-800",
                          errors.company ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-sky-500"
                        )}
                      />
                      {errors.company && <span className="text-[9px] text-red-500 font-medium pl-1">{errors.company}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tower Selection */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-extrabold text-navy-800">
                        Primary Tower of Interest
                      </label>
                      <select
                        value={formData.interest}
                        onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                        className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl focus:bg-white focus:outline-none transition-all text-slate-800"
                      >
                        <option>Tower Zenith (Leasing)</option>
                        <option>Tower Apex (Leasing)</option>
                        <option>Penthouse / Helipad Audits</option>
                        <option>General Corporate Partnerships</option>
                      </select>
                    </div>

                    {/* Space Required */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase tracking-wider font-extrabold text-navy-800">
                        Corporate Footprint Required
                      </label>
                      <select
                        value={formData.spaceRequired}
                        onChange={(e) => setFormData({ ...formData, spaceRequired: e.target.value })}
                        className="w-full px-4 py-3 text-xs bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl focus:bg-white focus:outline-none transition-all text-slate-800"
                      >
                        <option>Under 5,000 SQ FT</option>
                        <option>5,000 - 15,000 SQ FT</option>
                        <option>15,000 - 30,000 SQ FT</option>
                        <option>30,000+ SQ FT (Multiple Plates)</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-navy-800">
                      Operational Requirements & Details
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Specify mechanical, energy redundant, cooling, or office configuration specifications..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={cn(
                        "w-full px-4 py-3 text-xs bg-slate-50 border rounded-xl focus:bg-white focus:outline-none transition-all text-slate-800",
                        errors.message ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-sky-500"
                      )}
                    />
                    {errors.message && <span className="text-[9px] text-red-500 font-medium pl-1">{errors.message}</span>}
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative flex items-center justify-center gap-2 overflow-hidden w-full py-4 mt-2 rounded-xl bg-navy-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-sky-500 transition-colors shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Transmitting requirements...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 shrink-0" />
                        <span>Send Enquiries</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>

      </section>

    </div>
  );
}
