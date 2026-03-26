"use client";

import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface Shooting {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  active: boolean;
  angle: number;
}

export default function StarField({ count = 200 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars: Star[] = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      z: Math.random() * 3,
      size: Math.random() * 1.8 + 0.2,
      opacity: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    const shootings: Shooting[] = Array.from({ length: 3 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * (window.innerHeight * 0.5),
      length: Math.random() * 150 + 80,
      speed: Math.random() * 8 + 6,
      opacity: 0,
      active: false,
      angle: (Math.PI / 4) + (Math.random() - 0.5) * 0.3,
    }));

    let shootTimer = 0;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Stars
      stars.forEach((s) => {
        s.twinklePhase += s.twinkleSpeed;
        const twinkle = Math.sin(s.twinklePhase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity * twinkle})`;
        ctx.fill();
      });

      // Shooting stars
      shootTimer++;
      if (shootTimer > 180) {
        shootTimer = 0;
        const idle = shootings.find((s) => !s.active);
        if (idle) {
          idle.x = Math.random() * canvas.width * 0.7;
          idle.y = Math.random() * canvas.height * 0.3;
          idle.opacity = 1;
          idle.active = true;
        }
      }

      shootings.forEach((s) => {
        if (!s.active) return;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity -= 0.016;
        if (s.opacity <= 0) { s.active = false; return; }
        const grd = ctx.createLinearGradient(
          s.x, s.y,
          s.x - Math.cos(s.angle) * s.length,
          s.y - Math.sin(s.angle) * s.length,
        );
        grd.addColorStop(0, `rgba(255,255,255,${s.opacity})`);
        grd.addColorStop(0.5, `rgba(255,59,59,${s.opacity * 0.5})`);
        grd.addColorStop(1, "rgba(255,59,59,0)");
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - Math.cos(s.angle) * s.length, s.y - Math.sin(s.angle) * s.length);
        ctx.strokeStyle = grd;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
