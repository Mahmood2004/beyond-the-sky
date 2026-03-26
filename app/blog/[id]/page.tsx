import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import ScrollReveal from "@/components/common/ScrollReveal";
import type { Metadata } from "next";
const blogs = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog`).then(
  (res) => res.json(),
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = blogs.find((p: any) => p.id === id);
  return { title: post?.title ?? "Blog Post", description: post?.excerpt };
}

export async function generateStaticParams() {
  return blogs.map((p: any) => ({ id: p.id }));
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = blogs.find((p: any) => p.id === id);
  if (!post) notFound();

  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div style={{ paddingTop: "80px" }}>
      {/* Hero image */}
      <section
        style={{
          position: "relative",
          height: "55vh",
          minHeight: "360px",
          overflow: "hidden",
        }}
      >
        <img
          src={post.bannerURL}
          alt={post.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(11,11,18,1) 0%, rgba(11,11,18,0.4) 70%, transparent 100%)",
          }}
        />
        <div
          className="container"
          style={{
            position: "absolute",
            bottom: "2.5rem",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Link
            href="/blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "rgba(255,255,255,0.6)",
              textDecoration: "none",
              fontSize: "0.85rem",
              marginBottom: "1rem",
            }}
          >
            <ArrowLeft size={14} /> Back to Blog
          </Link>
        </div>
      </section>

      {/* Article */}
      <section
        className="section-pad"
        style={{ background: "rgba(8,8,16,0.98)" }}
      >
        <div className="container">
          <div style={{ maxWidth: "780px", margin: "0 auto" }}>
            {/* Category */}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginBottom: "1.25rem",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: "var(--accent)",
                  background: "rgba(217,70,239,0.1)",
                  border: "1px solid rgba(217,70,239,0.2)",
                  borderRadius: "9999px",
                  padding: "0.2rem 0.7rem",
                }}
              >
                {post.category}
              </span>
            </div>

            {/* Title */}
            <ScrollReveal>
              <h1
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.8rem, 5vw, 3rem)",
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.15,
                  marginBottom: "1.5rem",
                }}
              >
                {post.title}
              </h1>

              {/* Meta */}
              <div
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  alignItems: "center",
                  marginBottom: "2.5rem",
                  paddingBottom: "1.5rem",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {post.author.image && (
                    <img
                      src={post.author.image}
                      alt={post.author.name}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        border: "2px solid rgba(217,70,239,0.3)",
                      }}
                    />
                  )}
                  <span
                    style={{
                      fontSize: "0.875rem",
                      color: "rgba(255,255,255,0.75)",
                      fontWeight: 500,
                    }}
                  >
                    {post.author.name}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <Calendar size={13} style={{ color: "var(--muted)" }} />
                  <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                    {date}
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* Content */}
            <ScrollReveal delay={0.1}>
              <div
                className="prose-space"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
