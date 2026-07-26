"use client";

import React from "react";

export default function BackgroundGlow() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-slate-50 pointer-events-none select-none">
      {/* Subtle brand ambient glows */}
      <div className="absolute -top-[10%] -left-[5%] w-[40vw] h-[40vw] rounded-full bg-sky-100/30 blur-[100px]" />
      <div className="absolute top-[40%] -right-[5%] w-[30vw] h-[30vw] rounded-full bg-slate-200/40 blur-[100px]" />
      <div className="absolute -bottom-[5%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-sky-50/40 blur-[90px]" />
    </div>
  );
}
