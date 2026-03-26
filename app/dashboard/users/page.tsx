"use client";

import { useState, useEffect } from "react";
import type { User } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Check, Pencil, Plus, Trash2, User as UserIcon, X } from "lucide-react";
import { ALL_PERMISSIONS } from "@/types/index";

import dynamic from "next/dynamic";
const GalaxyButton = dynamic(() => import("@/components/common/GalaxyButton"), {
  ssr: false,
});

const emptyUser: Partial<User> = {
  name: "",
  email: "",
  password: "",
  image: "",
  permissions: [],
};

const getUserColor = (permissions: string[]) => {
  if (!permissions || permissions.length === 0) return "#6b7280";
  const total = ALL_PERMISSIONS.length;
  const count = permissions.length;

  if (count === total) return "#ff3b3b";
  if (count > total * 0.6) return "#22c55e";
  if (count > total * 0.3) return "#3b82f6";
  return "#d946ef";
};

export default function DashboardUsersPage() {
  const { user, hasAnyPermission } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [editing, setEditing] = useState<Partial<User> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!hasAnyPermission("user")) {
    return (
      <div
        style={{ textAlign: "center", padding: "4rem", color: "var(--muted)" }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔒</div>
        <p>You don't have permission to manage users.</p>
      </div>
    );
  }

  const handleSave = async () => {
    if (!editing) return;

    const isEmpty = (val?: string) => !val || !val.trim();
    if (isEmpty(editing.name) || isEmpty(editing.email)) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setSaving(true);

      const payload: any = {
        name: editing.name ?? "",
        email: editing.email ?? "",
        image: editing.image ?? "",
        permissions: editing.permissions ?? [],
      };

      if (isNew && editing.password) {
        payload.password = editing.password;
      }

      let res;
      if (isNew) {
        res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to create new user");

        const newUser = await res.json();
        setUsers((prev: any) => [newUser, ...prev]);
      } else {
        res = await fetch(`/api/users/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to update user");

        const updatedUser = await res.json();
        setUsers((prev: any) =>
          prev.map((p: any) => (p.id === updatedUser.id ? updatedUser : p)),
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
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setUsers((prev) => prev.filter((p: any) => p.id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
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
            Users
          </h1>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "0.875rem",
              marginTop: "0.25rem",
            }}
          >
            {users.length} registered users
          </p>
        </div>
        <GalaxyButton
          size="sm"
          onClick={() => {
            setEditing({ ...emptyUser });
            setIsNew(true);
          }}
          disabled={!user?.permissions.includes("user.create")}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Plus size={14} style={{ marginRight: "0.35rem" }} /> New User
          </div>
        </GalaxyButton>
      </div>

      <div className="glass-card" style={{ padding: "0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["User", "Email", "Permissions", "Joined", "Actions"].map(
                (h) => (
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
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {users
              .sort((a, b) => {
                const aCount = a.permissions?.length ?? 0;
                const bCount = b.permissions?.length ?? 0;
                return bCount - aCount;
              })
              .map((u) => (
                <tr
                  key={u.id}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      {u.image ? (
                        <img
                          src={u.image}
                          alt={u.name}
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            border: `2px solid ${getUserColor(u.permissions)}40`,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <UserIcon
                            size={16}
                            style={{ color: "var(--muted)" }}
                          />
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "#fff",
                        }}
                      >
                        {u.name}
                      </div>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "1rem 1.25rem",
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    {u.email}
                  </td>
                  <td
                    style={{
                      padding: "1rem 1.25rem",
                      fontSize: "0.85rem",
                      color: "var(--muted)",
                    }}
                  >
                    {u.permissions ? u.permissions.length : 0} permissions
                  </td>
                  <td
                    style={{
                      padding: "1rem 1.25rem",
                      fontSize: "0.8rem",
                      color: "var(--muted)",
                    }}
                  >
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    {u.id !== user?.id ? (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => {
                            setEditing({
                              ...u,
                              permissions:
                                u.permissions?.map((p: any) => p.permission) ??
                                [],
                            });
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
                          disabled={!user?.permissions.includes("user.update")}
                        >
                          <Pencil size={12} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(u.id)}
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
                          disabled={!user?.permissions.includes("user.delete")}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    ) : (
                      <span
                        style={{
                          fontSize: "0.78rem",
                          color: "var(--muted)",
                          fontStyle: "italic",
                        }}
                      >
                        You
                      </span>
                    )}
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
                {isNew ? "New User" : "Edit User"}
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
                  key: "name",
                  label: "Name",
                  placeholder: "User name...",
                },
                {
                  key: "email",
                  label: "Email",
                  placeholder: "[EMAIL_ADDRESS]",
                },
                {
                  key: "image",
                  label: "Image URL",
                  placeholder: "https://...",
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

              {isNew && (
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
                    Password
                  </label>
                  <input
                    type="password"
                    value={
                      (editing as Record<string, string>)["password"] ?? ""
                    }
                    onChange={(e) =>
                      setEditing({ ...editing, password: e.target.value })
                    }
                    placeholder="Password"
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
              )}

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
                  Permissions
                </label>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "0.5rem",
                    maxHeight: "200px",
                    overflowY: "auto",
                    paddingRight: "0.5rem",
                  }}
                >
                  {ALL_PERMISSIONS.map((perm) => (
                    <label
                      key={perm}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.85rem",
                        background: "#1a1a28",
                        padding: "0.35rem 0.5rem",
                        borderRadius: "0.4rem",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={editing.permissions?.includes(perm) ?? false}
                        onChange={(e) => {
                          const newPermissions = editing.permissions
                            ? [...editing.permissions]
                            : [];
                          if (e.target.checked) {
                            newPermissions.push(perm);
                          } else {
                            const index = newPermissions.indexOf(perm);
                            if (index > -1) newPermissions.splice(index, 1);
                          }
                          setEditing({
                            ...editing,
                            permissions: newPermissions,
                          });
                        }}
                        style={{ cursor: "pointer" }}
                      />
                      {perm.split(".")[0]}: {perm.split(".")[1]}
                    </label>
                  ))}
                </div>
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
              Delete User?
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
