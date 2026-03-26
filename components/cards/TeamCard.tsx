"use client";

import { motion } from "framer-motion";
import type { User } from "@/types";

export default function TeamCard({ member }: { member: User }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      style={{
        borderRadius: "1rem",
        overflow: "hidden",
        background: "var(--card)",
        border: "1px solid var(--border)",
        textAlign: "center",
        padding: "2rem 1.5rem",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "rgba(217,70,239,0.3)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 16px 40px rgba(217,70,239,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      <div
        style={{
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          overflow: "hidden",
          margin: "0 auto 1.25rem",
          border: "3px solid rgba(217,70,239,0.3)",
          boxShadow: "0 0 20px rgba(217,70,239,0.2)",
        }}
      >
        <img
          src={member.image}
          alt={member.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <h3
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "1rem",
          fontWeight: 700,
          color: "#fff",
          marginBottom: "0.3rem",
        }}
      >
        {member.name}
      </h3>
    </motion.div>
  );
}
