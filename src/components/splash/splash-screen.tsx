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
        {/* Rotating Logo */}
        <div className="splash-monogram">
          <div className="splash-logo-wrapper">
            <img
              src="/favicon.png"
              alt="Zero Limit"
              width={120}
              height={120}
              className="splash-logo-img"
            />
            {/* Metallic shine overlay */}
            <div className="splash-shine-overlay" />
          </div>
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
