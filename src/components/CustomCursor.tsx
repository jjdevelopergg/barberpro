"use client";

import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;
    let animating = false;

    const ease = 0.07; // Lower = slower/smoother scroll

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetScroll += e.deltaY * 0.8;
      targetScroll = Math.max(0, Math.min(targetScroll, document.body.scrollHeight - window.innerHeight));

      if (!animating) {
        animating = true;
        animate();
      }
    };

    const animate = () => {
      currentScroll += (targetScroll - currentScroll) * ease;

      if (Math.abs(targetScroll - currentScroll) < 0.5) {
        currentScroll = targetScroll;
        window.scrollTo(0, currentScroll);
        animating = false;
        return;
      }

      window.scrollTo(0, currentScroll);
      requestAnimationFrame(animate);
    };

    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
    };
  }, []);

  return null;
}
