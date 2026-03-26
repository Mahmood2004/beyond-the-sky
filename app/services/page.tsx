import type { Metadata } from "next";
import ScrollReveal from "@/components/common/ScrollReveal";
import ServiceCard from "@/components/cards/ServiceCard";
import dynamic from "next/dynamic";
const GalaxyButton = dynamic(() => import("@/components/common/GalaxyButton"), {
  ssr: false,
});
const services = await fetch(
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/services`,
).then((res) => res.json());

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore our astronomy programs: workshops, telescope nights, astrophotography training, space education, and research collaborations.",
};

export default function ServicesPage() {
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
            What We Offer
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
            Programs &{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#ff3b3b,#d946ef)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Services
            </span>
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.8,
              fontSize: "1.05rem",
            }}
          >
            From beginner-friendly observation nights to advanced research
            collaborations, we offer world-class astronomy experiences for all
            levels of curiosity and expertise.
          </p>
        </ScrollReveal>
      </section>

      <section
        className="section-pad"
        style={{ background: "rgba(8,8,16,0.98)" }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {services.map((service: any, i: number) => (
              <ScrollReveal key={service.id} delay={i * 0.08}>
                <ServiceCard service={service} />
              </ScrollReveal>
            ))}
          </div>

          {/* CTA after list */}
          <ScrollReveal delay={0.4}>
            <div
              className="glass-card"
              style={{
                marginTop: "4rem",
                padding: "3rem",
                textAlign: "center",
                background:
                  "radial-gradient(ellipse at center, rgba(255,59,59,0.07) 0%, transparent 70%)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: "0.75rem",
                }}
              >
                Ready to Join?
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: "2rem",
                  maxWidth: "480px",
                  margin: "0 auto 2rem",
                }}
              >
                Sign up to get notified about upcoming events, reserve your
                place in workshops, and connect with our research teams.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <GalaxyButton href="/signup">
                  Register Your Interest
                </GalaxyButton>
                <GalaxyButton href="/contact" variant="outline">
                  Contact Our Team
                </GalaxyButton>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
