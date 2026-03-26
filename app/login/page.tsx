"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Telescope } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import dynamic from "next/dynamic";
const StarField = dynamic(() => import("@/components/common/StarField"), {
  ssr: false,
});
const GalaxyButton = dynamic(() => import("@/components/common/GalaxyButton"), {
  ssr: false,
});

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [serverError, setServerError] = useState("");
  const { user, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case "SUPERADMIN":
          router.push("/dashboard");
          break;
        case "PROJECTMANAGER":
          router.push("/dashboard/projects");
          break;
        case "BLOGGER":
          router.push("/dashboard/blog");
          break;
        case "RESEARCHER":
          router.push("/dashboard/news");
          break;
        case "VISITOR":
        default:
          router.push("/");
          break;
      }
    }
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    const ok = await login(data.email, data.password);
    if (!ok) {
      setServerError("Invalid credentials");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(217,70,239,0.08) 0%, transparent 70%), #0B0B12",
        padding: "2rem 1.5rem",
      }}
    >
      <StarField count={150} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "440px",
          padding: "2.5rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background:
                "linear-gradient(135deg,rgba(255,59,59,0.2),rgba(217,70,239,0.15))",
              border: "1px solid rgba(255,59,59,0.2)",
              color: "var(--primary)",
              marginBottom: "1rem",
            }}
          >
            <Telescope size={26} />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "0.4rem",
            }}
          >
            Welcome Back
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
            Sign in to your observatory account
          </p>
        </div>

        {serverError && (
          <div
            style={{
              background: "rgba(255,59,59,0.1)",
              border: "1px solid rgba(255,59,59,0.3)",
              borderRadius: "0.5rem",
              padding: "0.75rem 1rem",
              marginBottom: "1.25rem",
              fontSize: "0.82rem",
              color: "rgba(255,150,150,0.9)",
            }}
          >
            {serverError}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.7)",
                marginBottom: "0.4rem",
              }}
            >
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${errors.email ? "var(--primary)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "0.5rem",
                padding: "0.75rem 1rem",
                color: "#fff",
                fontSize: "0.9rem",
                outline: "none",
                fontFamily: "var(--font-body)",
              }}
            />
            {errors.email && (
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--primary)",
                  marginTop: "0.25rem",
                  display: "block",
                }}
              >
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.7)",
                marginBottom: "0.4rem",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                {...register("password")}
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${errors.password ? "var(--primary)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "0.5rem",
                  padding: "0.75rem 2.75rem 0.75rem 1rem",
                  color: "#fff",
                  fontSize: "0.9rem",
                  outline: "none",
                  fontFamily: "var(--font-body)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--muted)",
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--primary)",
                  marginTop: "0.25rem",
                  display: "block",
                }}
              >
                {errors.password.message}
              </span>
            )}
          </div>

          <div style={{ paddingTop: "0.25rem" }}>
            <GalaxyButton type="submit" disabled={isSubmitting} size="md">
              {isSubmitting ? "Signing in..." : "Sign In"}
            </GalaxyButton>
          </div>
        </form>

        <div
          style={{
            marginTop: "1.75rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
            Don't have an account?{" "}
            <Link
              href="/signup"
              style={{
                color: "var(--primary)",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
