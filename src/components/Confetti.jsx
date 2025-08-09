"use client";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function Confetti({ 
  particleCount = 50, 
  colors = ["#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#10b981"],
  duration = 3,
  spread = 100 
}) {
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      initialX: Math.random() * spread - spread / 2,
      initialY: -20,
      rotation: Math.random() * 360,
      delay: Math.random() * 0.5,
    }));
  }, [particleCount, colors, spread]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            backgroundColor: particle.color,
            width: particle.size,
            height: particle.size,
            left: `50%`,
            top: 0,
          }}
          initial={{
            x: particle.initialX,
            y: particle.initialY,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            x: particle.initialX + (Math.random() - 0.5) * 200,
            y: window.innerHeight + 100,
            rotate: particle.rotation,
            opacity: 0,
          }}
          transition={{
            duration: duration,
            delay: particle.delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      ))}
    </div>
  );
}
