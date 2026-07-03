"use client";

import React from "react";

export default function BackgroundGlow() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#f8fafc] pointer-events-none select-none">
      {/* Subtle brand ambient glows */}
      <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-sky-200/15 blur-[120px]" />
      <div className="absolute top-[35%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-slate-200/20 blur-[130px]" />
      <div className="absolute -bottom-[10%] left-[10%] w-[45vw] h-[45vw] rounded-full bg-sky-100/20 blur-[110px]" />
    </div>
  );
}
