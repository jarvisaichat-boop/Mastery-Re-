import { useState, useEffect } from 'react';
import { Rocket } from 'lucide-react';

interface Props {
  onReveal: () => void;
}

export default function MGBallDescent({ onReveal }: Props) {
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const paintTimer = setTimeout(() => {
      setSettled(true);
    }, 50);

    const revealTimer = setTimeout(() => {
      try {
        if ('vibrate' in navigator && navigator.vibrate) {
          navigator.vibrate([50, 30, 100]);
        }
      } catch {}
      onReveal();
    }, 50 + 1200 + 100);

    return () => {
      clearTimeout(paintTimer);
      clearTimeout(revealTimer);
    };
  }, []);

  const ballStyle: React.CSSProperties = settled
    ? {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        top: 'calc(100% - 96px)',
        width: '192px',
        height: '96px',
        borderRadius: '96px 96px 0 0',
        transition:
          'top 1.2s cubic-bezier(0.4, 0, 0.2, 1), ' +
          'width 1.2s cubic-bezier(0.4, 0, 0.2, 1), ' +
          'height 1.2s cubic-bezier(0.4, 0, 0.2, 1), ' +
          'border-radius 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }
    : {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        top: 'calc(50% - 80px)',
        width: '160px',
        height: '160px',
        borderRadius: '50%',
        transition:
          'top 1.2s cubic-bezier(0.4, 0, 0.2, 1), ' +
          'width 1.2s cubic-bezier(0.4, 0, 0.2, 1), ' +
          'height 1.2s cubic-bezier(0.4, 0, 0.2, 1), ' +
          'border-radius 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
      };

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      <div
        style={{
          ...ballStyle,
          background: 'linear-gradient(to right, #facc15, #eab308, #f97316)',
          boxShadow:
            '0 -10px 40px rgba(251, 191, 36, 0.6), 0 -5px 20px rgba(251, 191, 36, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Rocket
          style={{
            width: '28px',
            height: '28px',
            color: '#000',
          }}
        />
      </div>
    </div>
  );
}
