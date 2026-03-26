"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ScrollReveal from "@/components/common/ScrollReveal";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import dynamic from "next/dynamic";
const GalaxyButton = dynamic(() => import("@/components/common/GalaxyButton"), {
  ssr: false,
});

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

type FormData = z.infer<typeof schema>;

const contactInfo = [
  {
    Icon: MapPin,
    label: "Address",
    value: "Observatory Hill, Stargazer Valley\nAstronomy District, AZ 85260",
  },
  { Icon: Phone, label: "Phone", value: "+1 (520) 555-0147" },
  { Icon: Mail, label: "Email", value: "info@beyondthesky.org" },
  {
    Icon: Clock,
    label: "Hours",
    value: "Mon–Fri: 9am–5pm\nObs Nights: Fri & Sat 8pm–midnight",
  },
];

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/submissions/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      reset();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

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
            Get in Touch
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
            Contact{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#ff3b3b,#d946ef)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Us
            </span>
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              maxWidth: "520px",
              margin: "0 auto",
              lineHeight: 1.8,
            }}
          >
            We'd love to hear from you. Send us a message and we'll get back to
            you as soon as possible.
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
              gap: "3rem",
              alignItems: "start",
            }}
          >
            {/* Contact info */}
            <ScrollReveal>
              <div>
                <h2
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: "2rem",
                  }}
                >
                  Observatory Information
                </h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.5rem",
                  }}
                >
                  {contactInfo.map(({ Icon, label, value }) => (
                    <div
                      key={label}
                      style={{
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
                          background: "rgba(255,59,59,0.1)",
                          border: "1px solid rgba(255,59,59,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--primary)",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "0.78rem",
                            color: "var(--muted)",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            marginBottom: "0.3rem",
                          }}
                        >
                          {label}
                        </div>
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "rgba(255,255,255,0.75)",
                            lineHeight: 1.6,
                            whiteSpace: "pre-line",
                          }}
                        >
                          {value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Map placeholder */}
                <div
                  style={{
                    marginTop: "2rem",
                    borderRadius: "1rem",
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.08)",
                    height: "200px",
                    background: "linear-gradient(135deg, #0d0d2b, #1a0533)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <MapPin
                    size={32}
                    style={{ color: "var(--primary)", opacity: 0.6 }}
                  />
                  <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                    Observatory Hill, AZ
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* Form */}
            <ScrollReveal delay={0.15}>
              <div className="glass-card" style={{ padding: "2.5rem" }}>
                <h2
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: "1.75rem",
                  }}
                >
                  Send a Message
                </h2>

                {isSubmitSuccessful ? (
                  <div
                    style={{
                      background: "rgba(34,197,94,0.1)",
                      border: "1px solid rgba(34,197,94,0.3)",
                      borderRadius: "0.75rem",
                      padding: "2rem",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>
                      ✅
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 700,
                        color: "#fff",
                        fontSize: "1.1rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Message Sent!
                    </div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      Thank you for reaching out. We'll get back to you as soon
                      as possible.
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1.25rem",
                    }}
                  >
                    {[
                      {
                        id: "name",
                        label: "Full Name *",
                        placeholder: "Dr. Jane Smith",
                        type: "text",
                      },
                      {
                        id: "email",
                        label: "Email Address *",
                        placeholder: "jane@example.com",
                        type: "email",
                      },
                      {
                        id: "subject",
                        label: "Subject *",
                        placeholder: "Research collaboration inquiry",
                        type: "text",
                      },
                    ].map(({ id, label, placeholder, type }) => (
                      <div key={id}>
                        <label
                          style={{
                            display: "block",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.7)",
                            marginBottom: "0.4rem",
                          }}
                        >
                          {label}
                        </label>
                        <input
                          {...register(id as keyof FormData)}
                          type={type}
                          placeholder={placeholder}
                          style={{
                            width: "100%",
                            background: "rgba(255,255,255,0.05)",
                            border: `1px solid ${errors[id as keyof FormData] ? "var(--primary)" : "rgba(255,255,255,0.1)"}`,
                            borderRadius: "0.5rem",
                            padding: "0.7rem 1rem",
                            color: "#fff",
                            fontSize: "0.9rem",
                            outline: "none",
                            fontFamily: "var(--font-body)",
                          }}
                        />
                        {errors[id as keyof FormData] && (
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--primary)",
                              marginTop: "0.25rem",
                              display: "block",
                            }}
                          >
                            {errors[id as keyof FormData]?.message}
                          </span>
                        )}
                      </div>
                    ))}

                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.7)",
                          marginBottom: "0.4rem",
                        }}
                      >
                        Message *
                      </label>
                      <textarea
                        {...register("message")}
                        rows={6}
                        placeholder="Tell us how we can help..."
                        style={{
                          width: "100%",
                          background: "rgba(255,255,255,0.05)",
                          border: `1px solid ${errors.message ? "var(--primary)" : "rgba(255,255,255,0.1)"}`,
                          borderRadius: "0.5rem",
                          padding: "0.7rem 1rem",
                          color: "#fff",
                          fontSize: "0.9rem",
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
                      type="submit"
                      disabled={isSubmitting}
                      size="md"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </GalaxyButton>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
