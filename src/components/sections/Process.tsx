export default function Process() {
  const steps = [
    {
      number: "01",
      title: "Paste a job posting",
      description:
        "Add any job URL. We extract requirements, keywords, and expectations.",
    },
    {
      number: "02",
      title: "Get an optimized resume",
      description:
        "We rewrite your resume to match the role. Summary, bullets and skills all aligned",
    },
    {
      number: "03",
      title: "Apply with confidence",
      description:
        "Download your resume and apply. The whole process takes under a minute!",
    },
  ];

  return (
    <section
      id="how-it-works"
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
        {/* Label */}
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            letterSpacing: "0.15em",
            color: "var(--text-muted)",
            marginBottom: "16px",
            textTransform: "uppercase",
          }}
        >
          How it works
        </p>

        {/* Heading */}
        <h2
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 800,
            fontSize: "clamp(32px, 5vw, 60px)",
            color: "var(--text-white)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: "48px",
          }}
        >
          FROM JOB POST TO APPLICATION
          <br />
          IN UNDER A MINUTE!
        </h2>

        {/* Top divider */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            marginBottom: "0",
          }}
        />

        {/* Steps grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
          }}
        >
          {steps.map((step, i) => (
            <div
              key={step.number}
              style={{
                padding: "40px 40px 60px 0",
                borderRight:
                  i < steps.length - 1 ? "1px solid var(--border)" : "none",
                paddingLeft: i === 0 ? "0" : "40px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  marginBottom: "24px",
                }}
              >
                {step.number}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--text-white)",
                  marginBottom: "16px",
                }}
              >
                {step.title}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  lineHeight: 1.7,
                }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom divider */}
        <div style={{ borderTop: "1px solid var(--border)" }} />

        {/* Bottom taglines */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "40px 0",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              color: "var(--text-muted)",
            }}
          >
            We optimize for the job
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              color: "var(--text-muted)",
            }}
          >
            We keep what is real
          </p>
        </div>
      </div>
    </section>
  );
}