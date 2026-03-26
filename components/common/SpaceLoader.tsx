"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SpaceLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "radial-gradient(ellipse at center, #0f0022 0%, #0B0B12 70%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
          }}
        >
          {/* Stars in loader */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: Math.random() * 2 + 1, repeat: Infinity, delay: Math.random() * 2 }}
              style={{
                position: "absolute",
                width: Math.random() * 3 + 1 + "px",
                height: Math.random() * 3 + 1 + "px",
                borderRadius: "50%",
                background: "#fff",
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
              }}
            />
          ))}

          {/* Astronaut SVG */}
          <motion.div
            animate={{ y: [0, -18, 0], rotate: [-4, 4, -4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Body */}
              <ellipse cx="60" cy="75" rx="28" ry="32" fill="#e8e8f0" />
              {/* Helmet */}
              <circle cx="60" cy="42" r="28" fill="#e8e8f0" />
              {/* Visor */}
              <ellipse cx="60" cy="44" rx="18" ry="16" fill="#1a1a2e" />
              <ellipse cx="60" cy="44" rx="18" ry="16" fill="url(#visor)" />
              {/* Visor reflection */}
              <ellipse cx="52" cy="38" rx="5" ry="3" fill="rgba(255,255,255,0.2)" transform="rotate(-20 52 38)" />
              {/* Arms */}
              <ellipse cx="32" cy="72" rx="10" ry="18" fill="#d0d0e0" rx-angle="-15" />
              <ellipse cx="88" cy="72" rx="10" ry="18" fill="#d0d0e0" />
              {/* Gloves */}
              <circle cx="32" cy="88" r="8" fill="#c8c8d8" />
              <circle cx="88" cy="88" r="8" fill="#c8c8d8" />
              {/* Legs */}
              <ellipse cx="48" cy="104" rx="10" ry="14" fill="#d0d0e0" />
              <ellipse cx="72" cy="104" rx="10" ry="14" fill="#d0d0e0" />
              {/* Boots */}
              <ellipse cx="48" cy="116" rx="12" ry="6" fill="#b0b0c0" />
              <ellipse cx="72" cy="116" rx="12" ry="6" fill="#b0b0c0" />
              {/* Backpack */}
              <rect x="40" y="60" width="40" height="28" rx="6" fill="#c8c8d8" />
              {/* Chest light */}
              <circle cx="60" cy="70" r="5" fill="url(#light)" />
              {/* Stripes */}
              <rect x="32" y="68" width="3" height="12" rx="1.5" fill="var(--primary)" />
              <rect x="85" y="68" width="3" height="12" rx="1.5" fill="var(--primary)" />

              <defs>
                <radialGradient id="visor" cx="40%" cy="35%">
                  <stop offset="0%" stopColor="#2a2a5e" />
                  <stop offset="100%" stopColor="#0a0a1e" />
                </radialGradient>
                <radialGradient id="light" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#ff3b3b" stopOpacity="1" />
                  <stop offset="100%" stopColor="#d946ef" stopOpacity="0.8" />
                </radialGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Tether line */}
          <motion.div
            animate={{ scaleY: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "2px",
              height: "40px",
              background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)",
              marginTop: "-1rem",
            }}
          />

          <motion.h2
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.1rem",
              letterSpacing: "0.3em",
              color: "rgba(255,255,255,0.7)",
              textTransform: "uppercase",
            }}
          >
            Initializing...
          </motion.h2>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
