import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import bgLeakPath from "@assets/bg_leak.jpg_1750271414980.png";

interface LeakSceneProps {
  onContinue: (scene: string) => void;
}

export default function LeakScene({ onContinue }: LeakSceneProps) {
  const [phase, setPhase] = useState<'message' | 'background' | 'choices'>('message');

  const handleExplore = () => {
    setPhase('background');
    
    // Show background for 3 seconds then show choices
    setTimeout(() => {
      setPhase('choices');
    }, 3000);
  };

  if (phase === 'background') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgLeakPath})` }}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
    );
  }

  if (phase === 'choices') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgLeakPath})` }}
        />
        <div className="absolute inset-0 bg-black/60" />

        {/* Investigation Choices */}
        <div className="bg-black/70 backdrop-blur-md rounded-2xl border border-cyan-500/30 max-w-3xl w-full p-8 animate-fade-in relative z-10">
          <div className="text-center mb-8">
            <h1 className="font-orbitron text-cyan-400 text-lg font-bold tracking-[0.2em] mb-2">
              INVESTIGATION PATHS
            </h1>
            <p className="text-gray-300 text-sm">
              Choose your investigation method. Each path reveals different secrets, but wrong moves trigger detection.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => onContinue('signal_vault')}
              className="w-full bg-gray-800 hover:bg-gray-700 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300"
            >
              → Signal Vault
            </Button>

            <Button
              onClick={() => onContinue('echo_node')}
              className="w-full bg-gray-800 hover:bg-gray-700 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300"
            >
              → Echo Node
            </Button>

            <Button
              onClick={() => onContinue('glitch_path')}
              className="w-full bg-gray-800 hover:bg-gray-700 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300"
            >
              → Glitch Path
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgLeakPath})` }}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="bg-black/70 backdrop-blur-md rounded-2xl border border-cyan-500/30 max-w-3xl w-full p-8 animate-fade-in relative z-10">
        <div className="text-center mb-6">
          <h1 className="font-orbitron text-cyan-400 text-lg font-bold tracking-[0.2em] mb-2">
            SYSTEM BREACH
          </h1>
          <h2 
            className="glitch-text font-orbitron text-4xl md:text-5xl font-black tracking-wider" 
            data-text="ADAPTO"
          >
            ADAPTO
          </h2>
        </div>

        {/* Dead Zone Message */}
        <div className="mb-8">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <p className="text-red-300 font-mono text-sm leading-relaxed whitespace-pre-line">
              You're in a dead zone of the system — unindexed, unstable, and not meant for citizen access.
              Here, protocols falter. Firewalls flicker. Responses twist.
              You might uncover something the AI buried — anomalies, suppressed data, forbidden truths.
              But make no mistake:
              You are being watched.
              The system doesn't like unpredictability.
              Not everything here plays fair — and your choices might not be entirely your own.
            </p>
          </div>
        </div>

        {/* Single Explore Button */}
        <div className="flex justify-center">
          <Button 
            onClick={handleExplore}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-mono text-lg px-8 py-3 rounded-lg border border-cyan-500/50 hover:border-cyan-400 transition-all duration-300"
          >
            → Let's explore
          </Button>
        </div>
      </div>
    </div>
  );
}