"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// ── Hardcoded pipeline output ──────────────────────────────────────────────
const DATA = {
  candidate: "Ashutosh Waghire",
  role: "Full Stack Developer",
  score: 45.0,
  matched: 9,
  total: 20,
  resumeSkills: [
    "angular", "athletrix", "aws ec2", "cd basics", "css3",
    "devops & tools: git", "docker", "frontend basic exposure: react.js",
    "github", "hibernate", "html5", "java", "jpa", "junit 5", "mockito",
    "mockmvc", "mongodb", "mysql", "postgresql", "postman",
    "rest-based services", "restful apis", "spring boot",
    "spring data jpa", "spring mvc", "typescript",
  ],
  jdSkills: [
    "java", "javascript", "sql", "aws", "git", "microservices",
    "jenkins", "angular", "docker", "ci/cd", "kubernetes",
    "unit testing", "python", "agile", "react", "devops",
    "html", "kafka", "typescript", "azure",
  ],
  matchedSkills: [
    { jd: "java",       resume: "java",                score: 1.0  },
    { jd: "sql",        resume: "mysql",               score: 0.826 },
    { jd: "aws",        resume: "aws ec2",             score: 0.862 },
    { jd: "git",        resume: "devops & tools: git", score: 0.804 },
    { jd: "angular",    resume: "angular",             score: 1.0  },
    { jd: "docker",     resume: "docker",              score: 1.0  },
    { jd: "devops",     resume: "devops & tools: git", score: 0.835 },
    { jd: "html",       resume: "html5",               score: 0.805 },
    { jd: "typescript", resume: "typescript",          score: 1.0  },
  ],
  missingSkills: [
    "javascript", "microservices", "jenkins", "ci/cd", "kubernetes",
    "unit testing", "python", "agile", "react", "kafka", "azure",
  ],
  roadmap: [
    {
      week: "Week 1",
      theme: "JavaScript Fundamentals",
      goal: "Building a solid foundation in JavaScript",
      skills: ["Basic syntax & data types", "Variables, functions, conditionals", "ES6+ features"],
      resource: "Codecademy's JavaScript Course",
      resourceUrl: "https://www.codecademy.com/learn/javascript",
      milestone: "Build a simple calculator application",
      outcomes: ["Completed Codecademy JS Course", "Built a calculator app using JavaScript"],
      color: "#c94a3a",
    },
    {
      week: "Week 2",
      theme: "Microservices Architecture",
      goal: "Understanding microservices architecture",
      skills: ["Service boundaries & communication", "API gateways & load balancing", "Scalability & fault tolerance"],
      resource: "Martin Fowler's Microservices article on InfoQ",
      resourceUrl: "https://www.infoq.com/articles/microservices",
      milestone: "Create a RESTful API with Spring Boot simulating microservice communication",
      outcomes: ["Read Martin Fowler's Microservices article", "Integrated Spring Boot with another service"],
      color: "#e8823a",
    },
    {
      week: "Week 3",
      theme: "CI/CD with Jenkins",
      goal: "Automating testing and deployment with Jenkins",
      skills: ["Setting up Jenkins pipeline", "Test suite with JUnit & Mockito", "Jenkins + Git integration"],
      resource: "Jenkins official tutorials",
      resourceUrl: "https://www.jenkins.io/tutorials/",
      milestone: "Automate testing & deployment of a Java application",
      outcomes: ["Set up a Jenkins pipeline", "Automated testing using JUnit and Mockito"],
      color: "#7a2e18",
    },
    {
      week: "Week 4",
      theme: "Kubernetes & Unit Testing",
      goal: "Container orchestration and unit testing best practices",
      skills: ["Pod deployment & service management", "Unit testing principles", "Writing test cases for Java"],
      resource: "Kubernetes official tutorials + JUnit 5 docs",
      resourceUrl: "https://kubernetes.io/docs/tutorials/",
      milestone: "Deploy Spring Boot on Kubernetes and write unit tests",
      outcomes: ["Deployed Spring Boot on Kubernetes", "Wrote unit tests for Java application"],
      color: "#4a1a08",
    },
  ],
};

// ── Score Arc ──────────────────────────────────────────────────────────────
function ScoreArc({ score }: { score: number }) {
  const r = 54;
  const cx = 70;
  const cy = 70;
  const circumference = 2 * Math.PI * r;
  const filled = (score / 100) * circumference;

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
        {score}%
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
  const [activeWeek, setActiveWeek] = useState(0);
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  const d = DATA;

  const missingSet = new Set(d.missingSkills);

  return (
    <main style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      padding: "0",
    }}>
        <div
  className={cn(
    "absolute inset-0",
    "[background-size:20px_20px]",
    "[background-image:radial-gradient(#2a2a2a_1px,transparent_1px)]",
  )}
  style={{ zIndex: 0 }}
/>
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
        }}>
          HirePrep <span style={{ color: "var(--accent-red)" }}>AI.</span>
        </span>
        <div style={{ display: "flex", gap: "12px" }}>
          <button style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            padding: "8px 16px",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--text-muted)",
            cursor: "pointer",
          }}>
            Copy report
          </button>
          <button style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            background: "var(--accent-red)",
            color: "#fff",
            cursor: "pointer",
          }}>
            Download PDF
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
            <ScoreArc score={d.score} />
            <div style={{ textAlign: "center" }}>
              <p style={{
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                color: "var(--accent-orange)",
                margin: "0 0 4px",
              }}>
                {d.matched} / {d.total} matched
              </p>
              <p style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: "14px",
                color: "var(--text-cream)",
                margin: "0 0 2px",
              }}>
                {d.candidate}
              </p>
              <p style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--text-muted)",
                margin: 0,
              }}>
                {d.role}
              </p>
            </div>
          </div>
        </Card>

        {/* B — Resume Skills */}
        <Card style={{ gridColumn: "2", gridRow: "1", maxHeight: "280px", overflowY: "auto" }}>
          <CardLabel>Resume Skills — {d.resumeSkills.length}</CardLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {d.resumeSkills.map((s) => (
              <Pill key={s} label={s} variant="neutral" />
            ))}
          </div>
        </Card>

        {/* C — JD Skills */}
        <Card style={{ gridColumn: "3", gridRow: "1", maxHeight: "280px", overflowY: "auto" }}>
          <CardLabel>Role Requires — {d.jdSkills.length}</CardLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {d.jdSkills.map((s) => (
              <Pill key={s} label={s} variant={missingSet.has(s) ? "orange" : "green"} />
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
                ✅ MATCHED ({d.matchedSkills.length})
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {d.matchedSkills.map((m) => (
                  <div key={m.jd} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
                ❌ MISSING ({d.missingSkills.length})
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {d.missingSkills.map((s) => (
                  <Pill key={s} label={s} variant="red" />
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* E — Roadmap */}
        <Card style={{ gridColumn: "1 / -1", gridRow: "3" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <CardLabel>Learning Roadmap</CardLabel>
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={{
                fontFamily: "var(--font-mono)", fontSize: "11px",
                padding: "6px 12px", borderRadius: "6px",
                border: "1px solid var(--border)", background: "transparent",
                color: "var(--text-muted)", cursor: "pointer",
              }}>Copy</button>
              <button style={{
                fontFamily: "var(--font-mono)", fontSize: "11px",
                padding: "6px 12px", borderRadius: "6px",
                border: "none", background: "var(--accent-red)",
                color: "#fff", cursor: "pointer",
              }}>Download</button>
            </div>
          </div>

          {/* Chevron chain */}
          <div style={{ display: "flex", marginBottom: "24px", overflow: "hidden", borderRadius: "6px" }}>
            {d.roadmap.map((week, i) => (
              <Chevron
                key={i}
                index={i}
                week={week.week}
                theme={week.theme}
                color={week.color}
                active={activeWeek === i}
                hovered={hoveredWeek === i}
                onHover={() => setHoveredWeek(i)}
                onLeave={() => setHoveredWeek(null)}
                onClick={() => setActiveWeek(i)}
              />
            ))}
          </div>

          {/* Expanded week content */}
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
                {d.roadmap[activeWeek].goal}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {d.roadmap[activeWeek].skills.map((s) => (
                  <p key={s} style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>
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
                {d.roadmap[activeWeek].resource}
              </p>
              <a href={d.roadmap[activeWeek].resourceUrl} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--accent-red)", textDecoration: "underline" }}>
                Open resource →
              </a>
            </div>

            {/* Milestone */}
            <div style={{ padding: "14px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid var(--border)" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "#2ecc71", letterSpacing: "0.15em", margin: "0 0 8px" }}>
                MILESTONE
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "var(--text-cream)", margin: 0, fontWeight: 600 }}>
                {d.roadmap[activeWeek].milestone}
              </p>
            </div>

            {/* Outcomes */}
            <div style={{ padding: "14px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid var(--border)" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)", letterSpacing: "0.15em", margin: "0 0 8px" }}>
                OUTCOMES
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {d.roadmap[activeWeek].outcomes.map((o) => (
                  <p key={o} style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>
                    ✓ {o}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        </Card>
      </div>
    </div>  
    </main>
  );
}