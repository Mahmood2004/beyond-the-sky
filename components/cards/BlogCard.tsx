"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { BlogPost } from "@/types";
import { Calendar, ArrowRight, User } from "lucide-react";

export default function BlogCard({ post }: { post: BlogPost }) {
  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      whileHover={{ y: -6 }}
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
          "rgba(217,70,239,0.25)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 16px 32px rgba(217,70,239,0.06)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Cover image */}
      <div
        style={{ height: "200px", overflow: "hidden", position: "relative" }}
      >
        <motion.img
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.5 }}
          src={post.bannerURL}
          alt={post.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(11,11,18,0.7), transparent 70%)",
          }}
        />

        {/* Category */}
        <div
          style={{
            position: "absolute",
            top: "0.75rem",
            left: "0.75rem",
            display: "flex",
            gap: "0.4rem",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: "0.65rem",
              fontWeight: 600,
              color: "rgba(255,255,255,0.9)",
              background: "rgba(217,70,239,0.35)",
              border: "1px solid rgba(217,70,239,0.4)",
              borderRadius: "9999px",
              padding: "0.15rem 0.6rem",
            }}
          >
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: "1.5rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "0.75rem",
            lineHeight: 1.3,
          }}
        >
          {post.title}
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
          {post.excerpt}
        </p>

        {/* Author + date */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <User size={13} style={{ color: "var(--accent)" }} />
            <span
              style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)" }}
            >
              {post.author.name}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Calendar size={13} style={{ color: "var(--muted)" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              {date}
            </span>
          </div>
        </div>

        <Link
          href={`/blog/${post.id}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "var(--accent)",
            textDecoration: "none",
            fontSize: "0.875rem",
            fontWeight: 600,
          }}
        >
          Read Article <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}
