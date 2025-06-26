import React from 'react';
import { useGameProgress } from "@/hooks/use-game-progress";

export default function DetectionCounter() {
  const { progress } = useGameProgress();
  const remainingLives = 5 - progress.detectionCount;

  return (
    <div className="fixed top-6 right-6 bg-black/80 backdrop-blur-md border border-red-500/50 rounded-lg p-4 min-w-[200px] z-50">
      <div className="text-center">
        <h3 className="text-red-400 font-mono text-sm font-bold mb-2">DETECTION STATUS</h3>
        <div className="flex justify-center items-center space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full border ${
                i < remainingLives
                  ? 'bg-green-500 border-green-400'
                  : 'bg-red-500 border-red-400'
              }`}
            />
          ))}
        </div>
        <div className="text-xs text-gray-400">
          Lives: {remainingLives}/5
        </div>
        {progress.detectionCount > 0 && (
          <div className="text-xs text-red-400 mt-1">
            Anomalies Detected: {progress.detectionCount}
          </div>
        )}
      </div>
    </div>
  );
}