interface BridgeScreenProps {
  quote: string;
  onContinue: () => void;
}

export default function BridgeScreen({ quote, onContinue }: BridgeScreenProps) {
  return (
    <div 
      onClick={onContinue}
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center p-8 cursor-pointer"
    >
      <div className="max-w-2xl text-center space-y-8">
        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed italic">
          "{quote}"
        </p>
        <p className="text-sm text-gray-500 uppercase tracking-wider animate-pulse">
          Tap Anywhere to Continue
        </p>
      </div>
    </div>
  );
}
