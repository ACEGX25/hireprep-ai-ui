"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useResultStore, type AnalysisResult, type RoadmapWeek } from "@/store/resultStore";
import ThemeToggle from "@/components/ui/ThemeToggle";

// ── Score Arc ──────────────────────────────────────────────────────────────
function ScoreArc({ score }: { score: number }) {
  const r = 54;
  const cx = 70;
  const cy = 70;
  const circumference = 2 * Math.PI * r;
  const filled = (score / 100) * circumference;
  const rounded = Math.round(score);

  return (
    <svg width={140} height={140} viewBox="0 0 140 140">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={score >= 70 ? "#2ecc71" : score >= 45 ? "#e8823a" : "#c94a3a"}
        strokeWidth="8"
        strokeDasharray={`${filled} ${circumference - filled}`}
        strokeLinecap="round"
        transform="rotate(-90 70 70)"
      />
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#f5f0e8"
        style={{ fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: "22px" }}>
        {rounded}%
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#a89880"
        style={{ fontFamily: "var(--font-mono)", fontSize: "10px" }}>
        match score
      </text>
    </svg>
  );
}

// ── Skill Pill ─────────────────────────────────────────────────────────────
function Pill({ label, variant = "neutral" }: { label: string; variant?: "neutral" | "green" | "red" | "orange" }) {
  const colors: Record<string, { bg: string; border: string; color: string }> = {
    neutral: { bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.1)", color: "#a89880" },
    green:   { bg: "rgba(46,204,113,0.1)",  border: "rgba(46,204,113,0.3)", color: "#2ecc71" },
    red:     { bg: "rgba(201,74,58,0.1)",   border: "rgba(201,74,58,0.3)",  color: "#c94a3a" },
    orange:  { bg: "rgba(232,130,58,0.1)",  border: "rgba(232,130,58,0.3)", color: "#e8823a" },
  };
  const c = colors[variant];
  return (
    <span style={{
      fontSize: "11px",
      padding: "3px 8px",
      borderRadius: "4px",
      background: c.bg,
      border: `1px solid ${c.border}`,
      color: c.color,
      fontFamily: "var(--font-mono)",
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

// ── Card wrapper ───────────────────────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "20px",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "var(--font-mono)",
      fontSize: "10px",
      letterSpacing: "0.15em",
      color: "var(--accent-red)",
      textTransform: "uppercase",
      margin: "0 0 12px",
    }}>
      {children}
    </p>
  );
}

// ── Roadmap Chevron ────────────────────────────────────────────────────────
function Chevron({
  week, theme, color, active, hovered, index,
  onHover, onLeave, onClick,
}: {
  week: string; theme: string; color: string;
  active: boolean; hovered: boolean; index: number;
  onHover: () => void; onLeave: () => void; onClick: () => void;
}) {
  const isOdd = index % 2 === 0;
  return (
    <motion.div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      animate={{ y: hovered ? (isOdd ? -8 : 8) : 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{
        flex: 1,
        position: "relative",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "56px",
        background: active ? color : `${color}88`,
        clipPath: index === 0
          ? "polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%)"
          : "polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%, 16px 50%)",
        marginLeft: index === 0 ? 0 : "-1px",
        transition: "background 0.2s",
        zIndex: active ? 2 : 1,
      }}
    >
      <div style={{ textAlign: "center", padding: "0 24px" }}>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "9px",
          color: "rgba(255,255,255,0.7)",
          margin: "0 0 2px",
          letterSpacing: "0.1em",
        }}>
          {week.toUpperCase()}
        </p>
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: "12px",
          fontWeight: 700,
          color: "#fff",
          margin: 0,
        }}>
          {theme}
        </p>
      </div>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function ResultsPage() {
  const router = useRouter();
  const result = useResultStore((s) => s.result);
  const [activeWeek, setActiveWeek] = useState(0);
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);

  // Guard: redirect to upload if no result in store
  useEffect(() => {
    if (!result) {
      router.replace("/upload");
    }
  }, [result, router]);

  if (!result) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)", fontSize: "14px" }}>
          Loading results…
        </p>
      </main>
    );
  }

  const d = result;
  const missingSet = new Set(d.missing);
  const roadmap: RoadmapWeek[] = Array.isArray(d.roadmap) ? d.roadmap : [];
  const activeRoadmap = roadmap[activeWeek] ?? null;

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "0" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundSize: "20px 20px", backgroundImage: "radial-gradient(var(--dot-color) 1px, transparent 1px)" }} />
      <div
        className="pointer-events-none absolute inset-0 bg-[var(--bg-primary)] [mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)]"
        style={{ zIndex: 1 }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Navbar */}
        <nav style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          padding: "0 32px",
          borderBottom: "1px solid var(--border)",
          justifyContent: "space-between",
        }}>
          <span style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 800,
            fontSize: "18px",
            color: "var(--text-cream)",
            letterSpacing: "-0.03em",
            cursor: "pointer",
          }}
            onClick={() => router.push("/")}
          >
            HirePrep <span style={{ color: "var(--accent-red)" }}>AI.</span>
          </span>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <ThemeToggle size={34} />
            <button
              onClick={() => router.push("/upload")}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--text-muted)",
                cursor: "pointer",
              }}>
              New Analysis
            </button>
          </div>
        </nav>

        {/* Grid */}
        <div style={{
          padding: "32px",
          display: "grid",
          gridTemplateColumns: "280px 1fr 1fr",
          gridTemplateRows: "auto auto auto",
          gap: "16px",
          maxWidth: "1440px",
          margin: "0 auto",
        }}>

          {/* A — Score Card */}
          <Card style={{ gridColumn: "1", gridRow: "1" }}>
            <CardLabel>Match Score</CardLabel>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
              <ScoreArc score={d.match_score} />
              <div style={{ textAlign: "center" }}>
                <p style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                  color: "var(--accent-orange)",
                  margin: "0 0 4px",
                }}>
                  {d.matched.length} / {d.jd_skills.length} matched
                </p>
                <p style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "var(--text-cream)",
                  margin: "0 0 2px",
                }}>
                  {d.name}
                </p>
              </div>
            </div>
          </Card>

          {/* B — Resume Skills */}
          <Card style={{ gridColumn: "2", gridRow: "1", maxHeight: "280px", overflowY: "auto" }}>
            <CardLabel>Resume Skills — {d.resume_skills.length}</CardLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {d.resume_skills.map((s, i) => (
                <Pill key={`rs-${i}`} label={s} variant="neutral" />
              ))}
            </div>
          </Card>

          {/* C — JD Skills */}
          <Card style={{ gridColumn: "3", gridRow: "1", maxHeight: "280px", overflowY: "auto" }}>
            <CardLabel>Role Requires — {d.jd_skills.length}</CardLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {d.jd_skills.map((s, i) => (
                <Pill key={`jd-${i}`} label={s} variant={missingSet.has(s) ? "orange" : "green"} />
              ))}
            </div>
          </Card>

          {/* D — Matched vs Missing */}
          <Card style={{ gridColumn: "1 / -1", gridRow: "2" }}>
            <CardLabel>Skill Analysis</CardLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr", gap: "24px" }}>

              {/* Matched */}
              <div>
                <p style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "#2ecc71",
                  marginBottom: "12px",
                  letterSpacing: "0.1em",
                }}>
                  ✅ MATCHED ({d.matched.length})
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {d.matched.map((m, i) => (
                    <div key={`match-${i}`} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Pill label={m.jd} variant="green" />
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)" }}>
                        ← {m.resume}
                      </span>
                      <div style={{ flex: 1, height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${m.score * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          style={{ height: "100%", background: "#2ecc71", borderRadius: "2px" }}
                        />
                      </div>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)", minWidth: "36px" }}>
                        {(m.score * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div style={{ background: "var(--border)" }} />

              {/* Missing */}
              <div>
                <p style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--accent-red)",
                  marginBottom: "12px",
                  letterSpacing: "0.1em",
                }}>
                  ❌ MISSING ({d.missing.length})
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {d.missing.map((s, i) => (
                    <Pill key={`miss-${i}`} label={s} variant="red" />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* E — Roadmap */}
          {roadmap.length > 0 && (
            <Card style={{ gridColumn: "1 / -1", gridRow: "3" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <CardLabel>Learning Roadmap</CardLabel>
              </div>

              {/* Chevron chain */}
              <div style={{ display: "flex", marginBottom: "24px", overflow: "hidden", borderRadius: "6px" }}>
                {roadmap.map((week, i) => (
                  <Chevron
                    key={i}
                    index={i}
                    week={week.week}
                    theme={week.theme}
                    color={week.color || "#c94a3a"}
                    active={activeWeek === i}
                    hovered={hoveredWeek === i}
                    onHover={() => setHoveredWeek(i)}
                    onLeave={() => setHoveredWeek(null)}
                    onClick={() => setActiveWeek(i)}
                  />
                ))}
              </div>

              {/* Expanded week content */}
              {activeRoadmap && (
                <motion.div
                  key={activeWeek}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    gap: "16px",
                  }}
                >
                  {/* Goal */}
                  <div style={{ padding: "14px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--accent-red)", letterSpacing: "0.15em", margin: "0 0 8px" }}>
                      GOAL
                    </p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--text-cream)", margin: "0 0 10px", fontWeight: 600 }}>
                      {activeRoadmap.goal}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {(activeRoadmap.skills ?? []).map((s, i) => (
                        <p key={`skill-${i}`} style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>
                          · {s}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Resource */}
                  <div style={{ padding: "14px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--accent-orange)", letterSpacing: "0.15em", margin: "0 0 8px" }}>
                      RESOURCE
                    </p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--text-cream)", margin: "0 0 10px", fontWeight: 600 }}>
                      {activeRoadmap.resource}
                    </p>
                    {activeRoadmap.resourceUrl && (
                      <a href={activeRoadmap.resourceUrl} target="_blank" rel="noopener noreferrer"
                        style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--accent-red)", textDecoration: "underline" }}>
                        Open resource →
                      </a>
                    )}
                  </div>

                  {/* Milestone */}
                  <div style={{ padding: "14px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "#2ecc71", letterSpacing: "0.15em", margin: "0 0 8px" }}>
                      MILESTONE
                    </p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--text-cream)", margin: 0, fontWeight: 600 }}>
                      {activeRoadmap.milestone}
                    </p>
                  </div>

                  {/* Outcomes */}
                  <div style={{ padding: "14px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid var(--border)" }}>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)", letterSpacing: "0.15em", margin: "0 0 8px" }}>
                      OUTCOMES
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {(activeRoadmap.outcomes ?? []).map((o, i) => (
                        <p key={`out-${i}`} style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>
                          ✓ {o}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}