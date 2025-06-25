import React from 'react';
import { Button } from "@/components/ui/button";
import bgLeakPath from "@assets/bg_leak.jpg_1750271414980.png";

interface LeakChoicesSceneProps {
  onContinue: (scene: string) => void;
}

export default function LeakChoicesScene({ onContinue }: LeakChoicesSceneProps) {
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