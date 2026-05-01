import { useState, useEffect, useRef } from "react";

const LINES = [
  "You know your goal.",
  "You know your habit.",
  "You know your why.",
  "The Momentum Generator takes all of that —",
  "And makes you move. Right now.",
];

const BREATHE_DELAY = 800;
const DIM_DURATION = 1600;
const CURTAIN_CLOSE = 800;
const CURTAIN_OPEN = 900;

type Phase =
  | "breathe"
  | "dimming"
  | "closing"
  | "text"
  | "opening"
  | "done";

function MockDashboard() {
  return (
    <div className="w-full h-full flex flex-col" style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1b2e 100%)" }}>
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div style={{ color: "#60a5fa", fontSize: 11, fontFamily: "monospace", letterSpacing: "0.15em" }}>MASTERY DASHBOARD</div>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.3)" }} />
      </div>
      <div className="px-4 flex flex-col gap-2 flex-1">
        {["Morning Movement", "Deep Work Session", "Evening Reflection"].map((h, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid #fbbf24", background: i === 0 ? "#fbbf24" : "transparent" }} />
            <span style={{ fontSize: 11, color: i === 0 ? "#fff" : "rgba(255,255,255,0.45)", fontFamily: "system-ui" }}>{h}</span>
          </div>
        ))}
        <div style={{ flex: 1, display: "flex", alignItems: "flex-end", paddingBottom: 8 }}>
          <div style={{ width: "100%", height: 36, borderRadius: "18px 18px 0 0", background: "linear-gradient(90deg, #f59e0b, #f97316)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#000", letterSpacing: "0.08em" }}>MOMENTUM</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CurtainPull() {
  const [phase, setPhase] = useState<Phase>("breathe");
  const [dimOpacity, setDimOpacity] = useState(0);
  const [curtainClosed, setCurtainClosed] = useState(false);
  const [lineIndex, setLineIndex] = useState(-1);
  const [showReveal, setShowReveal] = useState(false);

  const timeoutsRef = useRef<number[]>([]);

  function addTimeout(fn: () => void, delay: number) {
    const id = window.setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  }

  function cleanup() {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }

  function runSequence() {
    cleanup();
    setPhase("breathe");
    setDimOpacity(0);
    setCurtainClosed(false);
    setLineIndex(-1);
    setShowReveal(false);

    // Breathe → start dimming
    addTimeout(() => {
      setPhase("dimming");
      setDimOpacity(0.75);
    }, BREATHE_DELAY);

    // Curtains close
    const closeStart = BREATHE_DELAY + DIM_DURATION + 200;
    addTimeout(() => {
      setPhase("closing");
      setCurtainClosed(true);
    }, closeStart);

    // Text begins after curtains are fully closed
    const textStart = closeStart + CURTAIN_CLOSE + 250;
    addTimeout(() => {
      setPhase("text");
      LINES.forEach((_, i) => {
        addTimeout(() => setLineIndex(i), i * 1000);
      });
    }, textStart);

    // Curtains open after all lines + a beat
    const openStart = textStart + LINES.length * 1000 + 900;
    addTimeout(() => {
      setPhase("opening");
      setLineIndex(-1);
      setCurtainClosed(false);
      setDimOpacity(0);
    }, openStart);

    // Reveal glow + loop
    addTimeout(() => {
      setShowReveal(true);
      addTimeout(() => {
        setShowReveal(false);
        addTimeout(() => runSequence(), 800);
      }, 1200);
    }, openStart + CURTAIN_OPEN + 200);
  }

  useEffect(() => {
    runSequence();
    return cleanup;
  }, []);

  const dimTransition = phase === "dimming"
    ? `opacity ${DIM_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
    : phase === "opening"
    ? `opacity ${CURTAIN_OPEN}ms ease-out`
    : "none";

  // Curtain texture via CSS radial gradient — rich dark plum
  const curtainGradient =
    "linear-gradient(to bottom, #2e0a3a 0%, #1a0520 40%, #2e0a3a 70%, #12031a 100%)";
  const curtainRibbing =
    "repeating-linear-gradient(to right, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 12px)";

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: "#000" }}>
      {/* Dashboard beneath everything */}
      <MockDashboard />

      {/* Dim overlay (shows silhouette of dashboard through curtain dim) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "#000",
          opacity: dimOpacity,
          transition: dimTransition,
        }}
      />

      {/* Golden reveal glow when curtains open */}
      {showReveal && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 80%, rgba(251,191,36,0.18) 0%, transparent 70%)",
            animation: "revealGlow 1.2s ease-out forwards",
          }}
        />
      )}

      {/* LEFT curtain panel */}
      <div
        className="absolute top-0 left-0 h-full pointer-events-none"
        style={{
          width: "50%",
          background: curtainGradient,
          backgroundSize: "100% 100%, 12px 100%",
          transform: curtainClosed ? "translateX(0%)" : "translateX(-100%)",
          transition: `transform ${curtainClosed ? CURTAIN_CLOSE : CURTAIN_OPEN}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          zIndex: 20,
          boxShadow: curtainClosed ? "4px 0 24px rgba(0,0,0,0.6)" : "none",
        }}
      >
        {/* Ribbing texture overlay */}
        <div className="absolute inset-0" style={{ background: curtainRibbing }} />
        {/* Curtain rod nubs at top */}
        {[15, 35, 55, 75, 95].map(pct => (
          <div key={pct} className="absolute top-0" style={{ left: `${pct}%`, width: 6, height: 6, borderRadius: "50%", background: "#c4a55a", transform: "translate(-50%, -3px)", boxShadow: "0 2px 4px rgba(0,0,0,0.5)" }} />
        ))}
      </div>

      {/* RIGHT curtain panel */}
      <div
        className="absolute top-0 right-0 h-full pointer-events-none"
        style={{
          width: "50%",
          background: curtainGradient,
          transform: curtainClosed ? "translateX(0%)" : "translateX(100%)",
          transition: `transform ${curtainClosed ? CURTAIN_CLOSE : CURTAIN_OPEN}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          zIndex: 20,
          boxShadow: curtainClosed ? "-4px 0 24px rgba(0,0,0,0.6)" : "none",
        }}
      >
        <div className="absolute inset-0" style={{ background: curtainRibbing }} />
        {[5, 25, 45, 65, 85].map(pct => (
          <div key={pct} className="absolute top-0" style={{ left: `${pct}%`, width: 6, height: 6, borderRadius: "50%", background: "#c4a55a", transform: "translate(-50%, -3px)", boxShadow: "0 2px 4px rgba(0,0,0,0.5)" }} />
        ))}
      </div>

      {/* Gold curtain rod */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{ height: 5, background: "linear-gradient(to right, #8a6000, #c4a55a, #fde68a, #c4a55a, #8a6000)", zIndex: 25 }}
      />

      {/* Curtain text content — appears over closed curtain */}
      {(phase === "text") && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ zIndex: 30, pointerEvents: "none" }}
        >
          <div className="flex flex-col items-center gap-3 px-6 text-center" style={{ maxWidth: 280 }}>
            {LINES.map((line, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "system-ui",
                  fontWeight: 700,
                  fontSize: i === LINES.length - 1 ? 14 : 12,
                  color: i === LINES.length - 1 ? "#facc15" : "rgba(255,240,210,0.92)",
                  opacity: i <= lineIndex ? 1 : 0,
                  transform: i <= lineIndex ? "translateY(0)" : "translateY(10px)",
                  transition: "opacity 0.55s ease-out, transform 0.55s ease-out",
                  textShadow: "0 1px 8px rgba(0,0,0,0.8)",
                  marginTop: i === LINES.length - 1 ? 6 : 0,
                }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Phase badge */}
      <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)", borderRadius: 4, padding: "2px 6px", fontSize: 9, color: "#a78bfa", fontFamily: "monospace", letterSpacing: "0.1em", zIndex: 100 }}>
        CURTAIN PULL
      </div>

      <style>{`
        @keyframes revealGlow {
          0% { opacity: 0 }
          30% { opacity: 1 }
          100% { opacity: 0 }
        }
      `}</style>
    </div>
  );
}
