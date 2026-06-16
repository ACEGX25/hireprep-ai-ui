"use client";

import { useThemeStore } from "@/store/themeStore";
import { useEffect, useState } from "react";

/**
 * ThemeToggle — Sun/Moon toggle button.
 * Works in any navbar or page — just drop it in.
 * `variant` controls whether it renders for a light or dark surrounding bg.
 */
export default function ThemeToggle({ size = 36 }: { size?: number }) {
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // Avoid SSR hydration mismatch — render only after mount
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div style={{ width: size, height: size }} />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      style={{
        width: size,
        height: size,
        borderRadius: "8px",
        border: "1px solid var(--border)",
        background: "var(--bg-secondary)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.5,
        transition: "all 0.2s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--accent-red)";
        e.currentTarget.style.background = "var(--bg-warm)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.background = "var(--bg-secondary)";
      }}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
