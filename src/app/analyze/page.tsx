"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    position: 0,   // 12 o'clock
    label: "STEP 01 – EXTRACTION",
    description: "Reading your resume.\nParsing layout, sections and raw text from your PDF.",
  },
  {
    position: 1,   // 3 o'clock
    label: "STEP 02 – JOB ANALYSIS",
    description: "Reading the job posting.\nExtracting requirements, keywords and expectations.",
  },
  {
    position: 2,   // 6 o'clock
    label: "STEP 03 – MATCHING",
    description: "Comparing your resume against the job.\nScoring relevance, gaps and keyword alignment.",
  },
  {
    position: 3,   // 9 o'clock
    label: "STEP 04 – OPTIMISING",
    description: "Rewriting your resume.\nTailoring bullets, skills and summary to the role.",
  },
];

const STEP_DURATION = 2500; // ms per step
const RADIUS = 280;
const CENTER = 360;

// Angles for 12, 3, 6, 9 o'clock in degrees
const STOP_ANGLES = [270, 0, 90, 180]; // CSS angle (0 = right, so 270 = top)

function polarToXY(angleDeg: number, r: number, cx: number, cy: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToXY(startAngle, r, cx, cy);
  const end = polarToXY(endAngle, r, cx, cy);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export default function AnalyzePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [dotAngle, setDotAngle] = useState(270); // starts at 12
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const stepStartAngleRef = useRef(270);

  useEffect(() => {
    if (completed) {
      setTimeout(() => router.push("/results"), 600);
      return;
    }

    const targetAngle = currentStep === 0
      ? 270
      : STOP_ANGLES[currentStep] + (currentStep >= 1 ? 360 : 0);

    // Calculate actual target considering full rotation
    const targets = [270, 360, 450, 540, 630]; // 630 = full circle back to 12// continuous angles
    const target = targets[currentStep];
    const start = stepStartAngleRef.current;

    startTimeRef.current = performance.now();

    function animate(now: number) {
      const elapsed = now - startTimeRef.current!;
      const progress = Math.min(elapsed / STEP_DURATION, 1);
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setDotAngle(start + (target - start) * eased);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        stepStartAngleRef.current = target;
       if (currentStep < STEPS.length) {
  setCurrentStep((s) => s + 1);
} else {
  setCompleted(true);
}
      }
    }

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [currentStep, completed]);

  // Arc from 270 (12 o'clock) to current dot angle
  const arcStart = 270;
  const arcEnd = dotAngle;
  const arcPath = describeArc(CENTER, CENTER, RADIUS, arcStart, arcEnd);

  // Dot position
  const dot = polarToXY(dotAngle, RADIUS, CENTER, CENTER);

  // Stop dots at 12, 3, 6, 9
  const stopDots = STOP_ANGLES.map((angle, i) => ({
    ...polarToXY(angle, RADIUS, CENTER, CENTER),
    filled: i <= currentStep,
  }));

  const step = STEPS[Math.min(currentStep, STEPS.length - 1)];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Dot background */}
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
        <svg
          width={CENTER * 2}
          height={CENTER * 2}
          viewBox={`0 0 ${CENTER * 2} ${CENTER * 2}`}
        >
          {/* Base circle */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1.5"
          />

          {/* Filled arc — accent orange */}
          {arcEnd !== arcStart && (
            <path
              d={arcPath}
              fill="none"
              stroke="var(--accent-orange)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}

          {/* Stop dots at 12, 3, 6, 9 */}
          {stopDots.map((dot, i) => (
            <circle
              key={i}
              cx={dot.x}
              cy={dot.y}
              r={i === currentStep ? 8 : 5}
              fill={dot.filled ? "var(--accent-red)" : "rgba(255,255,255,0.2)"}
              style={{ transition: "all 0.4s" }}
            />
          ))}

          {/* Moving dot */}
          <circle
            cx={dot.x}
            cy={dot.y}
            r={7}
            fill="var(--accent-orange)"
          />
          {/* Glow */}
          <circle
            cx={dot.x}
            cy={dot.y}
            r={14}
            fill="var(--accent-orange)"
            opacity={0.2}
          />

          {/* Center text */}
          <foreignObject
            x={CENTER - 200}
            y={CENTER - 80}
            width={400}
            height={160}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                height: "100%",
                gap: "12px",
              }}
            >
              <motion.p
                key={step.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 800,
                  fontSize: "22px",
                  color: "var(--accent-red)",
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                {step.label}
              </motion.p>
              <motion.p
                key={step.description}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  lineHeight: 1.7,
                  margin: 0,
                  whiteSpace: "pre-line",
                }}
              >
                {step.description}
              </motion.p>
            </div>
          </foreignObject>
        </svg>
      </div>
    </main>
  );
}