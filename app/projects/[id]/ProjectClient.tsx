"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Tag, CheckCircle2, Code2 } from "lucide-react";
import ScrollReveal from "@/components/common/ScrollReveal";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
const GalaxyButton = dynamic(() => import("@/components/common/GalaxyButton"), {
  ssr: false,
});

const schema = z.object({
  message: z
    .string()
    .min(20, "Please write at least 20 characters explaining your interest."),
});

type FormData = z.infer<typeof schema>;

const statusColors: Record<string, string> = {
  ACTIVE: "#22c55e",
  COMPLETED: "#3b82f6",
  PLANNED: "#f59e0b",
};

export default function ProjectClient({ project }: { project: any }) {
  const { user } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/submissions/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          projectId: project.id,
          subject: `Interest in ${project.title}`,
          message: data.message,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit request");
      }

      reset();
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ paddingTop: "80px" }}>
      {/* Hero banner */}
      <section
        style={{
          position: "relative",
          height: "60vh",
          minHeight: "400px",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <motion.img
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2 }}
          src={project.bannerURL}
          alt={project.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(11,11,18,1) 0%, rgba(11,11,18,0.5) 60%, transparent 100%)",
          }}
        />
        <div
          className="container"
          style={{ position: "relative", zIndex: 1, paddingBottom: "2.5rem" }}
        >
          <Link
            href="/projects"
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
            <ArrowLeft size={14} /> Back to Projects
          </Link>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.75rem",
            }}
          >
            <Tag size={13} style={{ color: "var(--accent)" }} />
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--accent)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {project.category}
            </span>
            <span
              style={{
                marginLeft: "0.5rem",
                fontSize: "0.7rem",
                fontWeight: 600,
                color: statusColors[project.status],
                background: "rgba(11,11,18,0.7)",
                border: `1px solid ${statusColors[project.status]}40`,
                borderRadius: "9999px",
                padding: "0.15rem 0.6rem",
                textTransform: "capitalize",
              }}
            >
              {project.status}
            </span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem, 5vw, 3.2rem)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.1,
            }}
          >
            {project.title}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section
        className="section-pad"
        style={{ background: "rgba(8,8,16,0.98)" }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr clamp(280px,30%,380px)",
              gap: "3rem",
              alignItems: "start",
            }}
          >
            {/* Main content */}
            <div>
              <ScrollReveal>
                <div
                  className="prose-space"
                  dangerouslySetInnerHTML={{ __html: project.content }}
                />
              </ScrollReveal>

              {/* Objectives */}
              <ScrollReveal delay={0.1}>
                <div style={{ marginTop: "2.5rem" }}>
                  <h2
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      color: "#fff",
                      marginBottom: "1.25rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                    }}
                  >
                    <CheckCircle2
                      size={20}
                      style={{ color: "var(--primary)" }}
                    />{" "}
                    Research Objectives
                  </h2>
                  <ul
                    style={{
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                    }}
                  >
                    {project.objectives.map((obj: any, i: any) => (
                      <li
                        key={i}
                        style={{
                          display: "flex",
                          gap: "0.75rem",
                          alignItems: "flex-start",
                        }}
                      >
                        <span
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            background: "rgba(255,59,59,0.15)",
                            border: "1px solid rgba(255,59,59,0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            marginTop: "0.1rem",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: "var(--primary)",
                          }}
                        >
                          {i + 1}
                        </span>
                        <span
                          style={{
                            color: "rgba(255,255,255,0.75)",
                            lineHeight: 1.6,
                            fontSize: "0.92rem",
                          }}
                        >
                          {obj}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              {/* Technologies */}
              <ScrollReveal delay={0.15}>
                <div style={{ marginTop: "2.5rem" }}>
                  <h2
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      color: "#fff",
                      marginBottom: "1.25rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                    }}
                  >
                    <Code2 size={20} style={{ color: "var(--accent)" }} />{" "}
                    Technologies & Methods
                  </h2>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}
                  >
                    {project.techStack.map((tech: any) => (
                      <span
                        key={tech}
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "var(--accent)",
                          background: "rgba(217,70,239,0.1)",
                          border: "1px solid rgba(217,70,239,0.25)",
                          borderRadius: "6px",
                          padding: "0.3rem 0.75rem",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Gallery */}
              {/* {project.gallery.length > 0 && (
                <ScrollReveal delay={0.2}>
                  <div style={{ marginTop: "2.5rem" }}>
                    <h2
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "1.4rem",
                        fontWeight: 700,
                        color: "#fff",
                        marginBottom: "1.25rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                      }}
                    >
                      <ImageIcon
                        size={20}
                        style={{ color: "var(--primary)" }}
                      />{" "}
                      Image Gallery
                    </h2>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px,1fr))",
                        gap: "0.75rem",
                      }}
                    >
                      {project.gallery.map((img: any, i: any) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.03 }}
                          style={{
                            borderRadius: "0.75rem",
                            overflow: "hidden",
                            aspectRatio: "16/10",
                          }}
                        >
                          <img
                            src={img}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )} */}
            </div>

            {/* Sidebar – Participation Form */}
            <ScrollReveal>
              <div
                className="glass-card"
                style={{ padding: "2rem", position: "sticky", top: "6rem" }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: "0.5rem",
                  }}
                >
                  Express Interest
                </h3>
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--muted)",
                    marginBottom: "1.5rem",
                    lineHeight: 1.6,
                  }}
                >
                  Interested in contributing to this project? Tell us how you
                  can help and we'll be in touch.
                </p>

                {!user && (
                  <div
                    style={{
                      background: "rgba(255,59,59,0.08)",
                      border: "1px solid rgba(255,59,59,0.2)",
                      borderRadius: "0.6rem",
                      padding: "1rem",
                      marginBottom: "1.25rem",
                      fontSize: "0.82rem",
                      color: "rgba(255,255,255,0.7)",
                      lineHeight: 1.6,
                    }}
                  >
                    🔒 You must be logged in to submit a participation request.{" "}
                    <Link
                      href="/login"
                      style={{ color: "var(--primary)", fontWeight: 600 }}
                    >
                      Log in
                    </Link>
                  </div>
                )}

                {project.status === "COMPLETED" ? (
                  <div
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "0.6rem",
                      padding: "1.5rem",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                      🚫
                    </div>

                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 700,
                        color: "#fff",
                        marginBottom: "0.4rem",
                      }}
                    >
                      Project Completed
                    </div>

                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--muted)",
                        lineHeight: 1.6,
                      }}
                    >
                      This project is no longer accepting participation
                      requests. You can explore other active projects instead.
                    </div>
                  </div>
                ) : !isSubmitSuccessful ? (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {user && (
                      <div style={{ marginBottom: "1rem" }}>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "rgba(255,255,255,0.5)",
                            marginBottom: "0.25rem",
                          }}
                        >
                          Submitting as
                        </div>
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "#fff",
                            fontWeight: 600,
                          }}
                        >
                          {user.name}
                        </div>
                        <div
                          style={{ fontSize: "0.78rem", color: "var(--muted)" }}
                        >
                          {user.email}
                        </div>
                      </div>
                    )}

                    <div style={{ marginBottom: "1.25rem" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.7)",
                          marginBottom: "0.4rem",
                        }}
                      >
                        Your Message *
                      </label>
                      <textarea
                        {...register("message")}
                        disabled={!user}
                        rows={5}
                        placeholder="Describe your background and how you'd like to contribute..."
                        style={{
                          width: "100%",
                          background: "rgba(255,255,255,0.05)",
                          border: `1px solid ${errors.message ? "var(--primary)" : "rgba(255,255,255,0.1)"}`,
                          borderRadius: "0.5rem",
                          padding: "0.75rem",
                          color: "#fff",
                          fontSize: "0.85rem",
                          resize: "vertical",
                          outline: "none",
                          lineHeight: 1.6,
                          fontFamily: "var(--font-body)",
                        }}
                      />
                      {errors.message && (
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--primary)",
                            marginTop: "0.25rem",
                            display: "block",
                          }}
                        >
                          {errors.message.message}
                        </span>
                      )}
                    </div>

                    <GalaxyButton
                      type={user ? "submit" : "button"}
                      onClick={!user ? () => router.push("/login") : undefined}
                      disabled={isSubmitting}
                      size="sm"
                    >
                      {isSubmitting
                        ? "Submitting..."
                        : user
                          ? "Submit Request"
                          : "Log in to Submit"}
                    </GalaxyButton>
                  </form>
                ) : (
                  <div
                    style={{
                      background: "rgba(34,197,94,0.1)",
                      border: "1px solid rgba(34,197,94,0.3)",
                      borderRadius: "0.6rem",
                      padding: "1.25rem",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                      ✅
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 700,
                        color: "#fff",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Request Sent!
                    </div>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      We'll review your interest and get back to you shortly.
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
