"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/common/ScrollReveal";
import ServiceCard from "@/components/cards/ServiceCard";
import ProjectCard from "@/components/cards/ProjectCard";
import BlogCard from "@/components/cards/BlogCard";
import NewsCard from "@/components/cards/NewsCard";

const RocketScrollAnimation = dynamic(
  () => import("@/components/common/RocketScrollAnimation"),
  { ssr: false },
);
const StarField = dynamic(() => import("@/components/common/StarField"), {
  ssr: false,
});
const GalaxyButton = dynamic(() => import("@/components/common/GalaxyButton"), {
  ssr: false,
});

export default function HomeClient({
  services,
  projects,
  blogs,
  news,
}: {
  services: any[];
  projects: any[];
  blogs: any[];
  news: any[];
}) {
  return (
    <div style={{ paddingTop: "80px" }}>
      {/* ─── Hero ─── */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background:
            "radial-gradient(ellipse 100% 80% at 50% 0%, rgba(217,70,239,0.12) 0%, transparent 65%), radial-gradient(ellipse 70% 50% at 80% 60%, rgba(255,59,59,0.08) 0%, transparent 60%), #0B0B12",
          textAlign: "center",
          padding: "0 1.5rem",
        }}
      >
        <StarField count={220} />

        {/* Nebula ring decoration */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            border: "1px solid rgba(217,70,239,0.06)",
            boxShadow:
              "0 0 120px rgba(217,70,239,0.05), inset 0 0 80px rgba(255,59,59,0.03)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            border: "1px solid rgba(255,59,59,0.07)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "900px" }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span
              style={{
                display: "inline-block",
                background: "rgba(255,59,59,0.12)",
                border: "1px solid rgba(255,59,59,0.3)",
                borderRadius: "9999px",
                padding: "0.3rem 1.1rem",
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "var(--primary)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "1.5rem",
              }}
            >
              🔭 Astronomy & Space Research Center
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.5rem, 7vw, 5rem)",
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "#fff",
              marginBottom: "1.5rem",
            }}
          >
            Exploring the{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#ff3b3b,#d946ef)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Universe
            </span>
            <br />
            Beyond Sky
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            style={{
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.7,
              maxWidth: "640px",
              margin: "0 auto 2.5rem",
            }}
          >
            A world-class observatory advancing humanity's understanding of the
            cosmos through groundbreaking research, education, and public
            engagement.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <GalaxyButton href="/projects" size="md">
              Explore Research
            </GalaxyButton>
            <GalaxyButton href="/signup" size="md" variant="outline">
              Join the Observatory
            </GalaxyButton>
          </motion.div>
        </div>
      </section>

      {/* ─── Rocket Scroll Animation ─── */}
      <section
        style={{
          background: "rgba(5,5,12,0.8)",
          borderBlock: "1px solid rgba(255,255,255,0.03)",
        }}
      >
        <div className="container">
          <RocketScrollAnimation />
        </div>
      </section>

      {/* ─── About Preview ─── */}
      <section className="section-pad nebula-bg">
        <div className="container">
          <ScrollReveal>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "4rem",
                alignItems: "center",
              }}
            >
              <div>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "var(--accent)",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    marginBottom: "1rem",
                  }}
                >
                  Who We Are
                </span>
                <h2
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: "1.25rem",
                    lineHeight: 1.15,
                  }}
                >
                  Advancing Knowledge of the{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg,#ff3b3b,#d946ef)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Cosmos
                  </span>
                </h2>
                <p
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    lineHeight: 1.8,
                    fontSize: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  Founded in 2008, Beyond the Sky has grown into a premier
                  astronomy research center with a 2.4-meter telescope, a team
                  of 30+ researchers, and partnerships with leading universities
                  worldwide.
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.8,
                    fontSize: "0.9rem",
                    marginBottom: "2rem",
                  }}
                >
                  Our work spans exoplanet discovery, galactic cartography,
                  planetary defense, and space science education — all driven by
                  curiosity and a passion for sharing the universe's wonders.
                </p>
                <Link
                  href="/about"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "var(--primary)",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                  }}
                >
                  Learn More About Us <ArrowRight size={16} />
                </Link>
              </div>

              {/* Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.25rem",
                }}
              >
                {[
                  { num: "17+", label: "Years of Research" },
                  { num: "830+", label: "Discoveries Made" },
                  { num: "4,200+", label: "Students Trained" },
                  { num: "12", label: "Partner Institutions" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="glass-card"
                    style={{ padding: "1.5rem", textAlign: "center" }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "2.2rem",
                        fontWeight: 700,
                        background: "linear-gradient(135deg,#ff3b3b,#d946ef)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {stat.num}
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--muted)",
                        marginTop: "0.25rem",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Services Preview ─── */}
      <section
        className="section-pad"
        style={{ background: "rgba(8,8,16,0.95)" }}
      >
        <div className="container">
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <span
                style={{
                  display: "inline-block",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--accent)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                }}
              >
                What We Offer
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: "0.75rem",
                }}
              >
                Our Programs & Services
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.55)",
                  maxWidth: "520px",
                  margin: "0 auto",
                }}
              >
                From hands-on workshops to professional research collaborations,
                we have something for everyone passionate about space.
              </p>
            </div>
          </ScrollReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {services.slice(0, 4).map((service: any, i: number) => (
              <ScrollReveal key={service.id} delay={i * 0.1}>
                <ServiceCard service={service} />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.4}>
            <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
              <Link
                href="/services"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "var(--primary)",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                View All Services <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Featured Projects ─── */}
      <section className="section-pad nebula-bg">
        <div className="container">
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <span
                style={{
                  display: "inline-block",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--primary)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                }}
              >
                Active Research
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: "0.75rem",
                }}
              >
                Featured Research Projects
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.55)",
                  maxWidth: "520px",
                  margin: "0 auto",
                }}
              >
                Pioneering investigations at the frontier of modern astronomy.
              </p>
            </div>
          </ScrollReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {projects.slice(0, 3).map((project: any, i: number) => (
              <ScrollReveal key={project.id} delay={i * 0.1}>
                <ProjectCard project={project} />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
              <Link
                href="/projects"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "var(--primary)",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                All Research Projects <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Latest Blog ─── */}
      <section
        className="section-pad"
        style={{ background: "rgba(8,8,16,0.95)" }}
      >
        <div className="container">
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <span
                style={{
                  display: "inline-block",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--accent)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: "0.75rem",
                }}
              >
                Knowledge Hub
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: "0.75rem",
                }}
              >
                Latest Blog Articles
              </h2>
            </div>
          </ScrollReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {blogs.slice(0, 3).map((post: any, i: number) => (
              <ScrollReveal key={post.id} delay={i * 0.1}>
                <BlogCard post={post} />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
              <Link
                href="/blog"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "var(--accent)",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Read All Articles <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Latest News ─── */}
      <section className="section-pad nebula-bg">
        <div className="container">
          <ScrollReveal>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "3rem",
                alignItems: "start",
              }}
            >
              <div>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "var(--primary)",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    marginBottom: "0.75rem",
                  }}
                >
                  Latest Updates
                </span>
                <h2
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: "1rem",
                  }}
                >
                  Space News
                </h2>
                <p
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.7,
                    marginBottom: "1.5rem",
                  }}
                >
                  The latest discoveries, missions, and breakthroughs from the
                  world of astronomy and space science.
                </p>
                <Link
                  href="/news"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "var(--primary)",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  All Space News <ArrowRight size={16} />
                </Link>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {news.slice(0, 3).map((item: any, i: number) => (
                  <ScrollReveal key={item.id} delay={i * 0.1}>
                    <NewsCard news={item} />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Community CTA ─── */}
      <section
        className="section-pad"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,59,59,0.08) 0%, rgba(217,70,239,0.05) 50%, transparent 100%), rgba(5,5,12,0.98)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Mini star decoration */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 0.9, 0.2] }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
            style={{
              position: "absolute",
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              borderRadius: "50%",
              background: "#fff",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
          />
        ))}

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <ScrollReveal>
            <span
              style={{
                display: "inline-block",
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "var(--accent)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              Join Us
            </span>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 700,
                color: "#fff",
                marginBottom: "1.25rem",
              }}
            >
              Become Part of the{" "}
              <span
                style={{
                  background: "linear-gradient(135deg,#ff3b3b,#d946ef)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Observatory Community
              </span>
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                maxWidth: "580px",
                margin: "0 auto 2.5rem",
                lineHeight: 1.7,
              }}
            >
              Whether you're a curious beginner or a seasoned researcher,
              there's a place for you at Beyond the Sky. Join thousands of
              astronomy enthusiasts exploring the cosmos together.
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <GalaxyButton href="/signup" size="lg">
                Join the Observatory
              </GalaxyButton>
              <GalaxyButton href="/contact" size="lg" variant="outline">
                Get in Touch
              </GalaxyButton>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
