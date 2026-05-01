import { useState, useEffect, useRef } from 'react';
import { Rocket } from 'lucide-react';

type Phase = 'pop' | 'float' | 'descend';

interface Props {
  onReveal: () => void;
}

const BALL_SIZE = 260;
const LANDING_WIDTH = 192;
const LANDING_HEIGHT = 96;
const HALO_INSET = 20;
const POP_DURATION = 580;
const FLOAT_DURATION = 1800;
const DESCENT_DURATION = 1200;
const HALO_FADE_BEFORE_END = 350;

export default function MGBallDescent({ onReveal }: Props) {
  const [phase, setPhase] = useState<Phase>('pop');
  const [haloFading, setHaloFading] = useState(false);
  const onRevealRef = useRef(onReveal);
  onRevealRef.current = onReveal;

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('float'), POP_DURATION);
    const t2 = setTimeout(() => setPhase('descend'), POP_DURATION + FLOAT_DURATION);
    const t3 = setTimeout(
      () => setHaloFading(true),
      POP_DURATION + FLOAT_DURATION + DESCENT_DURATION - HALO_FADE_BEFORE_END
    );
    const t4 = setTimeout(() => {
      try {
        if ('vibrate' in navigator && navigator.vibrate) {
          navigator.vibrate([50, 30, 100]);
        }
      } catch {}
      onRevealRef.current();
    }, POP_DURATION + FLOAT_DURATION + DESCENT_DURATION + 100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  // Outer div: handles position + shape transitions
  const outerStyle: React.CSSProperties =
    phase === 'descend'
      ? {
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          top: `calc(100% - ${LANDING_HEIGHT}px)`,
          width: `${LANDING_WIDTH}px`,
          height: `${LANDING_HEIGHT}px`,
          borderRadius: `${LANDING_HEIGHT}px ${LANDING_HEIGHT}px 0 0`,
          transition: [
            `top ${DESCENT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            `width ${DESCENT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            `height ${DESCENT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            `border-radius ${DESCENT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          ].join(', '),
        }
      : {
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          top: `calc(50% - ${BALL_SIZE / 2}px)`,
          width: `${BALL_SIZE}px`,
          height: `${BALL_SIZE}px`,
          borderRadius: '50%',
        };

  // Halo: visible during float and most of descent, morphs shape with the ball
  const haloOpacity = phase === 'pop' || haloFading ? 0 : 1;

  const haloStyle: React.CSSProperties =
    phase === 'descend'
      ? {
          position: 'absolute',
          inset: `-${HALO_INSET}px`,
          borderRadius: `${LANDING_HEIGHT + HALO_INSET}px ${LANDING_HEIGHT + HALO_INSET}px 0 0`,
          border: '3px solid rgba(251, 191, 36, 0.95)',
          opacity: haloOpacity,
          transition: [
            `border-radius ${DESCENT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            `opacity ${HALO_FADE_BEFORE_END}ms ease`,
          ].join(', '),
          pointerEvents: 'none',
        }
      : {
          position: 'absolute',
          inset: `-${HALO_INSET}px`,
          borderRadius: '50%',
          border: '3px solid rgba(251, 191, 36, 0.95)',
          opacity: haloOpacity,
          transition: 'opacity 0.4s ease',
          animation: phase === 'float' ? 'mgBallHalo 1.8s ease-in-out infinite' : 'none',
          pointerEvents: 'none',
        };

  const innerAnimation =
    phase === 'pop'
      ? 'mgBallPop 0.58s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
      : phase === 'float'
      ? 'mgBallFloat 2.4s ease-in-out infinite'
      : 'none';

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      <div style={outerStyle}>
        {/* Halo ring — morphs and descends with the ball */}
        <div style={haloStyle} />
        {/* Ball visual */}
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 'inherit',
            background: 'linear-gradient(to right, #facc15, #eab308, #f97316)',
            boxShadow:
              '0 -10px 40px rgba(251, 191, 36, 0.5), 0 -5px 20px rgba(251, 191, 36, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: innerAnimation,
          }}
        >
          <Rocket style={{ width: '52px', height: '52px', color: '#000' }} />
        </div>
      </div>
    </div>
  );
}
