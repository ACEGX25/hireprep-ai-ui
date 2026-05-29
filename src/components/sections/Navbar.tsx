"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "0 48px",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "background 0.3s ease, backdrop-filter 0.3s ease",
        background: scrolled ? "rgba(10,10,10,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "none",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: "20px",
          color: scrolled ? "var(--text-cream)" : "#1a1008",
          textDecoration: "none",
          letterSpacing: "-0.02em",
        }}
      >
        HirePrep AI.
      </Link>

      {/* Nav Links */}
      <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
        {["How it works", "Pricing", "FAQ"].map((item) => (
          <Link
            key={item}
            href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: "15px",
              color: scrolled ? "var(--text-cream)" : "#1a1008",
              textDecoration: "none",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {item}
          </Link>
        ))}

        {/* CTA Button */}
        <button
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            fontSize: "14px",
            padding: "8px 24px",
            background: "transparent",
            border: `2px solid ${scrolled ? "var(--text-cream)" : "#1a1008"}`,
            color: scrolled ? "var(--text-cream)" : "#1a1008",
            cursor: "pointer",
            borderRadius: "2px",
            transition: "all 0.2s",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = scrolled ? "var(--text-cream)" : "#1a1008";
            e.currentTarget.style.color = scrolled ? "#0a0a0a" : "var(--accent-red)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = scrolled ? "var(--text-cream)" : "#1a1008";
          }}
        >
          Get Started
        </button>
      </div>
    </nav>
  );
}