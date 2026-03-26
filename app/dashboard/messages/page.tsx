"use client";

import { useState, useEffect } from "react";
import { Mail, Clock, CheckCircle2 } from "lucide-react";
import type { Submission } from "@/types";
import { useAuth } from "@/context/AuthContext";

export default function DashboardMessagesPage() {
  const { user, hasAnyPermission } = useAuth();
  const [messages, setMessages] = useState<Submission[]>([]);
  const [selected, setSelected] = useState<Submission | null>(null);

  if (!hasAnyPermission("messages")) {
    return (
      <div
        style={{ textAlign: "center", padding: "4rem", color: "var(--muted)" }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔒</div>
        <p>You don't have permission to manage messages.</p>
      </div>
    );
  }

  const unread = messages.filter((m) => !m.isRead).length;

  const markRead = async (id: string) => {
    try {
      const res = await fetch(`/api/submissions/${id}/read`, {
        method: "PATCH",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to mark as read");
      }

      const updated = await res.json();

      setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)));
    } catch (err) {
      console.error("Mark read failed:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/submissions");
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "#fff",
          }}
        >
          Contact Messages
        </h1>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "0.875rem",
            marginTop: "0.25rem",
          }}
        >
          {messages.length} total ·{" "}
          <span style={{ color: "var(--primary)" }}>{unread} unread</span>
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr clamp(300px, 40%, 480px)",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        {/* List */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            maxHeight: "calc(100vh - 150px)",
            overflowY: "auto",
          }}
        >
          {user?.permissions.includes("submission.update") ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelected(msg);
                  markRead(msg.id);
                }}
                className="glass-card"
                style={{
                  padding: "1.25rem",
                  cursor: "pointer",
                  borderColor:
                    selected?.id === msg.id
                      ? "rgba(255,59,59,0.3)"
                      : "var(--border)",
                  background: !msg.isRead
                    ? "rgba(255,59,59,0.04)"
                    : "var(--card)",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "0.4rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {!msg.isRead && (
                      <span
                        style={{
                          width: "7px",
                          height: "7px",
                          borderRadius: "50%",
                          background: "var(--primary)",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <span
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: !msg.isRead ? 700 : 500,
                        color: "#fff",
                      }}
                    >
                      {msg.name}
                    </span>
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.7)",
                    marginBottom: "0.3rem",
                  }}
                >
                  {msg.subject}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--muted)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {msg.message}
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "4rem",
                color: "var(--muted)",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔒</div>
              <p>You don't have permission to manage messages.</p>
            </div>
          )}
        </div>
        {/* Detail */}
        {selected ? (
          <div
            className="glass-card"
            style={{ padding: "1.75rem", position: "sticky", top: "1rem" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg,rgba(255,59,59,0.3),rgba(217,70,239,0.2))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--primary)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    fontSize: "1rem",
                  }}
                >
                  {selected.name[0]}
                </span>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {selected.name}
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                  {selected.email}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--muted)",
                  marginBottom: "0.25rem",
                }}
              >
                Subject
              </div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff" }}>
                {selected.subject}
              </div>
            </div>

            <div
              style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.78rem",
                  color: "var(--muted)",
                }}
              >
                <Clock size={12} />
                {new Date(selected.createdAt).toLocaleString()}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.78rem",
                  color: "#22c55e",
                }}
              >
                <CheckCircle2 size={12} />
                Read
              </div>
            </div>

            <div
              style={{
                padding: "1.25rem",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "0.5rem",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                }}
              >
                {selected.message}
              </p>
            </div>

            <a
              href={`mailto:${selected.email}?subject=Reply to: ${selected.subject}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "1.25rem",
                background: "linear-gradient(135deg,#ff3b3b,#d946ef)",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "9999px",
                padding: "0.55rem 1.25rem",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              <Mail size={14} /> Reply via Email
            </a>
          </div>
        ) : (
          <div
            className="glass-card"
            style={{
              padding: "3rem",
              textAlign: "center",
              color: "var(--muted)",
            }}
          >
            <Mail
              size={32}
              style={{ margin: "0 auto 0.75rem", opacity: 0.4 }}
            />
            <p style={{ fontSize: "0.875rem" }}>Select a message to view it</p>
          </div>
        )}
      </div>
    </div>
  );
}
