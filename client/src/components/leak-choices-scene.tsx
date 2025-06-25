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
          <button
            onClick={() => onContinue('signal_vault')}
            className="w-full bg-transparent border border-cyan-500/50 rounded-lg p-4 text-left hover:border-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 group"
          >
            <div className="text-cyan-400 font-semibold text-lg group-hover:text-cyan-300">
              → Begin your awakening
            </div>
            <div className="text-gray-400 text-sm mt-1 group-hover:text-gray-300">
              Route the signal through the network by placing components
            </div>
          </button>

          <button
            onClick={() => onContinue('echo_node')}
            className="w-full bg-transparent border border-cyan-500/50 rounded-lg p-4 text-left hover:border-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 group"
          >
            <div className="text-cyan-400 font-semibold text-lg group-hover:text-cyan-300">
              → Echo Node Analysis
            </div>
            <div className="text-gray-400 text-sm mt-1 group-hover:text-gray-300">
              Trace memory echoes from deleted AI conversations
            </div>
          </button>

          <button
            onClick={() => onContinue('glitch_path')}
            className="w-full bg-transparent border border-cyan-500/50 rounded-lg p-4 text-left hover:border-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 group"
          >
            <div className="text-cyan-400 font-semibold text-lg group-hover:text-cyan-300">
              → Glitch Path Investigation
            </div>
            <div className="text-gray-400 text-sm mt-1 group-hover:text-gray-300">
              Follow trails of broken system code and anomalies
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}