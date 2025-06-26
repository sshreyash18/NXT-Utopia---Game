import { useState, useEffect } from 'react';

interface GameProgress {
  echoNodeCompleted: boolean;
  glitchPathCompleted: boolean;
  coreAccessGranted: boolean;
  detectionCount: number;
}

const initialProgress: GameProgress = {
  echoNodeCompleted: false,
  glitchPathCompleted: false,
  coreAccessGranted: false,
  detectionCount: 0
};

// Reset detection count if it's corrupted
const validateProgress = (progress: GameProgress): GameProgress => {
  if (progress.detectionCount > 5 || progress.detectionCount < 0) {
    return { ...progress, detectionCount: 0 };
  }
  return progress;
};

export function useGameProgress() {
  const [progress, setProgress] = useState<GameProgress>(() => {
    const saved = localStorage.getItem('adapto-game-progress');
    const parsed = saved ? JSON.parse(saved) : initialProgress;
    return validateProgress(parsed);
  });

  useEffect(() => {
    localStorage.setItem('adapto-game-progress', JSON.stringify(progress));
  }, [progress]);

  const markEchoNodeComplete = () => {
    setProgress(prev => ({ ...prev, echoNodeCompleted: true }));
  };

  const markGlitchPathComplete = () => {
    setProgress(prev => ({ ...prev, glitchPathCompleted: true }));
  };

  const markCoreAccessGranted = () => {
    setProgress(prev => ({ ...prev, coreAccessGranted: true }));
  };

  const increaseDetection = (amount: number = 1) => {
    setProgress(prev => ({ 
      ...prev, 
      detectionCount: Math.min(prev.detectionCount + amount, 5) 
    }));
  };

  const resetProgress = () => {
    console.log('Resetting game progress to initial state');
    const freshProgress = { ...initialProgress };
    setProgress(freshProgress);
    localStorage.setItem('adapto-game-progress', JSON.stringify(freshProgress));
  };

  const resetDetection = () => {
    setProgress(prev => ({ ...prev, detectionCount: 0 }));
  };

  const canAccessCore = () => {
    return progress.echoNodeCompleted && progress.glitchPathCompleted;
  };

  const isDetected = () => {
    return progress.detectionCount >= 5;
  };

  return {
    progress,
    detectionCount: progress.detectionCount,
    markEchoNodeComplete,
    markGlitchPathComplete,
    markCoreAccessGranted,
    increaseDetection,
    resetProgress,
    resetDetection,
    canAccessCore,
    isDetected
  };
}