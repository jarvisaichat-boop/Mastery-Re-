import { useState, useEffect, useRef } from 'react';

const LINES = [
  "You know your goal.",
  "You know your habit.",
  "You know your why.",
  "The Momentum Generator takes all of that —",
  "And makes you move. Right now.",
];

const NUM_BARS = 14;

interface Props {
  onReveal: () => void;
}

type Phase = 'drumroll' | 'crash' | 'lines' | 'curtain';

export default function PostTourCinematic({ onReveal }: Props) {
  const [phase, setPhase] = useState<Phase>('drumroll');
  const [barHeights, setBarHeights] = useState<number[]>(Array(NUM_BARS).fill(8));
  const [lineIndex, setLineIndex] = useState(-1);
  const [showFlash, setShowFlash] = useState(false);
  const [curtainActive, setCurtainActive] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
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
      // Show all lines instantly with no animation, then fade the overlay out
      setPhase('lines');
      setLineIndex(LINES.length - 1);
      addTimeout(() => {
        setFadeOut(true);
        addTimeout(onReveal, 400);
      }, 1500);
      return;
    }

    // PHASE 1: Drum roll — bars animate with rising intensity
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

    // At 2000ms — peak all bars, then crash
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

        // Flash lasts 130ms, then lines begin
        addTimeout(() => {
          setShowFlash(false);
          setPhase('lines');

          // Reveal each line one at a time
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

    return () => {
      if (barIntervalRef.current) clearInterval(barIntervalRef.current);
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, [isReducedMotion]);

  const overlayStyle: React.CSSProperties = curtainActive
    ? {
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
        transform: 'translateY(0)',
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
