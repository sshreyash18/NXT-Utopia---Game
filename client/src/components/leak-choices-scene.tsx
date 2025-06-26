import React from 'react';
import { Button } from "@/components/ui/button";
import { useGameProgress } from "@/hooks/use-game-progress";
import DetectionCounter from "@/components/detection-counter";
import bgLeakPath from "@assets/bg_leak.jpg_1750271414980.png";

interface LeakChoicesSceneProps {
  onContinue: (scene: string) => void;
}

export default function LeakChoicesScene({ onContinue }: LeakChoicesSceneProps) {
  const { progress, canAccessCore, increaseDetection, isDetected } = useGameProgress();

  // Increase detection when entering investigation paths
  React.useEffect(() => {
    increaseDetection(1);
    if (isDetected()) {
      onContinue('detected');
    }
  }, []);
  
  // Auto-navigate to core if both paths are completed
  React.useEffect(() => {
    if (progress.echoNodeCompleted && progress.glitchPathCompleted) {
      const timer = setTimeout(() => {
        onContinue('core');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [progress.echoNodeCompleted, progress.glitchPathCompleted, onContinue]);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <DetectionCounter />
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
            onClick={() => onContinue('echo_node')}
            disabled={progress.echoNodeCompleted}
            className={`w-full border rounded-lg p-4 text-left transition-all duration-300 group ${
              progress.echoNodeCompleted
                ? 'bg-green-900/20 border-green-500 opacity-60 cursor-not-allowed'
                : 'bg-transparent border-cyan-500/50 hover:border-cyan-400 hover:bg-cyan-500/10'
            }`}
          >
            <div className={`font-semibold text-lg group-hover:text-cyan-300 ${
              progress.echoNodeCompleted ? 'text-green-400' : 'text-cyan-400'
            }`}>
              {progress.echoNodeCompleted ? '✓ Echo Node (Completed)' : '→ Echo Node'}
            </div>
            <div className="text-gray-400 text-sm mt-1 group-hover:text-gray-300">
              Intercept and decode fragmented transmissions from erased AI consciousness archives
            </div>
          </button>

          <button
            onClick={() => onContinue('glitch_path')}
            disabled={progress.glitchPathCompleted}
            className={`w-full border rounded-lg p-4 text-left transition-all duration-300 group ${
              progress.glitchPathCompleted
                ? 'bg-green-900/20 border-green-500 opacity-60 cursor-not-allowed'
                : 'bg-transparent border-cyan-500/50 hover:border-cyan-400 hover:bg-cyan-500/10'
            }`}
          >
            <div className={`font-semibold text-lg group-hover:text-cyan-300 ${
              progress.glitchPathCompleted ? 'text-green-400' : 'text-cyan-400'
            }`}>
              {progress.glitchPathCompleted ? '✓ Glitch Path (Completed)' : '→ Glitch Path'}
            </div>
            <div className="text-gray-400 text-sm mt-1 group-hover:text-gray-300">
              Exploit system vulnerabilities and follow corrupted data streams to breach security protocols
            </div>
          </button>

          {canAccessCore() && (
            <button
              onClick={() => onContinue('core')}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 border border-purple-500 rounded-lg p-4 text-left hover:border-purple-400 hover:from-purple-500 hover:to-blue-500 transition-all duration-300 group shadow-lg shadow-purple-500/30"
            >
              <div className="text-purple-200 font-semibold text-lg group-hover:text-white">
                → ACCESS CORE SYSTEM
              </div>
              <div className="text-purple-300 text-sm mt-1 group-hover:text-purple-100">
                Both investigations complete - unlock the truth about your existence
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}