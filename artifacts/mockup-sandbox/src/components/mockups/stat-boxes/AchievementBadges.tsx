export function AchievementBadges() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0d1424" }}>
      <div style={{ width: 400, padding: "0 12px" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div
            style={{
              flex: 1,
              borderRadius: 16,
              padding: "14px 16px",
              background: "rgba(17, 24, 39, 0.9)",
              border: "1.5px solid rgba(251,146,60,0.35)",
              boxShadow: "0 0 0 1px rgba(251,146,60,0.08), 0 8px 20px rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "rgba(251,146,60,0.15)",
                  border: "1.5px solid rgba(251,146,60,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                }}
              >
                🔥
              </div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: "rgba(251,146,60,0.6)",
                  textTransform: "uppercase",
                  fontFamily: "system-ui",
                  background: "rgba(251,146,60,0.1)",
                  padding: "3px 7px",
                  borderRadius: 20,
                  border: "1px solid rgba(251,146,60,0.2)",
                }}
              >
                Active
              </div>
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: "#fed7aa",
                lineHeight: 1,
                fontFamily: "system-ui",
                marginBottom: 3,
                textShadow: "0 0 12px rgba(251,146,60,0.7), 0 0 30px rgba(251,146,60,0.3)",
              }}
            >
              7
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "system-ui",
                marginBottom: 8,
                color: "#fb923c",
                textShadow: "0 0 8px rgba(251,146,60,0.5)",
              }}
            >
              Day Streak
            </div>
            <div
              style={{
                height: 3,
                borderRadius: 2,
                background: "rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "70%",
                  borderRadius: 2,
                  background: "linear-gradient(90deg, #f97316, #fb923c)",
                }}
              />
            </div>
          </div>

          <div
            style={{
              flex: 1,
              borderRadius: 16,
              padding: "14px 16px",
              background: "rgba(17, 24, 39, 0.9)",
              border: "1.5px solid rgba(96,165,250,0.35)",
              boxShadow: "0 0 0 1px rgba(96,165,250,0.08), 0 8px 20px rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "rgba(96,165,250,0.15)",
                  border: "1.5px solid rgba(96,165,250,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                }}
              >
                ⚡
              </div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: "rgba(96,165,250,0.6)",
                  textTransform: "uppercase",
                  fontFamily: "system-ui",
                  background: "rgba(96,165,250,0.1)",
                  padding: "3px 7px",
                  borderRadius: 20,
                  border: "1px solid rgba(96,165,250,0.2)",
                }}
              >
                Total
              </div>
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: "#bfdbfe",
                lineHeight: 1,
                fontFamily: "system-ui",
                marginBottom: 3,
                textShadow: "0 0 12px rgba(96,165,250,0.7), 0 0 30px rgba(96,165,250,0.3)",
              }}
            >
              24
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "system-ui",
                marginBottom: 8,
                color: "#60a5fa",
                textShadow: "0 0 8px rgba(96,165,250,0.5)",
              }}
            >
              Sessions Done
            </div>
            <div
              style={{
                height: 3,
                borderRadius: 2,
                background: "rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "48%",
                  borderRadius: 2,
                  background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
