"use client";

import { useRef, useState } from "react";
import { useEffect } from "react";
import CardStack from "@/components/ui/CardStack";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import MiniResumeCard from "@/components/resume/MiniResumeCard";

const stackCards = [
  <MiniResumeCard key={1} optimized={false} name="Aryan Mehta" role="Product Designer" score={42} />,
  <MiniResumeCard key={2} optimized={true} name="Aryan Mehta" role="Product Designer" score={73} />,
  <MiniResumeCard key={3} optimized={false} name="Priya Sharma" role="Frontend Engineer" score={38} />,
  <MiniResumeCard key={4} optimized={true} name="Priya Sharma" role="Frontend Engineer" score={81} />,
  <MiniResumeCard key={5} optimized={false} name="Rohan Das" role="Data Analyst" score={45} />,
];

export default function Hero() {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [jobUrl, setJobUrl] = useState("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  return (
    <section
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--accent-red)",
        padding: "0 48px",
        paddingTop: "56px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1400px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          alignItems: "center",
        }}
      >
        {/* Left: Copy + Form */}
<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Headline */}
                <div>
                    <h1
                    style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 800,
                        fontSize: "clamp(36px, 5vw, 64px)",
                        lineHeight: 1.05,
                        color: "#1a0a04",
                        letterSpacing: "-0.03em",
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3em",
                    }}
                    >
                    BEAT
                    <ContainerTextFlip
                        words={["ATS", "REJECTIONS", "SCREENING", "COMPETITION", "MEDIOCRITY"]}
                        interval={2500}
                        animationDuration={600}
                        textClassName="text-[#e8823a]"
                    />
                    </h1>
                    <h2
                    style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 700,
                        fontSize: "clamp(18px, 2.5vw, 28px)",
                        color: "#1a0a04",
                        marginTop: "12px",
                        lineHeight: 1.3,
                    }}
                    >
                    Stop sending the same resume.
                    <br />
                    Start getting interview invites.
                    </h2>
                </div>

                {/* Upload Card */}
                <div
                    style={{
                    background: "rgba(0,0,0,0.15)",
                    borderRadius: "12px",
                    padding: "20px",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(0,0,0,0.1)",
                    }}
                >
                    {/* Card Header */}
                    <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "16px",
                    }}
                    >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                        style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "8px",
                            background: "rgba(0,0,0,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                        }}
                        >
                        ↑
                        </div>
                        <span
                        style={{
                            fontFamily: "var(--font-sans)",
                            fontWeight: 700,
                            fontSize: "16px",
                            color: "#1a0a04",
                        }}
                        >
                        Upload resume
                        </span>
                    </div>
                    <span
                        style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        color: "rgba(26,10,4,0.5)",
                        letterSpacing: "0.05em",
                        }}
                    >
                        PDF or DOCX
                    </span>
                    </div>

                    {/* Drop Zone */}
                    <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    style={{
                        border: dragActive
  ? "2px dashed rgba(245,240,232,0.6)"
  : "2px dashed rgba(245,240,232,0.2)",
                        borderRadius: "8px",
                        padding: "28px 20px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        background: dragActive ? "rgba(255,255,255,0.05)" : "transparent",
                        marginBottom: "14px",
                        gap: "4px",
                    }}
                    >
                    <p
                        style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 700,
                        fontSize: "14px",
                        color: "var(--text-cream)",
                        margin: 0,
                        }}
                    >
                        {fileName ? fileName : "Drag & drop your file here"}
                    </p>
                    {!fileName && (
                        <>
                        <p
                            style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "12px",
                            color: "rgba(26,10,4,0.5)",
                            margin: 0,
                            }}
                        >
                            or click to browse
                        </p>
                        <p
                            style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "11px",
                            color: "rgba(26,10,4,0.4)",
                            margin: 0,
                            marginTop: "4px",
                            }}
                        >
                            Private. Not stored. Not shared.
                        </p>
                        </>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                    </div>

                    {/* LinkedIn hint */}
                    <p
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "12px",
                        color: "rgba(26,10,4,0.55)",
                        marginBottom: "16px",
                    }}
                    >
                    No resume?{" "}
                    <span
                        style={{
                        color: "#1a0a04",
                        fontWeight: 700,
                        textDecoration: "underline",
                        cursor: "pointer",
                        }}
                    >
                        Save your LinkedIn profile
                    </span>{" "}
                    as a PDF and use that.
                    </p>

                    {/* OR divider */}
                    <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "16px",
                    }}
                    >
                    <div style={{ flex: 1, height: "1px", background: "rgba(26,10,4,0.15)" }} />
                    <span
                        style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        color: "rgba(26,10,4,0.4)",
                        letterSpacing: "0.1em",
                        }}
                    >
                        OR
                    </span>
                    <div style={{ flex: 1, height: "1px", background: "rgba(26,10,4,0.15)" }} />
                    </div>

                    {/* Job URL input */}
                    <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        background: "rgba(255,255,255,0.5)",
                        border: "1px solid rgba(26,10,4,0.15)",
                        borderRadius: "8px",
                        padding: "0 16px",
                        marginBottom: "10px",
                    }}
                    >
                    <span style={{ fontSize: "14px", opacity: 0.4 }}>⇨</span>
                    <input
                        type="url"
                        placeholder="Paste job posting URL"
                        value={jobUrl}
                        onChange={(e) => setJobUrl(e.target.value)}
                        style={{
                        flex: 1,
                        height: "46px",
                        background: "transparent",
                        border: "none",
                        fontFamily: "var(--font-mono)",
                        fontSize: "13px",
                        color: "#1a0a04",
                        outline: "none",
                        }}
                    />
                    </div>

                    {/* Paste JD link */}
                    <p
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "12px",
                        color: "#1a0a04",
                        fontWeight: 700,
                        textDecoration: "underline",
                        cursor: "pointer",
                        marginBottom: "20px",
                    }}
                    >
                    or paste job description
                    </p>

                    {/* CTA Button */}
                    <button
                    style={{
                        width: "100%",
                        padding: "14px",
                        background: "rgba(0,0,0,0.75)",
                        border: "none",
                        borderRadius: "8px",
                        color: "var(--text-cream)",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        letterSpacing: "0.02em",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#1a0a04";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(0,0,0,0.75)";
                    }}
                    >
                    See your match before you pay
                    </button>
                </div>
                </div>

        {/* Right: Card Stack placeholder */}
        <div
            style={{
                height: "580px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            >
            <CardStack cards={stackCards} />
            </div>
      </div>
    </section>
  );
}