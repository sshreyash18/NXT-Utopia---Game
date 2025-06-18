import { useState, useCallback } from "react";

interface GameState {
  currentScene: string;
  progress: Record<string, any>;
  isLoading: boolean;
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    currentScene: 'intro',
    progress: {},
    isLoading: false
  });



  const changeScene = useCallback((newScene: string) => {
    console.log('changeScene called:', newScene);
    setGameState(prev => {
      console.log('Previous state:', prev.currentScene);
      const newState = {
        ...prev,
        currentScene: newScene,
        progress: {
          ...prev.progress,
          [prev.currentScene]: true
        }
      };
      console.log('Setting new state:', newState.currentScene);
      return newState;
    });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setGameState(prev => ({
      ...prev,
      isLoading: loading
    }));
  }, []);

  const initializeGame = useCallback(() => {
    // Initialize game state
    setGameState({
      currentScene: 'intro',
      progress: {},
      isLoading: false
    });
  }, []);

  const updateProgress = useCallback((key: string, value: any) => {
    setGameState(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        [key]: value
      }
    }));
  }, []);

  return {
    currentScene: gameState.currentScene,
    progress: gameState.progress,
    isLoading: gameState.isLoading,
    changeScene,
    setLoading,
    initializeGame,
    updateProgress
  };
}
