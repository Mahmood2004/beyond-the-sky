import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import ScrollReveal from "@/components/common/ScrollReveal";
import type { Metadata } from "next";
const news = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news`).then(
  (res) => res.json(),
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = news.find((n: any) => n.id === id);
  return { title: item?.title ?? "News", description: item?.excerpt };
}

export async function generateStaticParams() {
  return news.map((n: any) => ({ id: n.id }));
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = news.find((n: any) => n.id === id);
  if (!item) notFound();

  const date = new Date(item.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div style={{ paddingTop: "80px" }}>
      {item.bannerURL && (
        <section
          style={{
            position: "relative",
            height: "50vh",
            minHeight: "300px",
            overflow: "hidden",
          }}
        >
          <img
            src={item.bannerURL}
            alt=""
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
        </section>
      )}

      <section
        className="section-pad"
        style={{
          background: "rgba(8,8,16,0.98)",
          paddingTop: item.bannerURL ? "3rem" : "6rem",
        }}
      >
        <div className="container">
          <div style={{ maxWidth: "740px", margin: "0 auto" }}>
            <Link
              href="/news"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                color: "rgba(255,255,255,0.6)",
                textDecoration: "none",
                fontSize: "0.85rem",
                marginBottom: "1.5rem",
              }}
            >
              <ArrowLeft size={14} /> Back to News
            </Link>

            <ScrollReveal>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  marginBottom: "1rem",
                }}
              >
                <Calendar size={13} style={{ color: "var(--muted)" }} />
                <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                  {date}
                </span>
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1.15,
                  marginBottom: "1rem",
                }}
              >
                {item.title}
              </h1>
              <p
                style={{
                  fontSize: "1.05rem",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.7,
                  borderLeft: "3px solid var(--primary)",
                  paddingLeft: "1rem",
                  marginBottom: "2.5rem",
                }}
              >
                {item.excerpt}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div
                className="prose-space"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </ScrollReveal>

            {item.referenceURLs && (
              <p
                style={{
                  marginTop: "2rem",
                  fontSize: "0.82rem",
                  color: "var(--muted)",
                }}
              >
                Source:{" "}
                <span style={{ color: "rgba(255,255,255,0.6)" }}>
                  {item.referenceURLs.map((url: string) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--primary)", marginLeft: "0.5rem" }}
                    >
                      {url}
                      <br />
                    </a>
                  ))}
                </span>
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
