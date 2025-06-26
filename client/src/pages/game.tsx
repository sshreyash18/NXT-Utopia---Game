import { useEffect } from "react";
import SceneView from "@/components/scene-view";
import { useGameState } from "@/hooks/use-game-state";

export default function Game() {
  const { currentScene, initializeGame, changeScene } = useGameState();

  useEffect(() => {
    // Clear all localStorage on app start for fresh game
    console.log('Clearing all localStorage for fresh game start');
    localStorage.removeItem('adapto-game-progress');
    localStorage.removeItem('gameProgress');
    localStorage.removeItem('detectionCount');
    localStorage.removeItem('gameState');
    localStorage.removeItem('currentScene');
    localStorage.removeItem('gameChoices');
    localStorage.removeItem('userResponses');
    localStorage.removeItem('completedPaths');
    localStorage.removeItem('coreAccess');
    localStorage.removeItem('echoNodeProgress');
    localStorage.removeItem('glitchPathProgress');
    
    initializeGame();
  }, [initializeGame]);

  const handleRestart = () => {
    console.log('Restarting game - clearing all localStorage');
    // Clear all localStorage keys used by the game
    localStorage.removeItem('adapto-game-progress');
    localStorage.removeItem('gameProgress');
    localStorage.removeItem('detectionCount');
    localStorage.removeItem('gameState');
    localStorage.removeItem('currentScene');
    localStorage.removeItem('gameChoices');
    localStorage.removeItem('userResponses');
    localStorage.removeItem('completedPaths');
    localStorage.removeItem('coreAccess');
    localStorage.removeItem('echoNodeProgress');
    localStorage.removeItem('glitchPathProgress');
    
    // Force a page reload to ensure all state is completely reset
    window.location.reload();
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <title>Adapto - Sci-Fi Narrative Game</title>
      <SceneView scene={currentScene} onSceneChange={changeScene} onRestart={handleRestart} />
    </div>
  );
}
