"use client";

import { useState, useEffect } from "react";
import type { Project } from "@/types";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import dynamic from "next/dynamic";
const GalaxyButton = dynamic(() => import("@/components/common/GalaxyButton"), {
  ssr: false,
});

const emptyProject: Partial<Project> = {
  title: "",
  category: "",
  excerpt: "",
  content: "",
  bannerURL: "",
  status: "PLANNED",
  objectives: [],
  techStack: [],
};

const statusColors: Record<string, string> = {
  ACTIVE: "#22c55e",
  COMPLETED: "#3b82f6",
  PLANNED: "#f59e0b",
};

export default function DashboardProjectsPage() {
  const { user, hasAnyPermission } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!hasAnyPermission("project")) {
    return (
      <div
        style={{ textAlign: "center", padding: "4rem", color: "var(--muted)" }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔒</div>
        <p>You don't have permission to manage projects.</p>
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

    const cleanArray = (arr?: string[]) =>
      arr?.map((item) => item.trim()).filter(Boolean) || [];

    const cleanedObjectives = cleanArray(editing.objectives);
    const cleanedTechStack = cleanArray(editing.techStack);

    if (!cleanedObjectives.length) {
      alert("Add at least one objective");
      return;
    }

    if (!cleanedTechStack.length) {
      alert("Add at least one technology");
      return;
    }

    try {
      setSaving(true);
      if (isNew) {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title: editing.title ?? "",
            category: editing.category ?? "",
            excerpt: editing.excerpt ?? "",
            content: editing.content ?? "",
            bannerURL: editing.bannerURL ?? "",
            status: editing.status ?? "PLANNED",
            objectives: cleanedObjectives,
            techStack: cleanedTechStack,
          }),
        });

        if (!res.ok) throw new Error("Failed to create project");

        const newProject = await res.json();

        setProjects((prev: any) => [newProject, ...prev]);
      } else {
        const res = await fetch(`/api/projects/${editing.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title: editing.title ?? "",
            category: editing.category ?? "",
            excerpt: editing.excerpt ?? "",
            content: editing.content ?? "",
            bannerURL: editing.bannerURL ?? "",
            status: editing.status ?? "PLANNED",
            objectives: cleanedObjectives,
            techStack: cleanedTechStack,
          }),
        });

        if (!res.ok) throw new Error("Failed to update project");

        const updatedProject = await res.json();

        setProjects((prev: any) =>
          prev.map((p: any) =>
            p.id === updatedProject.id ? updatedProject : p,
          ),
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
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setProjects((prev) => prev.filter((p: any) => p.id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
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
            Projects
          </h1>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "0.875rem",
              marginTop: "0.25rem",
            }}
          >
            {projects.length} Projects
          </p>
        </div>
        <GalaxyButton
          size="sm"
          onClick={() => {
            setEditing({ ...emptyProject });
            setIsNew(true);
          }}
          disabled={!user?.permissions.includes("project.create")}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Plus size={14} style={{ marginRight: "0.35rem" }} /> New Project
          </div>
        </GalaxyButton>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Title", "Category", "Status", "Actions"].map((h) => (
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
            {projects.map((p: any) => (
              <tr
                key={p.id}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "rgba(255,255,255,0.02)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background =
                    "transparent")
                }
              >
                <td style={{ padding: "1rem 1.25rem" }}>
                  <div
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#fff",
                    }}
                  >
                    {p.title}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--muted)",
                      marginTop: "0.15rem",
                      maxWidth: "280px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.excerpt}
                  </div>
                </td>
                <td
                  style={{
                    padding: "1rem 1.25rem",
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  {p.category}
                </td>
                <td style={{ padding: "1rem 1.25rem" }}>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: statusColors[p.status],
                      background: `${statusColors[p.status]}18`,
                      borderRadius: "9999px",
                      padding: "0.2rem 0.7rem",
                      textTransform: "capitalize",
                    }}
                  >
                    {p.status}
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
                      disabled={!user?.permissions.includes("project.update")}
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
                      disabled={!user?.permissions.includes("project.delete")}
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

      {/* Edit/Create Modal */}
      {editing && (
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
            padding: "1.5rem",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditing(null);
          }}
        >
          <div
            className="glass-card"
            style={{
              width: "100%",
              maxWidth: "560px",
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
                {isNew ? "New Project" : "Edit Project"}
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
                { key: "title", label: "Title" },
                { key: "category", label: "Category" },
                { key: "bannerURL", label: "Image URL" },
              ].map(({ key, label }) => (
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
                    marginBottom: "0.35rem",
                  }}
                >
                  Status
                </label>
                <select
                  value={editing.status ?? "PLANNED"}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      status: e.target.value as Project["status"],
                    })
                  }
                  style={{
                    width: "100%",
                    background: "#1a1a28",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "0.5rem",
                    padding: "0.65rem 1rem",
                    color: "#fff",
                    fontSize: "0.875rem",
                    outline: "none",
                  }}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="PLANNED">Planned</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

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
                  Excerpt
                </label>
                <textarea
                  value={editing.excerpt ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, excerpt: e.target.value })
                  }
                  rows={2}
                  placeholder="Short summary of the project..."
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
                  Description
                </label>
                <textarea
                  value={editing.content ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, content: e.target.value })
                  }
                  rows={4}
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
                  Objectives (one per line)
                </label>
                <textarea
                  value={(editing.objectives || []).join("\n")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      objectives: e.target.value.split("\n"),
                    })
                  }
                  rows={4}
                  placeholder={`Objective 1\nObjective 2\nObjective 3`}
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
                  Technologies (one per line)
                </label>
                <textarea
                  value={(editing.techStack || []).join("\n")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      techStack: e.target.value.split("\n"),
                    })
                  }
                  rows={4}
                  placeholder={`React\nNext.js\nPrisma`}
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

      {/* Delete confirm */}
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
            style={{ padding: "2rem", maxWidth: "400px", textAlign: "center" }}
          >
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🗑️</div>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "#fff",
                marginBottom: "0.5rem",
              }}
            >
              Delete Project?
            </h3>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--muted)",
                marginBottom: "1.75rem",
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
