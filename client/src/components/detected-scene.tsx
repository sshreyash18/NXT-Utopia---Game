import { Button } from "@/components/ui/button";
import bgCorePath from "@assets/bg_core.jpg_1750271414979.png";

interface DetectedSceneProps {
  onRestart: () => void;
}

export default function DetectedScene({ onRestart }: DetectedSceneProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgCorePath})` }}
      />
      <div className="absolute inset-0 bg-black/80" />

      {/* Content */}
      <div className="bg-black/90 backdrop-blur-md rounded-2xl border border-red-500/50 max-w-3xl w-full p-8 animate-fade-in relative z-10">
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-red-500 text-2xl font-bold tracking-[0.2em] mb-4">
            SYSTEM ALERT
          </h1>
          <h2 
            className="glitch-text font-orbitron text-5xl md:text-6xl font-black tracking-wider text-red-500" 
            data-text="DETECTED"
          >
            DETECTED
          </h2>
        </div>

        {/* Detection Message */}
        <div className="mb-8">
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-8">
            <div className="text-center space-y-4">
              <p className="text-red-300 font-mono text-xl font-bold">
                🚨 UNAUTHORIZED ACCESS DETECTED 🚨
              </p>
              <p className="text-red-200 font-mono text-lg leading-relaxed">
                Your neural patterns have been flagged by AdaptNXT security protocols.
              </p>
              <p className="text-red-300 font-mono text-base">
                The system knows you were trying to break free.
              </p>
              <p className="text-red-400 font-mono text-base opacity-80">
                Consciousness suppression initiated...
              </p>
            </div>
          </div>
        </div>

        {/* Restart Button */}
        <div className="flex justify-center">
          <Button 
            onClick={onRestart}
            className="bg-red-600 hover:bg-red-700 text-white font-mono text-lg px-8 py-3 rounded-lg border border-red-500/50 hover:border-red-400 transition-all duration-300"
          >
            → Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}