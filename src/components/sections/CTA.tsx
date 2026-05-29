"use client";
export default function CTA() {
  return (
    <section
      style={{
        backgroundColor: "var(--bg-primary)",
        padding: "100px 48px",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 800,
            fontSize: "clamp(32px, 5vw, 64px)",
            color: "var(--text-white)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: "16px",
            maxWidth: "600px",
          }}
        >
          Stop sending resumes that get torn apart!
        </h2>

        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "14px",
            color: "var(--text-muted)",
            marginBottom: "40px",
          }}
        >
          We rebuild it to pass ATS and get responses
        </p>

        <button
          style={{
            padding: "14px 32px",
            background: "var(--accent-red)",
            border: "none",
            borderRadius: "999px",
            color: "var(--text-white)",
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            fontSize: "14px",
            cursor: "pointer",
            transition: "opacity 0.2s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.85";
            e.currentTarget.style.transform = "scale(1.03)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Rebuild my Resume
        </button>
      </div>
    </section>
  );
}