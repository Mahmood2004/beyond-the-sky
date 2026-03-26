"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  FolderOpen,
  FileText,
  Newspaper,
  Users,
  MessageSquare,
  Settings2,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { ALL_PERMISSIONS } from "@/types";

export default function DashboardOverview() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [news, setNews] = useState([]);
  const [messages, setMessages] = useState([]);
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const statsData = [
    {
      label: "Projects",
      value: projects.length,
      icon: FolderOpen,
      color: "var(--primary)",
      href: "/dashboard/projects",
    },
    {
      label: "Blog Articles",
      value: blogs.length,
      icon: FileText,
      color: "var(--accent)",
      href: "/dashboard/blog",
    },
    {
      label: "News",
      value: news.length,
      icon: Newspaper,
      color: "#3b82f6",
      href: "/dashboard/news",
    },
    {
      label: "Users",
      value: users.length,
      icon: Users,
      color: "#22c55e",
      href: "/dashboard/users",
    },
    {
      label: "Messages",
      value: messages.length,
      icon: MessageSquare,
      color: "#f59e0b",
      href: "/dashboard/messages",
    },
    {
      label: "Services",
      value: services.length,
      icon: Settings2,
      color: "#ec4899",
      href: "/dashboard/services",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          projectsRes,
          blogsRes,
          newsRes,
          submissionsRes,
          servicesRes,
          usersRes,
        ] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/blog"),
          fetch("/api/news"),
          fetch("/api/submissions"),
          fetch("/api/services"),
          fetch("/api/users"),
        ]);

        const [
          projectsData,
          blogsData,
          newsData,
          submissionsData,
          servicesData,
          usersData,
        ] = await Promise.all([
          projectsRes.json(),
          blogsRes.json(),
          newsRes.json(),
          submissionsRes.json(),
          servicesRes.json(),
          usersRes.json(),
        ]);

        setProjects(projectsData);
        setBlogs(blogsData);
        setNews(newsData);
        setMessages(submissionsData);
        setServices(servicesData);
        setUsers(usersData);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const hasFullAccess = () => {
    if (!user?.permissions) return false;
    return ALL_PERMISSIONS.every((perm) => user.permissions.includes(perm));
  };

  if (!hasFullAccess()) {
    return (
      <div
        style={{ textAlign: "center", padding: "4rem", color: "var(--muted)" }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔒</div>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "0.4rem",
          }}
        >
          Dashboard Overview
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          Welcome back, {user?.name}. Here's a summary of the observatory's
          content.
        </p>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2.5rem",
        }}
      >
        {statsData.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            style={{ textDecoration: "none" }}
          >
            <div
              className="glass-card"
              style={{
                padding: "1.5rem",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  `${stat.color}30`;
                (e.currentTarget as HTMLElement).style.boxShadow =
                  `0 8px 24px ${stat.color}12`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--border)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: `${stat.color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: stat.color,
                  }}
                >
                  <stat.icon size={18} />
                </div>
                <TrendingUp size={14} style={{ color: "var(--muted)" }} />
              </div>
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--muted)",
                  marginTop: "0.2rem",
                }}
              >
                {stat.label}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* Recent projects */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1rem",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FolderOpen size={16} style={{ color: "var(--primary)" }} /> Recent
            Projects
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {projects.slice(0, 3).map((p: any) => (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#fff",
                      fontWeight: 500,
                    }}
                  >
                    {p.title}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                    {p.category}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    color:
                      p.status === "ACTIVE"
                        ? "#22c55e"
                        : p.status === "COMPLETED"
                          ? "#3b82f6"
                          : "#f59e0b",
                    background:
                      p.status === "ACTIVE"
                        ? "rgba(34,197,94,0.1)"
                        : p.status === "COMPLETED"
                          ? "rgba(59,130,246,0.1)"
                          : "rgba(245,158,11,0.1)",
                    borderRadius: "9999px",
                    padding: "0.15rem 0.6rem",
                    textTransform: "capitalize",
                  }}
                >
                  {p.status}
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/dashboard/projects"
            style={{
              display: "inline-block",
              marginTop: "1.25rem",
              fontSize: "0.8rem",
              color: "var(--primary)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Manage all →
          </Link>
        </div>

        {/* Recent blog posts */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1rem",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FileText size={16} style={{ color: "var(--accent)" }} /> Recent
            Blog Posts
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {blogs.slice(0, 3).map((post: any, i: number) => (
              <div
                key={post.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "#fff",
                      fontWeight: 500,
                      lineHeight: 1.3,
                    }}
                  >
                    {post.title}
                  </div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--muted)",
                      marginTop: "0.15rem",
                    }}
                  >
                    By {post.author.name}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    color: post.isPublished ? "#22c55e" : "#f59e0b",
                    background: post.isPublished
                      ? "rgba(34,197,94,0.1)"
                      : "rgba(245,158,11,0.1)",
                    borderRadius: "9999px",
                    padding: "0.15rem 0.6rem",
                    flexShrink: 0,
                    marginLeft: "0.5rem",
                  }}
                >
                  {post.isPublished ? "Published" : "Draft"}
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/dashboard/blog"
            style={{
              display: "inline-block",
              marginTop: "1.25rem",
              fontSize: "0.8rem",
              color: "var(--accent)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Manage all →
          </Link>
        </div>
      </div>
    </div>
  );
}
