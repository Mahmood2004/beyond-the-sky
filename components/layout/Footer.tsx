"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Telescope,
  Twitter,
  Youtube,
  Instagram,
  Github,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import type { Project } from "@/types";

export default function Footer() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <footer
      style={{
        background: "rgba(5,5,12,0.95)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        paddingTop: "4rem",
        paddingBottom: "2rem",
        position: "relative",
      }}
    >
      {/* Nebula top glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(255,59,59,0.4), rgba(217,70,239,0.4), transparent)",
        }}
      />

      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
            gap: "2.5rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                marginBottom: "1rem",
              }}
            >
              <Telescope size={24} style={{ color: "var(--primary)" }} />
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#fff",
                  }}
                >
                  Beyond the Sky
                </div>
                <div
                  style={{
                    fontSize: "0.6rem",
                    color: "var(--muted)",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  Astronomy Research
                </div>
              </div>
            </div>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--muted)",
                lineHeight: 1.7,
                marginBottom: "1.25rem",
              }}
            >
              A world-class astronomy research center exploring the universe,
              educating the public, and inspiring the next generation of
              stargazers.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {[Twitter, Youtube, Instagram, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.5)",
                    transition: "all 0.2s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(255,59,59,0.15)";
                    (e.currentTarget as HTMLElement).style.color =
                      "var(--primary)";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(255,59,59,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,0.05)";
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(255,255,255,0.5)";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(255,255,255,0.08)";
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#fff",
                marginBottom: "1rem",
                letterSpacing: "0.05em",
              }}
            >
              Quick Links
            </h4>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
              }}
            >
              {[
                { href: "/about", label: "About Us" },
                { href: "/services", label: "Our Services" },
                { href: "/projects", label: "Projects" },
                { href: "/blog", label: "Blog" },
                { href: "/news", label: "Space News" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      color: "var(--muted)",
                      textDecoration: "none",
                      fontSize: "0.85rem",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color = "var(--primary)")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.color = "var(--muted)")
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#fff",
                marginBottom: "1rem",
                letterSpacing: "0.05em",
              }}
            >
              Programs
            </h4>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
              }}
            >
              {projects.slice(0, 5).map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/projects/${item.id}`}
                    style={{
                      color: "var(--muted)",
                      textDecoration: "none",
                      fontSize: "0.85rem",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color = "var(--primary)")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.color = "var(--muted)")
                    }
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#fff",
                marginBottom: "1rem",
                letterSpacing: "0.05em",
              }}
            >
              Contact Us
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {[
                {
                  Icon: MapPin,
                  text: "Observatory Hill, Stargazer Valley\nAstronomy District, AZ 85260",
                },
                { Icon: Phone, text: "+1 (520) 555-0147" },
                { Icon: Mail, text: "info@beyondthesky.org" },
              ].map(({ Icon, text }, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "0.6rem",
                    alignItems: "flex-start",
                  }}
                >
                  <Icon
                    size={14}
                    style={{
                      color: "var(--primary)",
                      marginTop: "0.2rem",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--muted)",
                      lineHeight: 1.6,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
            © 2026 Beyond the Sky. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "1.25rem" }}>
            {["Privacy Policy", "Terms of Use", "Cookie Policy"].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontSize: "0.8rem",
                  color: "var(--muted)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--primary)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--muted)")
                }
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
