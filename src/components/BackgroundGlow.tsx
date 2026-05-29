"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function BackgroundGlow() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#f8fafc] pointer-events-none select-none">
      {/* Drifting Radial Glow Spheres */}
      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-sky-300/10 to-sky-400/20 blur-[100px]"
      />

      <motion.div
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 60, -40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[40%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-sky-200/10 to-sky-300/15 blur-[120px]"
      />

      <motion.div
        animate={{
          x: [0, 30, -30, 0],
          y: [0, 50, -50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-[10%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-sky-100/15 to-sky-300/10 blur-[90px]"
      />

      {/* Futuristic Grid Overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" 
        style={{
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)"
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => {
          const size = Math.random() * 4 + 2;
          const delay = Math.random() * 5;
          const duration = Math.random() * 15 + 15;
          const initialX = Math.random() * 100;
          const initialY = Math.random() * 100;

          return (
            <motion.div
              key={i}
              initial={{
                x: `${initialX}vw`,
                y: `${initialY}vh`,
                opacity: Math.random() * 0.3 + 0.1,
                scale: Math.random() * 0.8 + 0.2,
              }}
              animate={{
                y: ["0vh", "-100vh"],
                x: [
                  `${initialX}vw`,
                  `${initialX + (Math.random() * 10 - 5)}vw`,
                  `${initialX + (Math.random() * 10 - 5)}vw`
                ],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: -delay,
                ease: "linear",
              }}
              className="absolute w-2 h-2 rounded-full bg-sky-300/40 blur-[1px]"
              style={{
                width: size,
                height: size,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
