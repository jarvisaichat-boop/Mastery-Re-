import { useState, useEffect, useRef } from 'react';
import {
  getCinematicSoundEnabled,
  setCinematicSoundEnabled,
  playDrumRoll,
  playCrash,
  playLineHit,
} from '../utils/cinematicSounds';

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
  onCurtainUp: () => void;
}

type Phase = 'breathe' | 'dimming' | 'drumroll' | 'crash' | 'lines' | 'curtain';

export default function PostTourCinematic({ onReveal, onCurtainUp }: Props) {
  const [phase, setPhase] = useState<Phase>('breathe');
  const [barHeights, setBarHeights] = useState<number[]>(Array(NUM_BARS).fill(8));
  const [lineIndex, setLineIndex] = useState(-1);
  const [showFlash, setShowFlash] = useState(false);
  const [curtainActive, setCurtainActive] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  // Controls the overlay opacity: 0 = transparent (dashboard shows), 1 = fully black
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(getCinematicSoundEnabled);
  const [isReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const barIntervalRef = useRef<number | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const stopDrumRollRef = useRef<(() => void) | null>(null);
  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  function addTimeout(fn: () => void, delay: number) {
    const id = window.setTimeout(fn, delay);
    timeoutsRef.current.push(id);
  }

  function toggleSound() {
    setSoundEnabled(prev => {
      const next = !prev;
      setCinematicSoundEnabled(next);
      soundEnabledRef.current = next;
      return next;
    });
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

      if (soundEnabledRef.current) {
        stopDrumRollRef.current = playDrumRoll(2000);
      }

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

          if (soundEnabledRef.current) {
            playCrash();
          }

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
              addTimeout(() => {
                setLineIndex(i);
                if (soundEnabledRef.current) {
                  playLineHit();
                }
              }, i * 1300);
            });

            // After last line + 800ms beat, raise the curtain
            addTimeout(() => {
              setPhase('curtain');
              setCurtainActive(true);
              // After curtain finishes rising, hand off to the ball descent animation
              addTimeout(() => {
                onCurtainUp();
              }, 650);
            }, LINES.length * 1300 + 800);

          }, 130);
        }, 300);
      }, 2000);

    }, drumrollStart);

    return () => {
      if (barIntervalRef.current) clearInterval(barIntervalRef.current);
      timeoutsRef.current.forEach(clearTimeout);
      if (stopDrumRollRef.current) stopDrumRollRef.current();
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

      {/* Sound toggle — visible during drumroll and lines phases */}
      {(phase === 'drumroll' || phase === 'lines') && (
        <button
          onClick={toggleSound}
          className="absolute top-5 right-5 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
          style={{
            background: soundEnabled ? 'rgba(250,204,21,0.15)' : 'rgba(255,255,255,0.08)',
            color: soundEnabled ? '#fde047' : 'rgba(255,255,255,0.45)',
            border: `1px solid ${soundEnabled ? 'rgba(250,204,21,0.35)' : 'rgba(255,255,255,0.15)'}`,
          }}
          aria-label={soundEnabled ? 'Mute cinematic sound' : 'Unmute cinematic sound'}
        >
          {soundEnabled ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          )}
          {soundEnabled ? 'Sound on' : 'Sound off'}
        </button>
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
