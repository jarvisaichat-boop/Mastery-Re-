import { useState, useEffect, useRef } from "react";

const LINES = [
  "You know your goal.",
  "You know your habit.",
  "You know your why.",
  "The Momentum Generator takes all of that —",
  "And makes you move. Right now.",
];

const NUM_BARS = 14;
const BREATHE_DELAY = 800;
const DIM_DURATION = 1600;

type Phase = "breathe" | "dimming" | "drumroll" | "crash" | "lines" | "curtain" | "done";

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

export function DrumRoll() {
  const [phase, setPhase] = useState<Phase>("breathe");
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [barHeights, setBarHeights] = useState<number[]>(Array(NUM_BARS).fill(8));
  const [lineIndex, setLineIndex] = useState(-1);
  const [showFlash, setShowFlash] = useState(false);
  const [curtainY, setCurtainY] = useState("0%");

  const barIntervalRef = useRef<number | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  function addTimeout(fn: () => void, delay: number) {
    const id = window.setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  }

  function cleanup() {
    if (barIntervalRef.current) { clearInterval(barIntervalRef.current); barIntervalRef.current = null; }
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }

  function runSequence() {
    cleanup();
    setPhase("breathe");
    setOverlayOpacity(0);
    setBarHeights(Array(NUM_BARS).fill(8));
    setLineIndex(-1);
    setShowFlash(false);
    setCurtainY("0%");

    // Breathe → dim
    addTimeout(() => {
      setPhase("dimming");
      setOverlayOpacity(1);
    }, BREATHE_DELAY);

    const drumrollStart = BREATHE_DELAY + DIM_DURATION + 100;

    addTimeout(() => {
      setPhase("drumroll");
      let tick = 0;
      barIntervalRef.current = window.setInterval(() => {
        tick++;
        const intensity = Math.min(tick * 4, 100);
        setBarHeights(Array(NUM_BARS).fill(0).map(() => Math.random() * intensity + (100 - intensity) * 0.05));
      }, 80);

      // Crash after 2s of drumroll
      addTimeout(() => {
        if (barIntervalRef.current) { clearInterval(barIntervalRef.current); barIntervalRef.current = null; }
        setPhase("crash");
        setBarHeights(Array(NUM_BARS).fill(100));
        addTimeout(() => {
          setBarHeights(Array(NUM_BARS).fill(0));
          setShowFlash(true);
          addTimeout(() => {
            setShowFlash(false);
            setPhase("lines");
            LINES.forEach((_, i) => addTimeout(() => setLineIndex(i), i * 1100));
            const curtainTime = LINES.length * 1100 + 700;
            addTimeout(() => {
              setPhase("curtain");
              setCurtainY("-100%");
              addTimeout(() => {
                setPhase("done");
                addTimeout(() => runSequence(), 1500);
              }, 700);
            }, curtainTime);
          }, 130);
        }, 300);
      }, 2000);
    }, drumrollStart);
  }

  useEffect(() => {
    runSequence();
    return cleanup;
  }, []);

  const overlayTransition = phase === "dimming"
    ? `opacity ${DIM_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
    : phase === "curtain"
    ? "transform 700ms cubic-bezier(0.4, 0, 0.2, 1)"
    : "none";

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: "#000" }}>
      {/* Mock dashboard underneath */}
      <MockDashboard />

      {/* Cinematic overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{
          background: "#000",
          opacity: overlayOpacity,
          transform: `translateY(${curtainY})`,
          transition: overlayTransition,
        }}
      >
        {showFlash && <div className="absolute inset-0 bg-white z-10" />}

        {(phase === "drumroll" || phase === "crash") && (
          <div className="flex flex-col items-center gap-8 w-full px-6">
            <p style={{ color: "#fff", fontSize: 18, fontWeight: 300, letterSpacing: "0.25em", textTransform: "uppercase", animation: "fadeIn 0.8s ease-out 0.4s both", fontFamily: "system-ui" }}>
              You made it.
            </p>
            <div className="flex items-end gap-1 w-full max-w-[200px]" style={{ height: 80 }}>
              {barHeights.map((h, i) => (
                <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: "linear-gradient(to top, #ca8a04, #fde047)", transition: "height 60ms linear", opacity: h > 0 ? 0.7 + (h / 100) * 0.3 : 0 }} />
              ))}
            </div>
          </div>
        )}

        {(phase === "lines" || phase === "curtain") && (
          <div className="flex flex-col items-center gap-4 px-6 text-center" style={{ maxWidth: 300 }}>
            {LINES.map((line, i) => (
              <p key={i} style={{ fontFamily: "system-ui", fontWeight: 700, fontSize: i === LINES.length - 1 ? 15 : 13, color: i === LINES.length - 1 ? "#facc15" : "#fff", opacity: i <= lineIndex ? 1 : 0, transform: i <= lineIndex ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.6s ease-out, transform 0.6s ease-out", marginTop: i === LINES.length - 1 ? 8 : 0 }}>
                {line}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Phase badge */}
      <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.4)", borderRadius: 4, padding: "2px 6px", fontSize: 9, color: "#fbbf24", fontFamily: "monospace", letterSpacing: "0.1em", zIndex: 300 }}>
        DRUM ROLL
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </div>
  );
}
