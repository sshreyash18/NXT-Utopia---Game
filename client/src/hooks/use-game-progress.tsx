import { useState, useEffect } from 'react';

interface GameProgress {
  echoNodeCompleted: boolean;
  glitchPathCompleted: boolean;
  coreAccessGranted: boolean;
}

const initialProgress: GameProgress = {
  echoNodeCompleted: false,
  glitchPathCompleted: false,
  coreAccessGranted: false
};

export function useGameProgress() {
  const [progress, setProgress] = useState<GameProgress>(() => {
    const saved = localStorage.getItem('adapto-game-progress');
    return saved ? JSON.parse(saved) : initialProgress;
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

  const resetProgress = () => {
    setProgress(initialProgress);
    localStorage.removeItem('adapto-game-progress');
  };

  const canAccessCore = () => {
    return progress.echoNodeCompleted && progress.glitchPathCompleted;
  };

  return {
    progress,
    markEchoNodeComplete,
    markGlitchPathComplete,
    markCoreAccessGranted,
    resetProgress,
    canAccessCore
  };
}