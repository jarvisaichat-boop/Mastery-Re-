interface WelcomeProps {
    onNext: () => void;
}

export default function Welcome({ onNext }: WelcomeProps) {
    return (
        <div className="text-center space-y-8 animate-fadeIn">
            <div className="space-y-4">
                <h1 className="text-5xl font-bold">Welcome to Path</h1>
                <p className="text-2xl text-gray-400">Get Your Attention Back!</p>
            </div>

            <div className="my-12 p-8 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-xl leading-relaxed">
                    This isn't a tool. It's a <span className="text-blue-400 font-semibold">program</span> to win back your attention.
                </p>
            </div>

            <div className="space-y-4 text-left max-w-lg mx-auto text-gray-300">
                <p className="text-lg">
                    In a world of infinite distraction, even ambitious people struggle to stick to their goals.
                </p>
                <p className="text-lg">
                    You know <span className="italic">what</span> to do, but you lack the "habit muscle" to do it consistently.
                </p>
                <p className="text-lg font-semibold text-white mt-6">
                    Path is your AI-powered coaching program that combines daily motivation with real accountability.
                </p>
            </div>

            <button
                onClick={onNext}
                className="mt-12 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-lg transition-all transform hover:scale-105"
            >
                Let's Begin
            </button>
        </div>
    );
}
