"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { NewsItem } from "@/types";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";

export default function NewsCard({ news }: { news: NewsItem }) {
  const date = new Date(news.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ duration: 0.25 }}
      style={{
        display: "flex",
        gap: "1rem",
        padding: "1.25rem",
        borderRadius: "0.75rem",
        background: "var(--card)",
        border: "1px solid var(--border)",
        transition: "border-color 0.2s, box-shadow 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "rgba(255,59,59,0.2)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 8px 24px rgba(255,59,59,0.05)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {/* Image or icon */}
      {news.bannerURL ? (
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "0.5rem",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <img
            src={news.bannerURL}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      ) : (
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: "rgba(255,59,59,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: "var(--primary)",
          }}
        >
          <Newspaper size={20} />
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <h4
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "0.95rem",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "0.4rem",
            lineHeight: 1.3,
          }}
        >
          {news.title}
        </h4>
        <p
          style={{
            fontSize: "0.8rem",
            color: "var(--muted)",
            lineHeight: 1.6,
            marginBottom: "0.6rem",
          }}
        >
          {news.excerpt}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
          >
            <Calendar size={11} style={{ color: "var(--muted)" }} />
            <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
              {date}
            </span>
          </div>
          <Link
            href={`/news/${news.id}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              color: "var(--primary)",
              textDecoration: "none",
              fontSize: "0.78rem",
              fontWeight: 600,
            }}
          >
            Read more <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
