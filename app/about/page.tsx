import type { Metadata } from "next";
import {
  Star,
  Globe2,
  Microscope,
  Satellite,
  FlaskConical,
  BookOpen,
} from "lucide-react";
import ScrollReveal from "@/components/common/ScrollReveal";
import TeamCard from "@/components/cards/TeamCard";

const users = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`).then(
  (res) => res.json(),
);
const teamMember = users.filter(
  (teamMember: any) => teamMember.role !== "VISITOR",
);

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Beyond the Sky's mission, vision, research fields, observatory facilities, and our expert team.",
};

const researchFields = [
  {
    icon: Star,
    title: "Astrophysics",
    description:
      "Probing the physics of stars, stellar remnants, black holes, and neutron stars.",
  },
  {
    icon: Globe2,
    title: "Planetary Science",
    description:
      "Studying planets, moons, and small bodies across our solar system and beyond.",
  },
  {
    icon: Microscope,
    title: "Astrobiology",
    description:
      "Searching for conditions and signatures of life beyond Earth.",
  },
  {
    icon: Satellite,
    title: "Observational Cosmology",
    description:
      "Mapping the large-scale structure and evolution of the universe.",
  },
  {
    icon: FlaskConical,
    title: "Instrumentation",
    description:
      "Designing next-generation detectors and telescopes for deeper sky surveys.",
  },
  {
    icon: BookOpen,
    title: "Science Education",
    description:
      "Making astronomy accessible and inspiring through public outreach.",
  },
];

const facilities = [
  {
    title: "2.4-metre Primary Telescope",
    description:
      "Computer-controlled optical telescope with CCD photometer and spectrograph.",
  },
  {
    title: "Radio Dish Array",
    description:
      "Four 5-metre dishes operating at 1.4 GHz for HI and pulsar observations.",
  },
  {
    title: "Astrophotography Suite",
    description:
      "Dedicated imaging setup with narrowband filters for deep-sky imaging.",
  },
  {
    title: "Data Science Laboratory",
    description:
      "GPU cluster for processing petabyte-scale survey datasets and ML pipelines.",
  },
  {
    title: "Public Planetarium",
    description:
      "60-seat digital dome projector for immersive public outreach programmes.",
  },
  {
    title: "Visitor Centre",
    description:
      "Exhibition gallery and dark-sky terrace open to the public on weekends.",
  },
];

export default function AboutPage() {
  return (
    <div style={{ paddingTop: "80px" }}>
      {/* Hero */}
      <section
        style={{
          padding: "6rem 1.5rem 4rem",
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(217,70,239,0.1) 0%, transparent 70%), #0B0B12",
          textAlign: "center",
        }}
      >
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
            Our Story
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
            About{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#ff3b3b,#d946ef)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Beyond the Sky
            </span>
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              maxWidth: "640px",
              margin: "0 auto",
              lineHeight: 1.8,
              fontSize: "1.05rem",
            }}
          >
            Since 2008, we have been dedicated to exploring the cosmos,
            advancing scientific discovery, and inspiring the next generation of
            astronomers and space scientists.
          </p>
        </ScrollReveal>
      </section>

      {/* Mission & Vision */}
      <section
        className="section-pad"
        style={{ background: "rgba(8,8,16,0.95)" }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))",
              gap: "2rem",
            }}
          >
            {[
              {
                label: "Our Mission",
                color: "var(--primary)",
                text: "To push the boundaries of human knowledge through rigorous astronomical research, and to make that knowledge accessible to everyone—from schoolchildren to seasoned scientists.",
              },
              {
                label: "Our Vision",
                color: "var(--accent)",
                text: "A world where every person, regardless of where they are on Earth, can look up at the night sky and understand their place in the vast cosmic tapestry—and be inspired to protect it.",
              },
              {
                label: "Our Values",
                color: "#3b82f6",
                text: "Scientific rigour, intellectual curiosity, openness and transparency, public accountability, and an unshakeable belief that the universe belongs to everyone.",
              },
            ].map((item) => (
              <ScrollReveal key={item.label}>
                <div
                  className="glass-card"
                  style={{
                    padding: "2rem",
                    height: "100%",
                    borderTop: `3px solid ${item.color}`,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      color: "#fff",
                      marginBottom: "1rem",
                    }}
                  >
                    {item.label}
                  </h3>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.65)",
                      lineHeight: 1.8,
                      fontSize: "0.9rem",
                    }}
                  >
                    {item.text}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Research Fields */}
      <section className="section-pad nebula-bg">
        <div className="container">
          <ScrollReveal>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                fontWeight: 700,
                color: "#fff",
                textAlign: "center",
                marginBottom: "0.75rem",
              }}
            >
              Research Fields
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                textAlign: "center",
                maxWidth: "480px",
                margin: "0 auto 3rem",
              }}
            >
              Our multidisciplinary teams span six core areas of modern
              astronomy and space science.
            </p>
          </ScrollReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {researchFields.map((field, i) => (
              <ScrollReveal key={field.title} delay={i * 0.08}>
                <div
                  className="glass-card"
                  style={{
                    padding: "1.75rem",
                    display: "flex",
                    gap: "1rem",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg,rgba(255,59,59,0.2),rgba(217,70,239,0.15))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--primary)",
                      flexShrink: 0,
                    }}
                  >
                    <field.icon size={20} />
                  </div>
                  <div>
                    <h4
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "0.98rem",
                        fontWeight: 700,
                        color: "#fff",
                        marginBottom: "0.4rem",
                      }}
                    >
                      {field.title}
                    </h4>
                    <p
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--muted)",
                        lineHeight: 1.6,
                      }}
                    >
                      {field.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Observatory Facilities */}
      <section
        className="section-pad"
        style={{ background: "rgba(8,8,16,0.95)" }}
      >
        <div className="container">
          <ScrollReveal>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                fontWeight: 700,
                color: "#fff",
                textAlign: "center",
                marginBottom: "0.75rem",
              }}
            >
              Our Facilities
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                textAlign: "center",
                maxWidth: "480px",
                margin: "0 auto 3rem",
              }}
            >
              State-of-the-art equipment enabling research at the cutting edge
              of modern astronomy.
            </p>
          </ScrollReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {facilities.map((facility, i) => (
              <ScrollReveal key={facility.title} delay={i * 0.08}>
                <div className="glass-card" style={{ padding: "1.75rem" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "3px",
                      background:
                        "linear-gradient(90deg,var(--primary),var(--accent))",
                      borderRadius: "2px",
                      marginBottom: "1rem",
                    }}
                  />
                  <h4
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#fff",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {facility.title}
                  </h4>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--muted)",
                      lineHeight: 1.6,
                    }}
                  >
                    {facility.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-pad nebula-bg">
        <div className="container">
          <ScrollReveal>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                fontWeight: 700,
                color: "#fff",
                textAlign: "center",
                marginBottom: "0.75rem",
              }}
            >
              Meet the Team
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                textAlign: "center",
                maxWidth: "480px",
                margin: "0 auto 3rem",
              }}
            >
              World-class researchers, science communicators, and engineers
              united by a love of the universe.
            </p>
          </ScrollReveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {teamMember.map((member: any, i: number) => (
              <ScrollReveal key={member.id} delay={i * 0.08}>
                <TeamCard member={member} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
