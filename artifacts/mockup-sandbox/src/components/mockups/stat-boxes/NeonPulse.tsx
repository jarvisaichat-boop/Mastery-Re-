export function NeonPulse() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d1424" }}>
      <div style={{ width: 400, padding: "0 12px" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div
            style={{
              flex: 1,
              borderRadius: 14,
              padding: "16px 18px",
              background: "rgba(10, 14, 26, 0.95)",
              border: "1px solid rgba(251,146,60,0.5)",
              boxShadow: "0 0 16px rgba(251,146,60,0.15), inset 0 0 20px rgba(251,146,60,0.04)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(ellipse at 10% 0%, rgba(251,146,60,0.12) 0%, transparent 60%)",
                pointerEvents: "none",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 14 }}>🔥</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontFamily: "system-ui",
                  color: "#fb923c",
                  textShadow: "0 0 8px rgba(251,146,60,0.6)",
                }}
              >
                Streak
              </span>
            </div>
            <div
              style={{
                fontSize: 44,
                fontWeight: 900,
                lineHeight: 1,
                fontFamily: "system-ui",
                marginBottom: 4,
                color: "#fed7aa",
                textShadow: "0 0 12px rgba(251,146,60,0.7), 0 0 30px rgba(251,146,60,0.3)",
              }}
            >
              7
            </div>
            <div style={{ fontSize: 11, color: "rgba(251,146,60,0.45)", fontFamily: "system-ui", fontWeight: 500 }}>
              consecutive days
            </div>
          </div>

          <div
            style={{
              flex: 1,
              borderRadius: 14,
              padding: "16px 18px",
              background: "rgba(10, 14, 26, 0.95)",
              border: "1px solid rgba(96,165,250,0.5)",
              boxShadow: "0 0 16px rgba(96,165,250,0.15), inset 0 0 20px rgba(96,165,250,0.04)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(ellipse at 10% 0%, rgba(96,165,250,0.12) 0%, transparent 60%)",
                pointerEvents: "none",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 14 }}>⚡</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontFamily: "system-ui",
                  color: "#60a5fa",
                  textShadow: "0 0 8px rgba(96,165,250,0.6)",
                }}
              >
                Days Done
              </span>
            </div>
            <div
              style={{
                fontSize: 44,
                fontWeight: 900,
                lineHeight: 1,
                fontFamily: "system-ui",
                marginBottom: 4,
                color: "#bfdbfe",
                textShadow: "0 0 12px rgba(96,165,250,0.7), 0 0 30px rgba(96,165,250,0.3)",
              }}
            >
              24
            </div>
            <div style={{ fontSize: 11, color: "rgba(96,165,250,0.45)", fontFamily: "system-ui", fontWeight: 500 }}>
              momentum sessions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
