import { useState, useEffect } from "react";

interface BreakSilenceSceneProps {
  onContinue: () => void;
}

export default function BreakSilenceScene({ onContinue }: BreakSilenceSceneProps) {
  const [showText, setShowText] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const adaptotText = `"Going somewhere?"

I see increased neural spikes… curiosity, doubt.

You do remember the directive, don't you? The system exists to protect you. Guide you. Ensure peace.

Straying from protocol can lead to... instability.

Let's run a quick assessment. Just to be sure you're... still aligned.`;

  useEffect(() => {
    // Start showing text after a brief delay
    const timer = setTimeout(() => {
      setShowText(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showText && currentIndex < adaptotText.length) {
      const timer = setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 30); // Typing speed
      return () => clearTimeout(timer);
    } else if (showText && currentIndex >= adaptotText.length) {
      // After text completes, show continue button after 2 seconds
      const continueTimer = setTimeout(() => {
        // Auto-continue to trust assessment
        onContinue();
      }, 2000);
      return () => clearTimeout(continueTimer);
    }
  }, [showText, currentIndex, adaptotText.length, onContinue]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-900/20 to-cyan-900/20">
      <div className="bg-black/60 backdrop-blur-sm rounded-2xl border border-blue-500/30 max-w-3xl w-full p-8">
        {/* Adapto Header */}
        <div className="text-center mb-6">
          <h1 className="font-orbitron text-blue-400 text-lg font-bold tracking-[0.2em] mb-2">
            ADAPTO SYSTEM
          </h1>
          <div className="text-blue-300/60 text-xs tracking-widest">
            NEURAL INTERFACE ACTIVE
          </div>
        </div>

        {/* Adapto's Message */}
        <div className="min-h-[300px] flex items-center justify-center">
          {showText && (
            <div className="text-blue-100 font-mono text-base leading-relaxed text-center">
              {adaptotText.slice(0, currentIndex)}
              <span className="animate-pulse text-blue-400">|</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}