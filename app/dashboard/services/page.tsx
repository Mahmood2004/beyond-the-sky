"use client";

import { useState, useEffect } from "react";
import type { Service } from "@/types";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import dynamic from "next/dynamic";

const GalaxyButton = dynamic(() => import("@/components/common/GalaxyButton"), {
  ssr: false,
});

const iconOptions = [
  "telescope",
  "moon",
  "camera",
  "graduation-cap",
  "building-2",
  "flask-conical",
];

const emptyService: Partial<Service> = {
  title: "",
  icon: "telescope",
  features: [],
  description: "",
};

export default function DashboardServicesPage() {
  const { user, hasAnyPermission } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [featuresInput, setFeaturesInput] = useState("");
  const [saving, setSaving] = useState(false);

  if (!hasAnyPermission("service")) {
    return (
      <div
        style={{ textAlign: "center", padding: "4rem", color: "var(--muted)" }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔒</div>
        <p>You don't have permission to manage services.</p>
      </div>
    );
  }

  const handleSave = async () => {
    if (!editing) return;
    const isEmpty = (val?: string) => !val || !val.trim();

    if (
      isEmpty(editing.title) ||
      isEmpty(editing.description) ||
      isEmpty(editing.icon)
    ) {
      alert("Please fill all required fields");
      return;
    }

    const cleanArray = (arr?: string[]) =>
      arr?.map((item) => item.trim()).filter(Boolean) || [];

    const cleanedFeatures = cleanArray(editing.features);

    if (!cleanedFeatures.length) {
      alert("Add at least one feature");
      return;
    }

    try {
      setSaving(true);
      if (isNew) {
        const res = await fetch("/api/services", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title: editing.title ?? "",
            icon: editing.icon ?? "",
            description: editing.description ?? "",
            features: cleanedFeatures,
          }),
        });

        if (!res.ok) throw new Error("Failed to create service");

        const newService = await res.json();

        setServices((prev: any) => [newService, ...prev]);
      } else {
        const res = await fetch(`/api/services/${editing.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title: editing.title ?? "",
            icon: editing.icon ?? "",
            description: editing.description ?? "",
            features: cleanedFeatures,
          }),
        });

        if (!res.ok) throw new Error("Failed to update service");

        const updatedService = await res.json();

        setServices((prev: any) =>
          prev.map((p: any) =>
            p.id === updatedService.id ? updatedService : p,
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
      const res = await fetch(`/api/services/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setServices((prev) => prev.filter((p: any) => p.id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/services");
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
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
            Services
          </h1>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "0.875rem",
              marginTop: "0.25rem",
            }}
          >
            {services.length} Services
          </p>
        </div>
        <GalaxyButton
          size="sm"
          onClick={() => {
            setEditing({ ...emptyService });
            setFeaturesInput("");
            setIsNew(true);
          }}
          disabled={!user?.permissions.includes("service.create")}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Plus size={14} style={{ marginRight: "0.35rem" }} /> New Service
          </div>
        </GalaxyButton>
      </div>

      <div className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Title", "Icon", "Features", "Actions"].map((h) => (
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
            {services
              .sort((a, b) => a.order - b.order)
              .map((s) => (
                <tr
                  key={s.id}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: "#fff",
                      }}
                    >
                      {s.title}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--muted)",
                        marginTop: "0.1rem",
                        maxWidth: "260px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.description}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "1rem 1.25rem",
                      fontSize: "0.82rem",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    {s.icon}
                  </td>
                  <td
                    style={{
                      padding: "1rem 1.25rem",
                      fontSize: "0.82rem",
                      color: "var(--muted)",
                    }}
                  >
                    {s.features.length} features
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => {
                          setEditing({ ...s });
                          setFeaturesInput(s.features.join("\n"));
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
                        disabled={!user?.permissions.includes("service.update")}
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(s.id)}
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
                        disabled={!user?.permissions.includes("service.delete")}
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
              maxWidth: "520px",
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
                {isNew ? "New Service" : "Edit Service"}
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
                  Title
                </label>
                <input
                  value={editing.title ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, title: e.target.value })
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
                  placeholder="Service title"
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
                  Icon
                </label>
                <select
                  value={editing.icon ?? "telescope"}
                  onChange={(e) =>
                    setEditing({ ...editing, icon: e.target.value })
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
                  {iconOptions.map((ic) => (
                    <option key={ic} value={ic}>
                      {ic}
                    </option>
                  ))}
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
                  Description
                </label>
                <textarea
                  value={editing.description ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  rows={3}
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
                  placeholder="Service description"
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
                  Features (one per line)
                </label>
                <textarea
                  value={(editing.features || []).join("\n")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      features: e.target.value.split("\n"),
                    })
                  }
                  rows={4}
                  placeholder={`Feature 1\nFeature 2\nFeature 3`}
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
              Delete Service?
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
