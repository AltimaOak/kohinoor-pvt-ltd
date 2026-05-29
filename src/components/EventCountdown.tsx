"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, Bell, Share2 } from "lucide-react";

export default function EventCountdown() {
  const [days, setDays] = useState("45");
  const [hours, setHours] = useState("18");
  const [minutes, setMinutes] = useState("32");
  const [seconds, setSeconds] = useState("09");

  useEffect(() => {
   
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 45);
    targetDate.setHours(targetDate.getHours() + 18);
    targetDate.setMinutes(targetDate.getMinutes() + 32);

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        // Reset/Loop countdown for demo integrity
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setDays(d.toString().padStart(2, "0"));
      setHours(h.toString().padStart(2, "0"));
      setMinutes(m.toString().padStart(2, "0"));
      setSeconds(s.toString().padStart(2, "0"));
    };

    const interval = setInterval(updateTimer, 1000);
    updateTimer(); // Initial run

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full relative overflow-hidden rounded-3xl border border-white/60 glass-card p-8 md:p-10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-8">
      {/* Decorative ambient blur highlight */}
      <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-sky-200/10 blur-[60px] pointer-events-none" />

      {/* Info Column (Left) */}
      <div className="flex flex-col gap-4 max-w-sm relative z-10">
        <div className="flex items-center gap-2 text-sky-600 font-bold uppercase tracking-widest text-xs">
          <Clock className="w-4 h-4 text-sky-400" />
          <span>Live Countdown</span>
        </div>
        
        <h3 className="text-xl font-bold tracking-tight text-navy-900 leading-tight">
          Kohinoor Annual Business & Tech Summit
        </h3>
        
        <p className="text-slate-600 text-sm leading-relaxed">
          Join global tech founders, venture capitalists, and commercial executives inside Tower Zenith&apos;s Grand Atrium. Agenda includes AI keynote speeches and corporate mixers.
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 mt-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/40 shadow-sm text-navy-800">
            <Calendar className="w-3.5 h-3.5 text-sky-500" />
            <span>October 12, 2026</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/40 shadow-sm text-navy-800">
            <Clock className="w-3.5 h-3.5 text-sky-500" />
            <span>09:00 AM EST</span>
          </div>
        </div>
      </div>

      {/* Digit Grid Column (Right) */}
      <div className="flex items-center gap-3 relative z-10 shrink-0 select-none">
        {[
          { num: days, label: "Days" },
          { num: hours, label: "Hours" },
          { num: minutes, label: "Min" },
          { num: seconds, label: "Sec", highlight: true },
        ].map((block, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="relative flex items-center justify-center w-16 md:w-20 aspect-[1/1.1] rounded-2xl bg-navy-900 shadow-md shadow-navy-950/20 overflow-hidden border border-white/5">
              {/* Central split line simulating physical flip clocks */}
              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-navy-950/60 z-20" />
              
              <span className={`text-2xl md:text-3xl font-black tracking-tighter ${block.highlight ? 'text-sky-400' : 'text-white'}`}>
                {block.num}
              </span>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              {block.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
