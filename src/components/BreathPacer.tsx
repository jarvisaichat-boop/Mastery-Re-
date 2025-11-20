import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface BreathPacerProps {
  habitName: string;
  onComplete: () => void;
  onCancel: () => void;
}

type BreathPhase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out';

const BreathPacer = ({ habitName, onComplete, onCancel }: BreathPacerProps) => {
  const [started, setStarted] = useState(false);
  const [duration, setDuration] = useState<3 | 5 | 10>(5);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const timerRef = useRef<number>();
  const phaseTimerRef = useRef<number>();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const PHASE_DURATION = 4000; // 4 seconds per phase
  const BREATH_CYCLE = 16000; // Total cycle: 16 seconds (4 phases × 4 seconds)

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = (text: string) => {
    if (!audioEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 0.9;
    utterance.volume = 0.7;
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const startBreathCycle = () => {
    const phases: BreathPhase[] = ['inhale', 'hold-in', 'exhale', 'hold-out'];
    let phaseIndex = 0;
    let phaseStartTime = Date.now();

    setPhase(phases[0]);
    speak('Breathe in');

    // Phase progression timer (updates every 100ms for smooth animation)
    phaseTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - phaseStartTime;
      const progress = (elapsed / PHASE_DURATION) * 100;
      
      setPhaseProgress(Math.min(progress, 100));

      if (elapsed >= PHASE_DURATION) {
        phaseIndex = (phaseIndex + 1) % phases.length;
        phaseStartTime = Date.now();
        setPhase(phases[phaseIndex]);
        setPhaseProgress(0);

        // Vocal cues
        switch (phases[phaseIndex]) {
          case 'inhale':
            speak('Breathe in');
            break;
          case 'hold-in':
            speak('Hold');
            break;
          case 'exhale':
            speak('Breathe out');
            break;
          case 'hold-out':
            speak('Hold');
            break;
        }
      }
    }, 100);
  };

  const handleStart = () => {
    setStarted(true);
    setTimeRemaining(duration * 60);

    // Start ambient music (simple oscillator for now - can be replaced with audio file)
    if (audioEnabled) {
      playAmbientSound();
    }

    // Start breath cycle
    startBreathCycle();

    // Countdown timer (updates every second)
    timerRef.current = window.setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const playAmbientSound = () => {
    // Create a simple ambient sound using Web Audio API
    // This can be replaced with an actual audio file later
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 110; // Low A note
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      
      // Store reference for cleanup
      audioRef.current = { pause: () => oscillator.stop() } as any;
    } catch (error) {
      console.warn('Audio not supported', error);
    }
  };

  const handleComplete = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
    if (audioRef.current) audioRef.current.pause();
    window.speechSynthesis.cancel();
    onComplete();
  };

  const handleExit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
    if (audioRef.current) audioRef.current.pause();
    window.speechSynthesis.cancel();
    
    if (started) {
      const confirmed = confirm('Are you sure you want to exit? Your progress will not be saved.');
      if (confirmed) {
        onCancel();
      } else {
        // Resume if they cancel
        if (audioEnabled) playAmbientSound();
        startBreathCycle();
        timerRef.current = window.setInterval(() => {
          setTimeRemaining(prev => {
            if (prev <= 1) {
              handleComplete();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } else {
      onCancel();
    }
  };

  const getCircleScale = () => {
    const baseScale = 0.6;
    const maxScale = 1.0;
    
    switch (phase) {
      case 'inhale':
        return baseScale + ((maxScale - baseScale) * (phaseProgress / 100));
      case 'hold-in':
        return maxScale;
      case 'exhale':
        return maxScale - ((maxScale - baseScale) * (phaseProgress / 100));
      case 'hold-out':
        return baseScale;
      default:
        return baseScale;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold-in': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'hold-out': return 'Hold';
    }
  };

  if (!started) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center space-y-8 max-w-md px-6">
          <h2 className="text-3xl font-bold text-white">{habitName}</h2>
          <p className="text-gray-400 text-lg">
            Find your center through breath. Follow the circle's rhythm.
          </p>

          <div className="space-y-4">
            <p className="text-gray-300 text-sm">Select Duration</p>
            <div className="flex justify-center gap-4">
              {[3, 5, 10].map((min) => (
                <button
                  key={min}
                  onClick={() => setDuration(min as 3 | 5 | 10)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    duration === min
                      ? 'bg-blue-600 text-white scale-110'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {min} min
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <input
              type="checkbox"
              id="audio-toggle"
              checked={audioEnabled}
              onChange={(e) => setAudioEnabled(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="audio-toggle" className="text-gray-400 text-sm">
              Enable vocal guidance & ambient sound
            </label>
          </div>

          <button
            onClick={handleStart}
            className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold rounded-lg transition-colors shadow-lg"
          >
            Begin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-black z-50 flex items-center justify-center">
      <button
        onClick={handleExit}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Timer Display */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-4xl font-light text-white/80 tabular-nums">
          {formatTime(timeRemaining)}
        </div>
        <div className="text-sm text-gray-400 mt-1">{habitName}</div>
      </div>

      {/* Breathing Circle */}
      <div className="flex flex-col items-center justify-center">
        <div
          className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-sm border-2 border-blue-400/50 shadow-2xl transition-transform duration-[4000ms] ease-in-out"
          style={{
            transform: `scale(${getCircleScale()})`,
            boxShadow: `0 0 ${60 * getCircleScale()}px rgba(59, 130, 246, 0.5)`,
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-light text-white/90">{getPhaseText()}</p>
            </div>
          </div>
        </div>

        {/* Phase Indicator */}
        <div className="mt-12 flex gap-2">
          {(['inhale', 'hold-in', 'exhale', 'hold-out'] as BreathPhase[]).map((p) => (
            <div
              key={p}
              className={`h-1 w-12 rounded-full transition-colors ${
                phase === p ? 'bg-blue-400' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BreathPacer;
