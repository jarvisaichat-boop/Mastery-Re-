export function DuoStreak() {
  const streak = 7;
  const sessions = 24;

  return (
    <div className="min-h-screen flex items-start justify-center" style={{ background: "#07090f" }}>
      <div style={{ width: 390, fontFamily: "system-ui, -apple-system, sans-serif" }}>

        {/* ── Orange hero — contains BOTH streak and sessions card ── */}
        <div style={{
          position: "relative",
          padding: "44px 20px 28px",
          overflow: "hidden",
        }}>
          {/* Orange ambient glow fills the whole hero block */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 120% 90% at 70% 30%, rgba(251,146,60,0.28) 0%, rgba(251,146,60,0.10) 55%, transparent 80%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", top: 0, left: 0, width: 280, height: 280,
            background: "radial-gradient(circle, rgba(251,146,60,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          {/* Bottom border glow — BELOW the sessions card */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
            background: "linear-gradient(90deg, transparent, rgba(251,146,60,0.5) 25%, rgba(251,146,60,0.5) 75%, transparent)",
          }} />

          {/* 🔥 Flame — absolute right, aligns with the number */}
          <div style={{
            position: "absolute",
            top: 36,
            right: 20,
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
            marginBottom: 10,
          }}>
            {streak}
          </div>

          {/* "day streak!" label */}
          <div style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#fb923c",
            textShadow: "0 0 14px rgba(251,146,60,0.75)",
            marginBottom: 24,
          }}>
            day streak!
          </div>

          {/* ── Sessions Done card — still inside the orange hero ── */}
          <div style={{
            borderRadius: 18,
            padding: "18px 20px",
            background: "rgba(8, 14, 28, 0.75)",
            border: "1.5px solid rgba(96,165,250,0.28)",
            boxShadow: "0 0 0 1px rgba(96,165,250,0.06), 0 8px 24px rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            gap: 18,
            backdropFilter: "blur(8px)",
          }}>
            <div style={{
              width: 50, height: 50,
              borderRadius: "50%",
              background: "rgba(96,165,250,0.13)",
              border: "1.5px solid rgba(96,165,250,0.38)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, flexShrink: 0,
              boxShadow: "0 0 16px rgba(96,165,250,0.22)",
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
                color: "rgba(180,200,230,0.55)",
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
