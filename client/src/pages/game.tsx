import { useEffect } from "react";
import SceneView from "@/components/scene-view";
import { useGameState } from "@/hooks/use-game-state";

export default function Game() {
  const { currentScene, initializeGame, changeScene, handleRestart } = useGameState();

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <div className="min-h-screen overflow-hidden">
      <title>Adapto - Sci-Fi Narrative Game</title>
      <SceneView scene={currentScene} onSceneChange={changeScene} onRestart={handleRestart} />
    </div>
  );
}
