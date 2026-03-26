"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/types";
import { ArrowRight, Tag } from "lucide-react";

const statusColors: Record<string, string> = {
  ACTIVE: "#22c55e",
  COMPLETED: "#3b82f6",
  PLANNED: "#f59e0b",
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      style={{
        borderRadius: "1rem",
        overflow: "hidden",
        background: "var(--card)",
        border: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "rgba(255,59,59,0.25)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 20px 40px rgba(255,59,59,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Image */}
      <div
        style={{ position: "relative", height: "200px", overflow: "hidden" }}
      >
        <motion.img
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.5 }}
          src={project.bannerURL}
          alt={project.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* Overlay gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(11,11,18,0.8) 0%, transparent 60%)",
          }}
        />
        {/* Status badge */}
        <div
          style={{
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
            background: "rgba(11,11,18,0.85)",
            border: `1px solid ${statusColors[project.status]}40`,
            borderRadius: "20px",
            padding: "0.2rem 0.7rem",
            fontSize: "0.7rem",
            fontWeight: 600,
            color: statusColors[project.status],
            textTransform: "capitalize",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: statusColors[project.status],
            }}
          />
          {project.status}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            marginBottom: "0.6rem",
          }}
        >
          <Tag size={12} style={{ color: "var(--accent)" }} />
          <span
            style={{
              fontSize: "0.72rem",
              color: "var(--accent)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {project.category}
          </span>
        </div>

        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "0.75rem",
          }}
        >
          {project.title}
        </h3>

        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--muted)",
            lineHeight: 1.7,
            flex: 1,
            marginBottom: "1.25rem",
          }}
        >
          {project.excerpt}
        </p>

        <Link
          href={`/projects/${project.id}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "var(--primary)",
            textDecoration: "none",
            fontSize: "0.875rem",
            fontWeight: 600,
            transition: "gap 0.2s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.gap = "0.7rem")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.gap = "0.4rem")
          }
        >
          View Project <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}
