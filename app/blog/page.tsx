import type { Metadata } from "next";
import BlogCard from "@/components/cards/BlogCard";
import ScrollReveal from "@/components/common/ScrollReveal";
const blogs = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog`).then(
  (res) => res.json(),
);

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Educational astronomy articles, research insights, and space science explained by our team of expert astronomers.",
};

export default function BlogPage() {
  return (
    <div style={{ paddingTop: "80px" }}>
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
            Knowledge Hub
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
            Astronomy{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#ff3b3b,#d946ef)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Blog
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
            Accessible articles on astrophysics, cosmology, space exploration,
            and observational astronomy written by our researchers.
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
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {blogs.map((post: any, i: number) => (
              <ScrollReveal key={post.id} delay={i * 0.08}>
                <BlogCard post={post} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
