"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  size: number;
  delay: number;
  duration: number;
  initialX: number;
  initialY: number;
  initialOpacity: number;
  initialScale: number;
  animX1: number;
  animX2: number;
}

export default function BackgroundGlow() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Initialize particles on client mount if not mobile
      if (window.innerWidth >= 768) {
        const generated = Array.from({ length: 15 }, (_, i) => {
          const initialX = Math.random() * 100;
          return {
            id: i,
            size: Math.random() * 4 + 2,
            delay: Math.random() * 5,
            duration: Math.random() * 15 + 15,
            initialX,
            initialY: Math.random() * 100,
            initialOpacity: Math.random() * 0.3 + 0.1,
            initialScale: Math.random() * 0.8 + 0.2,
            animX1: initialX + (Math.random() * 10 - 5),
            animX2: initialX + (Math.random() * 10 - 5),
          };
        });
        setParticles(generated);
      }
    }, 0);

    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    window.addEventListener("resize", checkMobile);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#f8fafc] pointer-events-none select-none">
      {/* Drifting Radial Glow Spheres */}
      <motion.div
        animate={
          isMobile
            ? undefined
            : {
                x: [0, 40, -20, 0],
                y: [0, -30, 50, 0],
              }
        }
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
        className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-sky-300/10 to-sky-400/20 blur-[100px]"
      />

      <motion.div
        animate={
          isMobile
            ? undefined
            : {
                x: [0, -50, 30, 0],
                y: [0, 60, -40, 0],
              }
        }
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
        className="absolute top-[40%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-sky-200/10 to-sky-300/15 blur-[120px]"
      />

      <motion.div
        animate={
          isMobile
            ? undefined
            : {
                x: [0, 30, -30, 0],
                y: [0, 50, -50, 0],
              }
        }
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
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

      {/* Floating Particles - Disabled on Mobile for Performance */}
      {!isMobile && (
        <div className="absolute inset-0">
          {particles.map((p) => {
            return (
              <motion.div
                key={p.id}
                initial={{
                  x: `${p.initialX}vw`,
                  y: `${p.initialY}vh`,
                  opacity: p.initialOpacity,
                  scale: p.initialScale,
                }}
                animate={{
                  y: ["0vh", "-100vh"],
                  x: [
                    `${p.initialX}vw`,
                    `${p.animX1}vw`,
                    `${p.animX2}vw`
                  ],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: -p.delay,
                  ease: "linear",
                }}
                style={{
                  width: p.size,
                  height: p.size,
                  willChange: "transform",
                }}
                className="absolute w-2 h-2 rounded-full bg-sky-300/40 blur-[1px]"
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
