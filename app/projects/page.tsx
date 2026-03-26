import type { Metadata } from "next";
import ScrollReveal from "@/components/common/ScrollReveal";
import ProjectCard from "@/components/cards/ProjectCard";
const projects = await fetch(
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`,
).then((res) => res.json());

export const metadata: Metadata = {
  title: "Research Projects",
  description:
    "Explore our active and planned astronomy research projects: exoplanet detection, galaxy mapping, asteroid tracking, and more.",
};

export default function ProjectsPage() {
  const categories = Array.from(new Set(projects.map((p: any) => p.category)));

  return (
    <div style={{ paddingTop: "80px" }}>
      <section
        style={{
          padding: "6rem 1.5rem 4rem",
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,59,59,0.09) 0%, transparent 70%), #0B0B12",
          textAlign: "center",
        }}
      >
        <ScrollReveal>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "var(--primary)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Active Research
          </span>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "1.25rem",
            }}
          >
            Research{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#ff3b3b,#d946ef)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Projects
            </span>
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.8,
            }}
          >
            Frontier astronomy investigations conducted by our interdisciplinary
            teams using cutting-edge instruments and computational tools.
          </p>
        </ScrollReveal>
      </section>

      <section
        className="section-pad"
        style={{ background: "rgba(8,8,16,0.98)" }}
      >
        <div className="container">
          {/* Category stats */}
          <ScrollReveal>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "3rem",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  padding: "0.3rem 1rem",
                  borderRadius: "9999px",
                  background: "rgba(255,59,59,0.12)",
                  border: "1px solid rgba(255,59,59,0.3)",
                  fontSize: "0.8rem",
                  color: "var(--primary)",
                  fontWeight: 600,
                }}
              >
                All Projects ({projects.length})
              </div>
              {categories.map((cat: any) => (
                <div
                  key={cat}
                  style={{
                    padding: "0.3rem 1rem",
                    borderRadius: "9999px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  {cat} (
                  {projects.filter((p: any) => p.category === cat).length})
                </div>
              ))}
            </div>
          </ScrollReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {projects.map((project: any, i: any) => (
              <ScrollReveal key={project.id} delay={i * 0.08}>
                <ProjectCard project={project} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
