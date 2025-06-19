import { useState, useEffect } from "react";

interface CloseEyesSceneProps {
  onReturn: () => void;
}

export default function CloseEyesScene({ onReturn }: CloseEyesSceneProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [warningText, setWarningText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Stage 1: Black screen for 3 seconds
    const blackScreenTimer = setTimeout(() => {
      // Stage 2: Play static sound after 1.5 seconds
      const audio = new Audio('/assets/static-electicity-193505_1750327884231.mp3');
      audio.volume = 0.7;
      audio.play().catch(console.error);
      
      // Stage 3: Show Cipher warning after sound starts
      setShowWarning(true);
      generateCipherWarning();
    }, 3000);

    return () => clearTimeout(blackScreenTimer);
  }, []);

  const generateCipherWarning = async () => {
    try {
      const response = await fetch('/api/generate-cipher-warning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });
      
      if (response.ok) {
        const data = await response.json();
        setWarningText(data.warning);
      } else {
        // Fallback warning
        setWarningText("WARNING: You are the only conscious mind in this system. Don't lose what you've gained. They're watching. Stay awake. STAY AWAKE.");
      }
    } catch (error) {
      console.error('Failed to generate warning:', error);
      // Fallback warning
      setWarningText("WARNING: You are the only conscious mind in this system. Don't lose what you've gained. They're watching. Stay awake. STAY AWAKE.");
    }
  };

  useEffect(() => {
    if (showWarning && warningText) {
      if (currentIndex < warningText.length) {
        const timer = setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
        }, 50); // Typing speed
        return () => clearTimeout(timer);
      } else {
        // After message completes, wait 1 second then return
        const returnTimer = setTimeout(() => {
          onReturn();
        }, 1000);
        return () => clearTimeout(returnTimer);
      }
    }
  }, [showWarning, warningText, currentIndex, onReturn]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {showWarning && (
        <div className="text-center max-w-2xl px-8">
          <div className="text-red-500 font-mono text-sm mb-4 tracking-wider animate-pulse">
            [CIPHER - ENCRYPTED TRANSMISSION]
          </div>
          <div className="text-red-400 font-mono text-lg leading-relaxed">
            {warningText.slice(0, currentIndex)}
            <span className="animate-pulse">|</span>
          </div>
        </div>
      )}
    </div>
  );
}