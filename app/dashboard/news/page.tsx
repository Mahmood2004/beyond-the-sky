"use client";

import { useState, useEffect } from "react";
import type { NewsItem } from "@/types";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import dynamic from "next/dynamic";
const GalaxyButton = dynamic(() => import("@/components/common/GalaxyButton"), {
  ssr: false,
});

const emptyNews: Partial<NewsItem> = {
  title: "",
  excerpt: "",
  content: "",
  bannerURL: "",
  referenceURLs: [],
};

export default function DashboardNewsPage() {
  const { user, hasAnyPermission } = useAuth();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [editing, setEditing] = useState<Partial<NewsItem> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!hasAnyPermission("news")) {
    return (
      <div
        style={{ textAlign: "center", padding: "4rem", color: "var(--muted)" }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔒</div>
        <p>You don't have permission to manage news.</p>
      </div>
    );
  }

  const handleSave = async () => {
    if (!editing) return;
    const isEmpty = (val?: string) => !val || !val.trim();

    if (
      isEmpty(editing.title) ||
      isEmpty(editing.excerpt) ||
      isEmpty(editing.content) ||
      isEmpty(editing.bannerURL)
    ) {
      alert("Please fill all required fields");
      return;
    }

    const cleanArray = (arr?: string[]) =>
      arr?.map((item) => item.trim()).filter(Boolean) || [];

    const cleanedReferenceURLs = cleanArray(editing.referenceURLs);

    if (!cleanedReferenceURLs.length) {
      alert("Add at least one reference URL");
      return;
    }

    try {
      setSaving(true);
      if (isNew) {
        const res = await fetch("/api/news", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title: editing.title ?? "",
            excerpt: editing.excerpt ?? "",
            content: editing.content ?? "",
            bannerURL: editing.bannerURL ?? "",
            referenceURLs: cleanedReferenceURLs,
          }),
        });

        if (!res.ok) throw new Error("Failed to create news");

        const newNews = await res.json();

        setNews((prev: any) => [newNews, ...prev]);
      } else {
        const res = await fetch(`/api/news/${editing.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title: editing.title ?? "",
            excerpt: editing.excerpt ?? "",
            content: editing.content ?? "",
            bannerURL: editing.bannerURL ?? "",
            referenceURLs: cleanedReferenceURLs,
          }),
        });

        if (!res.ok) throw new Error("Failed to update news");

        const updatedNews = await res.json();

        setNews((prev: any) =>
          prev.map((p: any) => (p.id === updatedNews.id ? updatedNews : p)),
        );
      }

      setEditing(null);
      setIsNew(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setNews((prev) => prev.filter((p: any) => p.id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/news");
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            News
          </h1>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "0.875rem",
              marginTop: "0.25rem",
            }}
          >
            {news.length} News
          </p>
        </div>
        <GalaxyButton
          size="sm"
          onClick={() => {
            setEditing({ ...emptyNews });
            setIsNew(true);
          }}
          disabled={!user?.permissions.includes("news.create")}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Plus size={14} style={{ marginRight: "0.35rem" }} /> New Item
          </div>
        </GalaxyButton>
      </div>

      <div className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Title", "Date", "Actions"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "1rem 1.25rem",
                    textAlign: "left",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr
                key={item.id}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#fff",
                      maxWidth: "340px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--muted)",
                      marginTop: "0.1rem",
                      maxWidth: "340px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.content}
                  </div>
                </td>
                <td
                  style={{
                    padding: "1rem 1.25rem",
                    fontSize: "0.82rem",
                    color: "var(--muted)",
                  }}
                >
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => {
                        setEditing({ ...item });
                        setIsNew(false);
                      }}
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "6px",
                        padding: "0.35rem 0.6rem",
                        cursor: "pointer",
                        color: "rgba(255,255,255,0.7)",
                        fontSize: "0.78rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                      disabled={!user?.permissions.includes("news.update")}
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      style={{
                        background: "rgba(255,59,59,0.08)",
                        border: "1px solid rgba(255,59,59,0.2)",
                        borderRadius: "6px",
                        padding: "0.35rem 0.6rem",
                        cursor: "pointer",
                        color: "var(--primary)",
                        fontSize: "0.78rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                      disabled={!user?.permissions.includes("news.delete")}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div
            className="glass-card"
            style={{
              width: "100%",
              maxWidth: "600px",
              padding: "2rem",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {isNew ? "New News Item" : "Edit Item"}
              </h3>
              <button
                onClick={() => setEditing(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--muted)",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <form
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              {[
                {
                  key: "title",
                  label: "Title",
                  placeholder: "News headline...",
                },
                {
                  key: "bannerURL",
                  label: "Image URL",
                  placeholder: "https://...",
                },
                {
                  key: "excerpt",
                  label: "Summary",
                  placeholder: "Brief description...",
                },
                {
                  key: "content",
                  label: "Full Content",
                  placeholder: "Full article HTML...",
                },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.7)",
                      marginBottom: "0.35rem",
                    }}
                  >
                    {label}
                  </label>
                  <textarea
                    value={(editing as Record<string, string>)[key] ?? ""}
                    onChange={(e) =>
                      setEditing({ ...editing, [key]: e.target.value })
                    }
                    rows={key === "content" ? 5 : 2}
                    placeholder={placeholder}
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "0.5rem",
                      padding: "0.65rem 1rem",
                      color: "#fff",
                      fontSize: "0.875rem",
                      outline: "none",
                      fontFamily: "var(--font-body)",
                      resize: "vertical",
                    }}
                  />
                </div>
              ))}

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.7)",
                    marginBottom: "0.35rem",
                  }}
                >
                  Reference URLs (one per line)
                </label>
                <textarea
                  value={(editing.referenceURLs || []).join("\n")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      referenceURLs: e.target.value.split("\n"),
                    })
                  }
                  rows={4}
                  placeholder={`https://example.com\nhttps://example.com\nhttps://example.com`}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "0.5rem",
                    padding: "0.65rem 1rem",
                    color: "#fff",
                    fontSize: "0.875rem",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "var(--font-body)",
                  }}
                />
              </div>

              <div
                style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}
              >
                <GalaxyButton type="submit" size="sm" disabled={saving}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {saving ? (
                      "Saving..."
                    ) : (
                      <>
                        <Check size={14} style={{ marginRight: "0.35rem" }} />{" "}
                        Save
                      </>
                    )}
                  </div>
                </GalaxyButton>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "9999px",
                    padding: "0.45rem 1.2rem",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.7)",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="glass-card"
            style={{ padding: "2rem", maxWidth: "360px", textAlign: "center" }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🗑️</div>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#fff",
                marginBottom: "0.5rem",
              }}
            >
              Delete Item?
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--muted)",
                marginBottom: "1.5rem",
              }}
            >
              This cannot be undone.
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => handleDelete(deleteId)}
                style={{
                  background: "rgba(255,59,59,0.15)",
                  border: "1px solid rgba(255,59,59,0.3)",
                  borderRadius: "9999px",
                  padding: "0.5rem 1.5rem",
                  cursor: "pointer",
                  color: "var(--primary)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "9999px",
                  padding: "0.5rem 1.5rem",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
