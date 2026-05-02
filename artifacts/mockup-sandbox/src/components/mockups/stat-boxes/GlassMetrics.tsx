export function GlassMetrics() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d1424" }}>
      <div style={{ width: 400, padding: "0 12px" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div
            style={{
              flex: 1,
              borderRadius: 16,
              padding: "18px 20px 16px",
              background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid rgba(255,255,255,0.10)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: 2,
                background: "linear-gradient(90deg, transparent, rgba(251,146,60,0.8), transparent)",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
              <span style={{ fontSize: 15 }}>🔥</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(251,146,60,0.7)", textTransform: "uppercase", fontFamily: "system-ui" }}>
                Streak
              </span>
            </div>
            <div style={{ fontSize: 40, fontWeight: 800, color: "#fb923c", lineHeight: 1, fontFamily: "system-ui", marginBottom: 5 }}>
              7
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "system-ui" }}>
              consecutive days
            </div>
          </div>

          <div
            style={{
              flex: 1,
              borderRadius: 16,
              padding: "18px 20px 16px",
              background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid rgba(255,255,255,0.10)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: 2,
                background: "linear-gradient(90deg, transparent, rgba(96,165,250,0.8), transparent)",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
              <span style={{ fontSize: 15 }}>⚡</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(96,165,250,0.7)", textTransform: "uppercase", fontFamily: "system-ui" }}>
                Days Completed
              </span>
            </div>
            <div style={{ fontSize: 40, fontWeight: 800, color: "#60a5fa", lineHeight: 1, fontFamily: "system-ui", marginBottom: 5 }}>
              24
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "system-ui" }}>
              momentum sessions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
