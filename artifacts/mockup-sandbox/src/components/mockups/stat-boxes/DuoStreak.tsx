const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const DATES = [27, 28, 29, 30, 1, 2, 3];
const TODAY_IDX = 4; // FRI = index 4

const HABITS = [
  {
    name: "Morning Movement",
    color: "#22c55e",
    done: [true, true, true, false, true, false, false],
  },
  {
    name: "Deep Work Session",
    color: "#3b82f6",
    done: [true, false, true, true, true, false, false],
  },
  {
    name: "Evening Reflection",
    color: "#a855f7",
    done: [false, true, false, true, true, false, false],
  },
];

export function DuoStreak() {
  const streak = 7;
  const sessions = 24;

  return (
    <div className="min-h-screen flex items-start justify-center" style={{ background: "#07090f" }}>
      <div style={{ width: 390, fontFamily: "system-ui, -apple-system, sans-serif" }}>

        {/* ── Orange hero — streak + sessions + bottom glow tail ── */}
        <div style={{
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Main orange ambient glow */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 130% 110% at 70% 25%, rgba(251,146,60,0.30) 0%, rgba(251,146,60,0.10) 55%, rgba(251,146,60,0.04) 75%, transparent 90%)",
            pointerEvents: "none",
          }} />
          {/* Secondary glow behind number */}
          <div style={{
            position: "absolute", top: 0, left: 0, width: 300, height: 300,
            background: "radial-gradient(circle, rgba(251,146,60,0.16) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Streak + flame row */}
          <div style={{ position: "relative", padding: "36px 24px 0" }}>
            {/* 🔥 Flame — absolute right, vertically centered with the number */}
            <div style={{
              position: "absolute",
              top: 54,
              right: 40,
              fontSize: 124,
              lineHeight: 1,
              filter: "drop-shadow(0 0 20px rgba(251,146,60,0.85)) drop-shadow(0 0 50px rgba(251,146,60,0.4))",
              userSelect: "none",
            }}>
              🔥
            </div>

            {/* Number — left side */}
            <div style={{
              fontSize: 100,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-3px",
              color: "#fff8f0",
              textShadow: "0 0 30px rgba(251,146,60,0.95), 0 0 80px rgba(251,146,60,0.45)",
              marginBottom: 4,
              marginLeft: 24,
            }}>
              {streak}
            </div>

            {/* Label — left-aligned, directly under number */}
            <div style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#fb923c",
              textShadow: "0 0 14px rgba(251,146,60,0.75)",
              marginBottom: 18,
            }}>
              day streak!
            </div>

            {/* Sessions Done card */}
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
              marginBottom: 0,
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
                  fontSize: 17, fontWeight: 800,
                  color: "#bfdbfe",
                  textShadow: "0 0 12px rgba(96,165,250,0.55)",
                  marginBottom: 4,
                }}>
                  {sessions} Sessions Done
                </div>
                <div style={{ fontSize: 12, color: "rgba(180,200,230,0.55)", fontWeight: 500 }}>
                  total momentum sessions completed
                </div>
              </div>
            </div>
          </div>

          {/* Neon orange tail — below sessions card, above the divider line */}
          <div style={{
            position: "relative",
            height: 36,
            background: "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(251,146,60,0.18) 0%, rgba(251,146,60,0.06) 60%, transparent 100%)",
          }} />

          {/* Divider glow line */}
          <div style={{
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(251,146,60,0.5) 20%, rgba(251,146,60,0.5) 80%, transparent)",
          }} />
        </div>

        {/* ── Weekly habit tracker ── */}
        <div style={{ padding: "20px 12px 0" }}>

          {/* Month nav */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
            padding: "0 4px",
          }}>
            <span style={{ fontSize: 18, color: "rgba(148,163,184,0.5)", cursor: "pointer", padding: "0 8px" }}>{"<"}</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: "rgba(226,232,240,0.85)", letterSpacing: "0.05em" }}>05 / 2026</span>
            <span style={{ fontSize: 18, color: "rgba(148,163,184,0.5)", cursor: "pointer", padding: "0 8px" }}>{">"}</span>
          </div>

          {/* Day header row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr repeat(7, 1fr)",
            gap: 4,
            marginBottom: 6,
          }}>
            <div /> {/* Habit name column spacer */}
            {DAYS.map((d, i) => (
              <div key={d} style={{ textAlign: "center" }}>
                <div style={{
                  fontSize: 9, fontWeight: 700,
                  color: i === TODAY_IDX ? "#fb923c" : "rgba(100,116,139,0.7)",
                  letterSpacing: "0.08em",
                  marginBottom: 3,
                }}>
                  {d}
                </div>
                <div style={{
                  fontSize: 11, fontWeight: 700,
                  color: i === TODAY_IDX ? "#fb923c" : "rgba(148,163,184,0.55)",
                  textShadow: i === TODAY_IDX ? "0 0 8px rgba(251,146,60,0.5)" : "none",
                }}>
                  {DATES[i]}
                </div>
              </div>
            ))}
          </div>

          {/* Habit rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
            {HABITS.map((habit) => (
              <div key={habit.name} style={{
                display: "grid",
                gridTemplateColumns: "1fr repeat(7, 1fr)",
                gap: 4,
                alignItems: "center",
              }}>
                {/* Habit name */}
                <div style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "rgba(148,163,184,0.65)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  paddingRight: 4,
                }}>
                  {habit.name.split(" ")[0]}
                </div>
                {/* Dots */}
                {habit.done.map((done, di) => (
                  <div key={di} style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{
                      width: 28, height: 28,
                      borderRadius: "50%",
                      background: done ? habit.color : "rgba(255,255,255,0.05)",
                      border: done ? "none" : "1.5px solid rgba(255,255,255,0.08)",
                      boxShadow: done ? `0 0 8px ${habit.color}55` : "none",
                      opacity: di > TODAY_IDX ? 0.3 : 1,
                    }} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
