"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Telescope,
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ALL_PERMISSIONS } from "@/types/index";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const isDashboard = pathname?.startsWith("/dashboard");

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  if (isDashboard) return null;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const hasAnyPermission = user?.permissions?.some((perm) =>
    ALL_PERMISSIONS.includes(perm),
  );

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: scrolled ? "0.75rem 0" : "1.25rem 0",
          background: scrolled ? "rgba(11,11,18,0.95)" : "rgba(11,11,18,0)",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              textDecoration: "none",
            }}
          >
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              style={{ color: "var(--primary)" }}
            >
              <Telescope size={28} />
            </motion.div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: "1.1rem",
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
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Astronomy Research
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
            className="desktop-nav"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "0.4rem 0.85rem",
                  borderRadius: "6px",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  color:
                    pathname === link.href ? "#fff" : "rgba(255,255,255,0.65)",
                  background:
                    pathname === link.href
                      ? "rgba(255,59,59,0.12)"
                      : "transparent",
                  borderBottom:
                    pathname === link.href
                      ? "2px solid var(--primary)"
                      : "2px solid transparent",
                  transition: "all 0.2s ease",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            {user ? (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    padding: "0.4rem 0.8rem",
                    cursor: "pointer",
                    color: "#fff",
                    fontSize: "0.875rem",
                  }}
                >
                  <User size={16} style={{ color: "var(--primary)" }} />
                  <span>{user.name.split(" ")[0]}</span>
                  <ChevronDown size={14} style={{ opacity: 0.6 }} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        right: 0,
                        background: "rgba(13,13,24,0.98)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "10px",
                        padding: "0.5rem",
                        minWidth: "180px",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                        zIndex: 100,
                      }}
                    >
                      <div
                        style={{
                          padding: "0.5rem 0.75rem 0.75rem",
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                          marginBottom: "0.25rem",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            color: "#fff",
                          }}
                        >
                          {user.name}
                        </div>
                      </div>
                      {hasAnyPermission && (
                        <Link
                          href="/dashboard"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.5rem 0.75rem",
                            borderRadius: "6px",
                            color: "rgba(255,255,255,0.8)",
                            textDecoration: "none",
                            fontSize: "0.875rem",
                          }}
                        >
                          <LayoutDashboard size={14} />
                          Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "6px",
                          color: "var(--primary)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          width: "100%",
                          fontSize: "0.875rem",
                        }}
                      >
                        <LogOut size={14} />
                        Log out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    padding: "0.4rem 0.75rem",
                  }}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  style={{
                    background: "linear-gradient(135deg, #ff3b3b, #d946ef)",
                    color: "#fff",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    padding: "0.45rem 1.1rem",
                    borderRadius: "9999px",
                  }}
                >
                  Sign up
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#fff",
                padding: "0.25rem",
                display: "none",
              }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              top: "64px",
              left: 0,
              right: 0,
              zIndex: 999,
              background: "rgba(11,11,18,0.98)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              overflow: "hidden",
            }}
          >
            <div
              className="container"
              style={{
                paddingBlock: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    style={{
                      display: "block",
                      padding: "0.75rem 1rem",
                      borderRadius: "8px",
                      color:
                        pathname === link.href
                          ? "#fff"
                          : "rgba(255,255,255,0.7)",
                      background:
                        pathname === link.href
                          ? "rgba(255,59,59,0.1)"
                          : "transparent",
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
