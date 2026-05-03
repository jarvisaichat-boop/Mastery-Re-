export function DuoStreak() {
  const streak = 7;
  const sessions = 24;

  return (
    <div className="min-h-screen flex items-start justify-center" style={{ background: "#07090f" }}>
      <div style={{ width: 390, fontFamily: "system-ui, -apple-system, sans-serif" }}>

        {/* ── Hero ── */}
        <div style={{
          position: "relative",
          padding: "52px 28px 52px",
          overflow: "hidden",
        }}>
          {/* Warm orange glow fills entire hero area */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 110% 100% at 70% 40%, rgba(251,146,60,0.26) 0%, rgba(251,146,60,0.08) 50%, transparent 75%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", top: 0, left: 0, width: 260, height: 260,
            background: "radial-gradient(circle, rgba(251,146,60,0.14) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          {/* Bottom divider glow */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
            background: "linear-gradient(90deg, transparent, rgba(251,146,60,0.45) 25%, rgba(251,146,60,0.45) 75%, transparent)",
          }} />

          {/* 🔥 Flame — big, right side */}
          <div style={{
            position: "absolute",
            top: "50%", right: 24,
            transform: "translateY(-50%)",
            fontSize: 108,
            lineHeight: 1,
            filter: "drop-shadow(0 0 20px rgba(251,146,60,0.85)) drop-shadow(0 0 50px rgba(251,146,60,0.4))",
            userSelect: "none",
          }}>
            🔥
          </div>

          {/* Big streak number */}
          <div style={{
            fontSize: 100,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-3px",
            color: "#fff8f0",
            textShadow: "0 0 30px rgba(251,146,60,0.95), 0 0 80px rgba(251,146,60,0.45)",
            marginBottom: 14,
          }}>
            {streak}
          </div>

          {/* "day streak!" label */}
          <div style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#fb923c",
            textShadow: "0 0 14px rgba(251,146,60,0.75)",
          }}>
            day streak!
          </div>
        </div>

        {/* ── Sessions Done info card ── */}
        <div style={{ padding: "16px 16px 0" }}>
          <div style={{
            borderRadius: 18,
            padding: "20px 22px",
            background: "rgba(13, 20, 36, 0.98)",
            border: "1.5px solid rgba(96,165,250,0.3)",
            boxShadow: "0 0 0 1px rgba(96,165,250,0.07), 0 8px 28px rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}>
            <div style={{
              width: 52, height: 52,
              borderRadius: "50%",
              background: "rgba(96,165,250,0.12)",
              border: "1.5px solid rgba(96,165,250,0.38)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26, flexShrink: 0,
              boxShadow: "0 0 18px rgba(96,165,250,0.22)",
            }}>
              ⚡
            </div>
            <div>
              <div style={{
                fontSize: 17,
                fontWeight: 800,
                color: "#bfdbfe",
                textShadow: "0 0 12px rgba(96,165,250,0.55)",
                marginBottom: 4,
              }}>
                {sessions} Sessions Done
              </div>
              <div style={{
                fontSize: 12,
                color: "rgba(148,163,184,0.6)",
                fontWeight: 500,
              }}>
                total momentum sessions completed
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
