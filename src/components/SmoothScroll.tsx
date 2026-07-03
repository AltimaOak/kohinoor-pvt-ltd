"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only run on client-side and when not inside an iframe/admin view if necessary
    // (but running it globally is fine)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2, // normal touch response on mobile
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Store in window for global access if needed
    (window as unknown as { lenis: Lenis | null }).lenis = lenis;

    return () => {
      lenis.destroy();
      (window as unknown as { lenis: Lenis | null }).lenis = null;
    };
  }, []);

  return <>{children}</>;
}
