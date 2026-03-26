"use client";

import { motion } from "framer-motion";
import type { Service } from "@/types";
import { Telescope, Moon, Camera, GraduationCap, Building2, FlaskConical } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  telescope: <Telescope size={28} />,
  moon: <Moon size={28} />,
  camera: <Camera size={28} />,
  "graduation-cap": <GraduationCap size={28} />,
  "building-2": <Building2 size={28} />,
  "flask-conical": <FlaskConical size={28} />,
};

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="glass-card"
      style={{ padding: "2rem", height: "100%", cursor: "default" }}
    >
      <motion.div
        whileHover={{ scale: 1.15, rotate: 5 }}
        transition={{ duration: 0.3 }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "60px",
          height: "60px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, rgba(255,59,59,0.2), rgba(217,70,239,0.15))",
          color: "var(--primary)",
          marginBottom: "1.25rem",
          border: "1px solid rgba(255,59,59,0.2)",
        }}
      >
        {iconMap[service.icon] || <Telescope size={28} />}
      </motion.div>

      <h3
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "1.15rem",
          fontWeight: 700,
          color: "#fff",
          marginBottom: "0.75rem",
        }}
      >
        {service.title}
      </h3>

      <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
        {service.description}
      </p>

      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {service.features.map((f, i) => (
          <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
            {f}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
