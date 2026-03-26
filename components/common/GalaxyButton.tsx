"use client";

import { useRef, useState, ReactNode } from "react";
import { motion } from "framer-motion";

interface GalaxyButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  href?: string;
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

const STAR_COUNT = 15;

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

export default function GalaxyButton({
  children,
  onClick,
  type = "button",
  href,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
}: GalaxyButtonProps) {
  const [hovered, setHovered] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const sizeStyles: Record<string, string> = {
    sm: "px-5! py-2.5! text-sm",
    md: "px-7! py-3.5! text-base",
    lg: "px-10! py-4.5! text-lg",
  };

  const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
    id: i,
    x: randomBetween(10, 90),
    y: randomBetween(10, 90),
    size: randomBetween(1.5, 3.5),
    delay: randomBetween(0, 0.4),
    dur: randomBetween(0.6, 1.2),
  }));

  const baseStyles = `
    relative overflow-hidden font-semibold tracking-wide
    rounded-full cursor-pointer border-0 outline-none
    transition-transform duration-200 select-none
    ${sizeStyles[size]}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${className}
  `;

  const primaryGrad =
    variant === "primary"
      ? "background: linear-gradient(135deg,#ff3b3b 0%,#b91c1c 50%,#d946ef 100%)"
      : "background: transparent; border: 2px solid #ff3b3b; color: #ff3b3b";

  const content = (
    <motion.button
      ref={btnRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={disabled ? {} : { scale: 1.04 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className={baseStyles}
      style={{
        background:
          variant === "primary"
            ? "linear-gradient(135deg,#ff3b3b 0%,#b91c1c 50%,#d946ef 100%)"
            : "transparent",
        border: variant === "outline" ? "2px solid #ff3b3b" : "none",
        color: "#fff",
      }}
    >
      {/* Glow ring */}
      <motion.span
        animate={
          hovered ? { opacity: 1, scale: 1.15 } : { opacity: 0, scale: 1 }
        }
        transition={{ duration: 0.3 }}
        style={{
          position: "absolute",
          width:"150%",
          height:"150%",
          inset: "-4px",
          borderRadius: "9999px",
          background:
            "linear-gradient(135deg,rgba(255,59,59,0.6),rgba(217,70,239,0.4))",
          filter: "blur(12px)",
          zIndex: -1,
        }}
      />

      {/* Stars */}
      {stars.map((s) => (
        <motion.span
          key={s.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={
            hovered
              ? {
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [0, (Math.random() - 0.5) * 20],
                  y: [0, (Math.random() - 0.5) * 20],
                }
              : { opacity: 0, scale: 0 }
          }
          transition={{
            duration: s.dur,
            delay: s.delay,
            repeat: hovered ? Infinity : 0,
          }}
          style={{
            position: "absolute",
            left: s.x + "%",
            top: s.y + "%",
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: s.id % 2 === 0 ? "#fff" : "#d946ef",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Label */}
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </motion.button>
  );

  if (href) {
    return (
      <a href={href} style={{ textDecoration: "none" }}>
        {content}
      </a>
    );
  }
  return content;
}
