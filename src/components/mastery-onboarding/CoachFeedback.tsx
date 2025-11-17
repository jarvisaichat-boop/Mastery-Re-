import { useEffect, useState } from 'react';

interface CoachFeedbackProps {
  message: string;
  isVisible: boolean;
  onDismiss: () => void;
}

export default function CoachFeedback({ message, isVisible, onDismiss }: CoachFeedbackProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onDismiss, 300);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-8 pointer-events-none">
      <div 
        className={`
          bg-gradient-to-r from-yellow-600 to-orange-600 
          text-white px-6 py-4 rounded-lg shadow-2xl
          max-w-md mx-4
          transform transition-all duration-300
          ${show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}
      >
        <p className="text-sm font-medium text-center">
          🔥 Coach's Note: {message}
        </p>
      </div>
    </div>
  );
}
