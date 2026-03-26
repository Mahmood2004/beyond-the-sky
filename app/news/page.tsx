import type { Metadata } from "next";
import NewsCard from "@/components/cards/NewsCard";
import ScrollReveal from "@/components/common/ScrollReveal";
const news = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news`).then(
  (res) => res.json(),
);

export const metadata: Metadata = {
  title: "Space News",
  description:
    "The latest discoveries, missions, and breakthroughs from the world of astronomy and space science.",
};

export default function NewsPage() {
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
            Latest Updates
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
            Space{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#ff3b3b,#d946ef)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              News
            </span>
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              maxWidth: "560px",
              margin: "0 auto",
              lineHeight: 1.8,
            }}
          >
            Astronomy discoveries, mission updates, and space science
            breakthroughs from around the world.
          </p>
        </ScrollReveal>
      </section>

      <section
        className="section-pad"
        style={{ background: "rgba(8,8,16,0.98)" }}
      >
        <div
          className="container"
          style={{ maxWidth: "800px", margin: "0 auto" }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {news.map((item: any, i: any) => (
              <ScrollReveal key={item.id} delay={i * 0.06}>
                <NewsCard news={item} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
