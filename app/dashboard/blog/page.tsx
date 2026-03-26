"use client";

import { useState, useEffect } from "react";
import type { BlogPost } from "@/types";
import { Plus, Pencil, Trash2, X, Check, Eye } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import dynamic from "next/dynamic";
const GalaxyButton = dynamic(() => import("@/components/common/GalaxyButton"), {
  ssr: false,
});

function TiptapEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }: any) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        style:
          "min-height:200px; padding:1rem; outline:none; color:#fff; line-height:1.7; font-family:var(--font-body); font-size:0.9rem;",
      },
    },
  });

  if (!editor) return null;

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: "0.25rem 0.6rem",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontSize: "0.78rem",
    fontWeight: active ? 700 : 400,
    background: active ? "rgba(255,59,59,0.2)" : "rgba(255,255,255,0.06)",
    color: active ? "var(--primary)" : "rgba(255,255,255,0.7)",
  });

  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "0.5rem",
        overflow: "hidden",
        background: "rgba(255,255,255,0.04)",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: "0.35rem",
          padding: "0.5rem 0.75rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexWrap: "wrap",
        }}
      >
        {[
          {
            label: "B",
            action: () => editor.chain().focus().toggleBold().run(),
            active: editor.isActive("bold"),
          },
          {
            label: "I",
            action: () => editor.chain().focus().toggleItalic().run(),
            active: editor.isActive("italic"),
          },
          {
            label: "H2",
            action: () =>
              editor.chain().focus().toggleHeading({ level: 2 }).run(),
            active: editor.isActive("heading", { level: 2 }),
          },
          {
            label: "H3",
            action: () =>
              editor.chain().focus().toggleHeading({ level: 3 }).run(),
            active: editor.isActive("heading", { level: 3 }),
          },
          {
            label: "UL",
            action: () => editor.chain().focus().toggleBulletList().run(),
            active: editor.isActive("bulletList"),
          },
          {
            label: "OL",
            action: () => editor.chain().focus().toggleOrderedList().run(),
            active: editor.isActive("orderedList"),
          },
          {
            label: "BQ",
            action: () => editor.chain().focus().toggleBlockquote().run(),
            active: editor.isActive("blockquote"),
          },
        ].map(({ label, action, active }) => (
          <button
            key={label}
            type="button"
            onClick={action}
            style={btnStyle(active)}
          >
            {label}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

const emptyPost: Partial<BlogPost> = {
  title: "",
  category: "",
  excerpt: "",
  content: "<p></p>",
  bannerURL: "",
  isPublished: false,
};

export default function DashboardBlogPage() {
  const { user, hasAnyPermission } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!hasAnyPermission("blog")) {
    return (
      <div
        style={{ textAlign: "center", padding: "4rem", color: "var(--muted)" }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔒</div>
        <p>You don't have permission to manage blogs.</p>
      </div>
    );
  }

  const handleSave = async () => {
    if (!editing) return;

    const isEmpty = (val?: string) => !val || !val.trim();

    if (
      isEmpty(editing.title) ||
      isEmpty(editing.category) ||
      isEmpty(editing.excerpt) ||
      isEmpty(editing.content) ||
      isEmpty(editing.bannerURL)
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setSaving(true);
      if (isNew) {
        const res = await fetch("/api/blog", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editing.title,
            category: editing.category,
            excerpt: editing.excerpt,
            content: editing.content,
            bannerURL: editing.bannerURL,
            isPublished: editing.isPublished,
          }),
        });

        const newBlog = await res.json();

        setPosts((prev) => [newBlog, ...prev]);
      } else {
        const res = await fetch(`/api/blog/${editing.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editing.title,
            category: editing.category,
            excerpt: editing.excerpt,
            content: editing.content,
            bannerURL: editing.bannerURL,
            isPublished: editing.isPublished,
          }),
        });

        const updated = await res.json();

        setPosts((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p)),
        );
      }

      setEditing(null);
      setIsNew(false);
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setPosts((prev) => prev.filter((p: any) => p.id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blog");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
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
            Blog Posts
          </h1>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "0.875rem",
              marginTop: "0.25rem",
            }}
          >
            {posts.length} articles
          </p>
        </div>
        <GalaxyButton
          size="sm"
          onClick={() => {
            setEditing({ ...emptyPost });
            setIsNew(true);
          }}
          disabled={!user?.permissions.includes("blog.create")}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Plus size={14} style={{ marginRight: "0.35rem" }} /> New Post
          </div>
        </GalaxyButton>
      </div>

      <div className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Title", "Author", "Date", "Status", "Actions"].map((h) => (
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
            {posts.map((p) => (
              <tr
                key={p.id}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#fff",
                      maxWidth: "260px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.title}
                  </div>
                </td>
                <td
                  style={{
                    padding: "1rem 1.25rem",
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  {p.author?.name}
                </td>
                <td
                  style={{
                    padding: "1rem 1.25rem",
                    fontSize: "0.82rem",
                    color: "var(--muted)",
                  }}
                >
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: p.isPublished ? "#22c55e" : "#f59e0b",
                      background: p.isPublished
                        ? "rgba(34,197,94,0.1)"
                        : "rgba(245,158,11,0.1)",
                      borderRadius: "9999px",
                      padding: "0.2rem 0.7rem",
                    }}
                  >
                    {p.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => {
                        setEditing({ ...p });
                        setIsNew(false);
                      }}
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "6px",
                        padding: "0.35rem 0.6rem",
                        cursor: "pointer",
                        color: "rgba(255,255,255,0.7)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        fontSize: "0.78rem",
                      }}
                      disabled={!user?.permissions.includes("blog.update")}
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(p.id)}
                      style={{
                        background: "rgba(255,59,59,0.08)",
                        border: "1px solid rgba(255,59,59,0.2)",
                        borderRadius: "6px",
                        padding: "0.35rem 0.6rem",
                        cursor: "pointer",
                        color: "var(--primary)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        fontSize: "0.78rem",
                      }}
                      disabled={!user?.permissions.includes("blog.delete")}
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

      {/* Edit modal */}
      {editing && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
            zIndex: 200,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "2rem",
            overflowY: "auto",
          }}
        >
          <div
            className="glass-card"
            style={{ width: "100%", maxWidth: "760px", padding: "2rem" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.75rem",
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
                {isNew ? "New Blog Post" : "Edit Post"}
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
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              {[
                { key: "title", label: "Title", placeholder: "Post title..." },
                {
                  key: "bannerURL",
                  label: "Cover Image URL",
                  placeholder: "https://...",
                },
                {
                  key: "category",
                  label: "Category",
                  placeholder: "Category...",
                },
                {
                  key: "excerpt",
                  label: "Excerpt",
                  placeholder: "Short description...",
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
                  <input
                    value={(editing as Record<string, string>)[key] ?? ""}
                    onChange={(e) =>
                      setEditing({ ...editing, [key]: e.target.value })
                    }
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
                    marginBottom: "0.5rem",
                  }}
                >
                  Content
                </label>
                <TiptapEditor
                  content={editing.content ?? ""}
                  onChange={(html) => setEditing({ ...editing, content: html })}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={editing.isPublished ?? false}
                    onChange={(e) =>
                      setEditing({ ...editing, isPublished: e.target.checked })
                    }
                    style={{
                      width: "16px",
                      height: "16px",
                      accentColor: "var(--primary)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    Publish immediately
                  </span>
                </label>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
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
                        Save Post
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
              Delete Post?
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--muted)",
                marginBottom: "1.5rem",
              }}
            >
              This action cannot be undone.
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
