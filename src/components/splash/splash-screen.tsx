"use client"

import { useState, useEffect } from "react"

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter")

  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase("hold"), 800)
    const exitTimer = setTimeout(() => setPhase("exit"), 2800)
    const doneTimer = setTimeout(() => onComplete(), 4000)
    return () => {
      clearTimeout(holdTimer)
      clearTimeout(exitTimer)
      clearTimeout(doneTimer)
    }
  }, [onComplete])

  return (
    <div
      className={`splash-container ${phase === "exit" ? "splash-exit" : ""}`}
      aria-hidden="true"
    >
      {/* Particle field */}
      <div className="splash-particles">
        {Array.from({ length: 40 }).map((_, i) => (
          <span key={i} className="splash-particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }} />
        ))}
      </div>

      {/* Center content */}
      <div className="splash-content">
        {/* ZL Monogram */}
        <div className="splash-monogram">
          <svg viewBox="0 0 120 120" className="splash-logo-svg">
            <defs>
              <linearGradient id="metallic" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d4d4d4" />
                <stop offset="30%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#a3a3a3" />
                <stop offset="70%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#d4d4d4" />
              </linearGradient>
              <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="45%" stopColor="transparent" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.6)" />
                <stop offset="55%" stopColor="transparent" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <text
              x="60"
              y="72"
              textAnchor="middle"
              fill="url(#metallic)"
              fontSize="52"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontWeight="400"
              letterSpacing="-2"
            >
              ZL
            </text>
            <rect
              x="0" y="0" width="120" height="120"
              fill="url(#shine)"
              className="splash-shine-sweep"
            />
          </svg>
        </div>

        {/* Brand name */}
        <h1 className="splash-brand">ZERO LIMIT</h1>

        {/* Tagline */}
        <p className="splash-tagline">Beyond Limits. Beyond Style.</p>

        {/* Loading bar */}
        <div className="splash-loading-track">
          <div className="splash-loading-bar" />
        </div>
      </div>
    </div>
  )
}
