import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface DelayedDialogueProps {
  title: string;
  delayedText: string;
  onContinue: () => void;
}

export default function DelayedDialogue({ title, delayedText, onContinue }: DelayedDialogueProps) {
  const [showText, setShowText] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Show text after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (showText && currentIndex < delayedText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + delayedText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [showText, currentIndex, delayedText]);

  return (
    <div className="bg-black/70 backdrop-blur-md rounded-2xl border border-cyan-500/30 max-w-3xl w-full p-8 animate-fade-in">
      {/* Scene Title */}
      <div className="text-center mb-6">
        <h1 className="font-orbitron text-cyan-400 text-lg font-bold tracking-[0.2em] mb-2">
          {title}
        </h1>
        <h2 
          className="glitch-text font-orbitron text-4xl md:text-5xl font-black tracking-wider" 
          data-text="ADAPTO"
        >
          ADAPTO
        </h2>
      </div>

      {/* Delayed Text */}
      <div className="space-y-6">
        {showText && (
          <div className="dialogue-text animate-slide-up">
            <p className="text-gray-100 text-sm md:text-base leading-relaxed font-medium">
              {displayedText}
              {currentIndex < delayedText.length && (
                <span className="animate-pulse">▋</span>
              )}
            </p>
          </div>
        )}

        {/* Continue Button - appears after text is complete */}
        {showText && currentIndex >= delayedText.length && (
          <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <Button
              onClick={onContinue}
              className="w-full bg-gray-800/80 hover:bg-cyan-700/80 border border-cyan-500/50 hover:border-cyan-400 text-cyan-100 hover:text-white px-6 py-4 rounded-xl transition-all duration-300"
            >
              <span className="block font-medium">→ Continue awakening</span>
              <span className="block text-sm text-gray-400 hover:text-cyan-300 mt-1">
                Process what you've seen and move forward
              </span>
            </Button>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="mt-8 pt-6 border-t border-gray-700/50 flex items-center justify-center text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-gray-400 font-mono text-xs">VISUAL INTERFACE ACTIVE</span>
        </div>
      </div>
    </div>
  );
}