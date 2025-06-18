import { useEffect } from "react";
import SceneView from "@/components/scene-view";
import { useGameState } from "@/hooks/use-game-state";

export default function Game() {
  const { currentScene, initializeGame, changeScene } = useGameState();

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <div className="min-h-screen overflow-hidden">
      <title>Adapto - Sci-Fi Narrative Game</title>
      {/* Debug button to test state change */}
      <button 
        onClick={() => {
          console.log('Red button clicked, current scene:', currentScene);
          changeScene('awaken');
        }}
        className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded"
      >
        Force Awaken Scene (Current: {currentScene})
      </button>
      <SceneView scene={currentScene} />
    </div>
  );
}
