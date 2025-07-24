import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";

interface EndingSceneProps {
  choices: string[];
  onRestart: () => void;
}

export default function EndingScene({ choices, onRestart }: EndingSceneProps) {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [displayedText, setDisplayedText] = useState("");
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  useEffect(() => {
    generateSummary();
  }, [choices]);

  // const generateSummary = async () => {
  //   try {
  //     const response = await apiRequest("POST", "/api/generate-final-summary", { choices });
  //     setSummary(response.summary);
      
  //     // Start typing animation
  //     setTimeout(() => {
  //       typeText("You've navigated trust, resisted control, and answered the unknown. In this Utopia, you're not just a citizen — you're a story.");
  //     }, 50);
  //   } catch (error) {
  //     console.error('Failed to generate summary:', error);
  //     const fallbackSummary = "You've navigated trust, resisted control, and answered the unknown. In this Utopia, you're not just a citizen — you're a story.";
  //     setSummary(fallbackSummary);
  //     setIsLoading(false);
  //     setTimeout(() => {
  //       typeText(fallbackSummary);
  //     }, 500);
  //   }
  // };

  const generateSummary = () => {
    const fallbackSummary = "You've navigated trust, resisted control, and answered the unknown. In this Utopia, you're not just a citizen — you're a story.";
    setSummary(fallbackSummary);
    setIsLoading(false);

    setTimeout(() => {
      typeText(fallbackSummary);
    }, 300);
  };

  const typeText = (text: string) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        // Show final message after typing is complete
        setTimeout(() => {
          setShowFinalMessage(true);
        }, 1000);
      }
    }, 50);
  };

  return (
    <div className="space-y-8 animate-slide-up text-center max-w-2xl mx-auto">
      {/* Title */}
      <div className="space-y-4">
        <h2 className="font-orbitron text-3xl md:text-4xl font-black text-cyan-400 tracking-wider">
          SIMULATION COMPLETE
        </h2>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto"></div>
      </div>

      {/* AI Summary */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="typing-indicator">
              <span className="text-cyan-300 font-medium mr-2">Adapto is analyzing your journey</span>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900/50 border border-cyan-500/30 rounded-xl p-6">
            <p className="text-cyan-100 text-lg md:text-xl leading-relaxed font-medium min-h-[4rem]">
              {displayedText}
            </p>
          </div>
        )}
      </div>

      {/* Final Message */}
      {showFinalMessage && (
        <div className="space-y-6 animate-fade-in">
          <div className="border-t border-cyan-500/30 pt-6">
            <div className="space-y-4">
              <div className="text-cyan-400 font-orbitron text-lg">
                <p className="mt-2">Designed by humans at AdaptNXT.</p>
                <p className="text-cyan-300 italic">For now until AI takes over</p>
              </div>
              
              <button
                onClick={onRestart}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 animate-pulse-glow"
              >
                Restart Simulation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Choice History (Optional Debug) */}
      {choices.length > 0 && (
        <details className="mt-8 text-left">
          <summary className="text-cyan-400 font-mono text-sm cursor-pointer hover:text-cyan-300">
            Journey Log ({choices.length} decisions)
          </summary>
          <div className="mt-4 space-y-2">
            {choices.map((choice, index) => (
              <div key={index} className="text-gray-400 font-mono text-xs bg-gray-900/30 p-2 rounded">
                <span className="text-cyan-500">{String(index + 1).padStart(2, '0')}.</span> {choice}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}