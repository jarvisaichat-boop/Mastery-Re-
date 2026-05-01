import { useState, useEffect, useRef } from 'react';

const LINES = [
  "You know your goal.",
  "You know your habit.",
  "You know your why.",
  "The Momentum Generator takes all of that —",
  "And makes you move. Right now.",
];

const NUM_BARS = 14;

// How long the dashboard stays visible before dimming starts (ms)
const BREATHE_DELAY = 600;
// How long the dim-to-black transition takes (ms)
const DIM_DURATION = 1800;

interface Props {
  onReveal: () => void;
}

type Phase = 'breathe' | 'dimming' | 'drumroll' | 'crash' | 'lines' | 'curtain';

export default function PostTourCinematic({ onReveal }: Props) {
  const [phase, setPhase] = useState<Phase>('breathe');
  const [barHeights, setBarHeights] = useState<number[]>(Array(NUM_BARS).fill(8));
  const [lineIndex, setLineIndex] = useState(-1);
  const [showFlash, setShowFlash] = useState(false);
  const [curtainActive, setCurtainActive] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  // Controls the overlay opacity: 0 = transparent (dashboard shows), 1 = fully black
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [isReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const barIntervalRef = useRef<number | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  function addTimeout(fn: () => void, delay: number) {
    const id = window.setTimeout(fn, delay);
    timeoutsRef.current.push(id);
  }

  useEffect(() => {
    if (isReducedMotion) {
      // Skip breathe + drum roll — show all lines instantly then fade out
      setOverlayOpacity(1);
      setPhase('lines');
      setLineIndex(LINES.length - 1);
      addTimeout(() => {
        setFadeOut(true);
        addTimeout(onReveal, 400);
      }, 1500);
      return;
    }

    // BREATHE: give the user a moment to see the dashboard, then dim
    addTimeout(() => {
      setPhase('dimming');
      setOverlayOpacity(1); // CSS transition handles the 1.8s ease
    }, BREATHE_DELAY);

    // Drum roll begins after breathe + dim completes
    const drumrollStart = BREATHE_DELAY + DIM_DURATION + 100;

    addTimeout(() => {
      setPhase('drumroll');

      let tick = 0;
      barIntervalRef.current = window.setInterval(() => {
        tick++;
        const intensity = Math.min(tick * 4, 100);
        setBarHeights(
          Array(NUM_BARS).fill(0).map(() =>
            Math.random() * intensity + (100 - intensity) * 0.05
          )
        );
      }, 80);

      // Peak all bars, then crash 2s into drum roll
      addTimeout(() => {
        if (barIntervalRef.current) {
          clearInterval(barIntervalRef.current);
          barIntervalRef.current = null;
        }
        setPhase('crash');
        setBarHeights(Array(NUM_BARS).fill(100));

        // 300ms freeze at peak, then crash to true zero
        addTimeout(() => {
          setBarHeights(Array(NUM_BARS).fill(0));
          setShowFlash(true);
          try {
            if ('vibrate' in navigator && navigator.vibrate) {
              navigator.vibrate([30, 20, 30, 20, 200]);
            }
          } catch {}

          // Flash for 130ms, then begin impact lines
          addTimeout(() => {
            setShowFlash(false);
            setPhase('lines');

            LINES.forEach((_, i) => {
              addTimeout(() => setLineIndex(i), i * 1300);
            });

            // After last line + 800ms beat, raise the curtain
            addTimeout(() => {
              setPhase('curtain');
              setCurtainActive(true);
              addTimeout(() => {
                try {
                  if ('vibrate' in navigator && navigator.vibrate) {
                    navigator.vibrate([100, 50, 200]);
                  }
                } catch {}
                onReveal();
              }, 650);
            }, LINES.length * 1300 + 800);

          }, 130);
        }, 300);
      }, 2000);

    }, drumrollStart);

    return () => {
      if (barIntervalRef.current) clearInterval(barIntervalRef.current);
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, [isReducedMotion]);

  // Overlay visual style — handles dim fade-in, curtain rise, and reduced-motion fade-out
  const overlayStyle: React.CSSProperties = curtainActive
    ? {
        opacity: overlayOpacity,
        transform: 'translateY(-100%)',
        transition: 'transform 650ms cubic-bezier(0.4, 0, 0.2, 1)',
      }
    : fadeOut
    ? {
        opacity: 0,
        transition: 'opacity 400ms ease-out',
        pointerEvents: 'none',
      }
    : {
        opacity: overlayOpacity,
        transition: phase === 'dimming'
          ? `opacity ${DIM_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`
          : 'none',
      };

  return (
    <div
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center overflow-hidden"
      style={overlayStyle}
    >
      {/* White flash on crash */}
      {showFlash && (
        <div className="absolute inset-0 bg-white z-10 pointer-events-none" />
      )}

      {/* DRUM ROLL */}
      {(phase === 'drumroll' || phase === 'crash') && (
        <div className="flex flex-col items-center gap-10 w-full px-8">
          <p
            className="text-white text-3xl font-light tracking-[0.25em] uppercase"
            style={{
              animation: 'fadeIn 0.8s ease-out 0.4s both',
            }}
          >
            You made it.
          </p>
          <div className="flex items-end gap-1.5 h-36 w-full max-w-xs">
            {barHeights.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t"
                style={{
                  height: `${h}%`,
                  background: `linear-gradient(to top, #ca8a04, #fde047)`,
                  transition: 'height 60ms linear',
                  opacity: h > 0 ? 0.7 + (h / 100) * 0.3 : 0,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* IMPACT LINES */}
      {(phase === 'lines' || phase === 'curtain') && (
        <div className="flex flex-col items-center gap-6 px-8 text-center max-w-md">
          {LINES.map((line, i) => (
            <p
              key={i}
              className={`font-bold ${
                i <= lineIndex
                  ? isReducedMotion ? 'opacity-100' : 'animate-cinematicLine'
                  : 'opacity-0'
              } ${
                i === LINES.length - 1
                  ? 'text-yellow-400 text-2xl mt-3'
                  : 'text-white text-xl'
              }`}
            >
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
