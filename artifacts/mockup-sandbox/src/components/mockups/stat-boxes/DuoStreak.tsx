export function DuoStreak() {
  const streak = 7;
  const sessions = 24;

  return (
    <div
      style={{
        width: 390,
        minHeight: 560,
        background: "#0d1424",
        fontFamily: "system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Hero streak panel */}
      <div
        style={{
          position: "relative",
          padding: "28px 24px 32px",
          background:
            "linear-gradient(160deg, rgba(251,146,60,0.18) 0%, rgba(251,146,60,0.06) 60%, transparent 100%)",
          borderBottom: "1px solid rgba(251,146,60,0.2)",
          overflow: "hidden",
        }}
      >
        {/* Radial glow blob behind the flame */}
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -30,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(251,146,60,0.22) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Outlined flame icon — Duolingo style, neon orange */}
        <div
          style={{
            position: "absolute",
            top: 18,
            right: 22,
            width: 115,
            height: 115,
          }}
        >
          <svg
            viewBox="0 0 100 115"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              width: "100%",
              height: "100%",
              filter:
                "drop-shadow(0 0 16px rgba(251,146,60,0.7)) drop-shadow(0 0 36px rgba(251,146,60,0.35))",
            }}
          >
            <path
              d="M50 8 C50 8 68 26 72 46 C74 58 68 65 65 68
                 C67 56 60 48 57 44
                 C57 56 52 64 47 70
                 C40 78 36 86 38 95
                 C30 88 24 78 26 65
                 C20 72 22 83 24 90
                 C16 82 14 68 18 55
                 C14 60 12 68 14 76
                 C8 66 8 52 14 42
                 C20 30 34 18 50 8 Z"
              stroke="#fb923c"
              strokeWidth="4"
              strokeLinejoin="round"
              fill="rgba(251,146,60,0.13)"
            />
            <ellipse cx="50" cy="97" rx="12" ry="8" stroke="#fb923c" strokeWidth="3.5" fill="rgba(251,146,60,0.18)" />
          </svg>
        </div>

        {/* Big streak number */}
        <div
          style={{
            fontSize: 76,
            fontWeight: 900,
            lineHeight: 1,
            color: "#fed7aa",
            textShadow:
              "0 0 20px rgba(251,146,60,0.85), 0 0 55px rgba(251,146,60,0.4)",
            marginBottom: 10,
          }}
        >
          {streak}
        </div>

        {/* Label */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#fb923c",
            textShadow: "0 0 10px rgba(251,146,60,0.65)",
          }}
        >
          day streak!
        </div>
      </div>

      {/* Sessions Done info card */}
      <div style={{ padding: "16px 16px 0" }}>
        <div
          style={{
            borderRadius: 16,
            padding: "16px 18px",
            background: "rgba(17,24,39,0.95)",
            border: "1.5px solid rgba(96,165,250,0.3)",
            boxShadow:
              "0 0 0 1px rgba(96,165,250,0.07), 0 6px 20px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* Icon badge */}
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              background: "rgba(96,165,250,0.15)",
              border: "1.5px solid rgba(96,165,250,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
              boxShadow: "0 0 14px rgba(96,165,250,0.25)",
            }}
          >
            ⚡
          </div>

          {/* Text */}
          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#bfdbfe",
                textShadow: "0 0 10px rgba(96,165,250,0.5)",
                marginBottom: 3,
              }}
            >
              {sessions} Sessions Done
            </div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(148,163,184,0.65)",
                fontWeight: 500,
              }}
            >
              total momentum sessions completed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
