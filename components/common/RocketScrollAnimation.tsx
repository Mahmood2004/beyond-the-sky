"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function RocketScrollAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rocketY = useTransform(scrollYProgress, [0, 1], [200, -200]);
  const rocketRotate = useTransform(scrollYProgress, [0, 0.5, 1], [10, -5, -15]);
  const smoke1Opacity = useTransform(scrollYProgress, [0, 0.3], [0, 0.8]);
  const smoke2Opacity = useTransform(scrollYProgress, [0.1, 0.5], [0, 0.6]);
  const smoke1Scale = useTransform(scrollYProgress, [0, 0.5], [0.5, 2]);
  const starScale = useTransform(scrollYProgress, [0, 1], [0.8, 1.4]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        height: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background stars */}
      <motion.div style={{ scale: starScale, position: "absolute", inset: 0 }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              borderRadius: "50%",
              background: "#fff",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </motion.div>

      {/* Smoke particles */}
      <motion.div
        style={{
          position: "absolute",
          bottom: "35%",
          left: "50%",
          x: "-50%",
          opacity: smoke1Opacity,
          scale: smoke1Scale,
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(180,120,60,0.4) 0%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />
      </motion.div>

      <motion.div
        style={{
          position: "absolute",
          bottom: "32%",
          left: "52%",
          opacity: smoke2Opacity,
          scale: smoke1Scale,
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(120,80,40,0.3) 0%, transparent 70%)",
            filter: "blur(6px)",
          }}
        />
      </motion.div>

      {/* Rocket SVG */}
      <motion.div
        style={{
          y: rocketY,
          rotate: rocketRotate,
          position: "relative",
          zIndex: 2,
          filter: "drop-shadow(0 0 20px rgba(255,59,59,0.6))",
        }}
      >
        <svg width="80" height="160" viewBox="0 0 80 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main body */}
          <path
            d="M40 8 C40 8, 65 40, 65 100 C65 118, 55 128, 40 132 C25 128, 15 118, 15 100 C15 40, 40 8, 40 8Z"
            fill="url(#rocketBody)"
          />
          {/* Nose cone glow */}
          <circle cx="40" cy="20" r="8" fill="rgba(255,255,255,0.3)" filter="blur(4px)" />
          {/* Window */}
          <circle cx="40" cy="70" r="12" fill="url(#window)" />
          <circle cx="40" cy="70" r="12" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
          {/* Inner window glow */}
          <circle cx="37" cy="67" r="4" fill="rgba(255,255,255,0.2)" />
          {/* Left fin */}
          <path d="M15 110 L0 140 L22 128 Z" fill="url(#fin)" />
          {/* Right fin */}
          <path d="M65 110 L80 140 L58 128 Z" fill="url(#fin)" />
          {/* Engine glow */}
          <ellipse cx="40" cy="133" rx="16" ry="8" fill="rgba(255,100,0,0.8)" filter="blur(3px)" />
          <ellipse cx="40" cy="133" rx="10" ry="5" fill="rgba(255,200,0,0.9)" />
          {/* Exhaust flame */}
          <path
            d="M32 133 C32 133, 28 148, 40 158 C52 148, 48 133, 48 133 Z"
            fill="url(#flame)"
            opacity="0.9"
          />
          <path
            d="M35 133 C35 133, 32 145, 40 153 C48 145, 45 133, 45 133 Z"
            fill="rgba(255,220,0,0.8)"
          />

          <defs>
            <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e8e8f8" />
              <stop offset="50%" stopColor="#c0c0d8" />
              <stop offset="100%" stopColor="#9898b8" />
            </linearGradient>
            <radialGradient id="window" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#4488ff" />
              <stop offset="60%" stopColor="#1a1a3e" />
              <stop offset="100%" stopColor="#0a0a1e" />
            </radialGradient>
            <linearGradient id="fin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff3b3b" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
            <linearGradient id="flame" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#ff6800" />
              <stop offset="60%" stopColor="#ff3b3b" />
              <stop offset="100%" stopColor="rgba(217,70,239,0)" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Label */}
      <motion.div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          x: "-50%",
          opacity: useTransform(scrollYProgress, [0.3, 0.7], [0, 1]),
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-heading)",
            color: "rgba(255,255,255,0.5)",
            fontSize: "0.8rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Scroll to launch
        </p>
      </motion.div>
    </div>
  );
}
