"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import SpaceLoader from "@/components/common/SpaceLoader";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Newspaper,
  Settings2,
  MessageSquare,
  Users,
  Telescope,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ALL_PERMISSIONS } from "@/types";

const navItems = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    resource: null,
  },
  {
    href: "/dashboard/projects",
    label: "Projects",
    icon: FolderOpen,
    resource: "project",
  },
  {
    href: "/dashboard/blog",
    label: "Blog Posts",
    icon: FileText,
    resource: "blog",
  },
  { href: "/dashboard/news", label: "News", icon: Newspaper, resource: "news" },
  {
    href: "/dashboard/services",
    label: "Services",
    icon: Settings2,
    resource: "service",
  },
  {
    href: "/dashboard/messages",
    label: "Messages",
    icon: MessageSquare,
    resource: "messages",
  },
  { href: "/dashboard/users", label: "Users", icon: Users, resource: "user" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout, hasAnyPermission } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    } else if (!isLoading && user && user.permissions.length === 0) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.permissions.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0d18",
        }}
      >
        <SpaceLoader />
      </div>
    );
  }

  const hasFullAccess = () => {
    if (!user?.permissions) return false;
    return ALL_PERMISSIONS.every((perm) => user.permissions.includes(perm));
  };

  const accessible = navItems.filter((item) => {
    if (item.resource === null) {
      return hasFullAccess();
    }

    return hasAnyPermission(item.resource);
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "var(--background)",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "240px",
          flexShrink: 0,
          background: "var(--sidebar-bg)",
          borderRight: "1px solid var(--sidebar-border)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "1.5rem 1.25rem",
            borderBottom: "1px solid var(--sidebar-border)",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background:
                "linear-gradient(135deg,rgba(255,59,59,0.3),rgba(217,70,239,0.2))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--primary)",
            }}
          >
            <Telescope size={18} />
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "#fff",
                lineHeight: 1.1,
              }}
            >
              Beyond the Sky
            </div>
            <div
              style={{
                fontSize: "0.6rem",
                color: "var(--muted)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Admin Panel
            </div>
          </div>
        </div>

        {/* User info */}
        <div
          style={{
            padding: "1rem 1.25rem",
            borderBottom: "1px solid var(--sidebar-border)",
          }}
        >
          <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fff" }}>
            {user.name}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0.75rem 0.75rem", overflowY: "auto" }}>
          <div
            style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "var(--muted)",
              padding: "0.5rem 0.5rem",
              marginBottom: "0.25rem",
            }}
          >
            Management
          </div>
          {navItems.map((item) => {
            const allowed = accessible.find((a) => a.href === item.href);
            const isActive = pathname === item.href;

            return (
              <motion.div
                key={item.href}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.15 }}
              >
                <Link
                  href={allowed ? item.href : "/dashboard"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "8px",
                    textDecoration: "none",
                    marginBottom: "0.2rem",
                    background: isActive
                      ? "rgba(255,59,59,0.12)"
                      : "transparent",
                    color: isActive
                      ? "#fff"
                      : allowed
                        ? "rgba(255,255,255,0.55)"
                        : "rgba(255,255,255,0.2)",
                    opacity: allowed ? 1 : 0.5,
                    cursor: allowed ? "pointer" : "not-allowed",
                    pointerEvents: allowed ? "auto" : "none",
                    borderLeft: isActive
                      ? "2px solid var(--primary)"
                      : "2px solid transparent",
                    fontSize: "0.875rem",
                    fontWeight: isActive ? 600 : 400,
                    transition: "all 0.2s",
                  }}
                >
                  <item.icon
                    size={16}
                    style={{
                      color: isActive ? "var(--primary)" : "inherit",
                      flexShrink: 0,
                    }}
                  />
                  {item.label}
                  {isActive && (
                    <ChevronRight
                      size={12}
                      style={{ marginLeft: "auto", color: "var(--primary)" }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div
          style={{
            padding: "0.75rem",
            borderTop: "1px solid var(--sidebar-border)",
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.5rem 0.75rem",
              borderRadius: "8px",
              color: "rgba(255,255,255,0.5)",
              textDecoration: "none",
              fontSize: "0.82rem",
            }}
          >
            <Telescope size={15} /> View Website
          </Link>
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.5rem 0.75rem",
              borderRadius: "8px",
              color: "var(--primary)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "0.82rem",
              width: "100%",
              textAlign: "left",
            }}
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          marginLeft: "240px",
          minHeight: "100vh",
          background: "var(--background)",
        }}
      >
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ padding: "2rem" }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
