import { useState } from "react";
import { useGameState } from "@/hooks/use-game-state";

interface Choice {
  text: string;
  description: string;
}

interface SceneData {
  title: string;
  dialogue: string;
  showChoices: boolean;
  choices?: Choice[];
  puzzlePrompt?: string;
}

interface DialogueContainerProps {
  sceneData: SceneData;
  currentScene: string;
}

export default function DialogueContainer({ sceneData, currentScene }: DialogueContainerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [puzzleInput, setPuzzleInput] = useState("");
  const { changeScene } = useGameState();

  const handleChoiceClick = async (choice: Choice) => {
    setIsLoading(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    
    // For demo purposes, cycle through scenes
    const scenes = ['awaken', 'trust', 'leak', 'core'];
    const currentIndex = scenes.indexOf(currentScene);
    const nextScene = scenes[(currentIndex + 1) % scenes.length];
    changeScene(nextScene);
  };

  const handlePuzzleSubmit = async () => {
    if (!puzzleInput.trim()) return;
    
    setIsLoading(true);
    
    // Simulate puzzle validation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    
    // Reset for demo
    setPuzzleInput("");
    changeScene('awaken');
  };

  const sceneIndex = ['awaken', 'trust', 'leak', 'core'].indexOf(currentScene) + 1;

  return (
    <div className="bg-black/70 backdrop-blur-md rounded-2xl border border-cyan-500/30 max-w-3xl w-full p-8 animate-fade-in">
      {/* Scene Title */}
      <div className="text-center mb-6">
        <h1 className="font-orbitron text-cyan-400 text-lg font-bold tracking-[0.2em] mb-2">
          {sceneData.title}
        </h1>
        <h2 
          className="glitch-text font-orbitron text-4xl md:text-5xl font-black tracking-wider" 
          data-text="ADAPTO"
        >
          ADAPTO
        </h2>
      </div>

      {/* Dialogue Content */}
      <div className="space-y-6">
        
        {/* AI Thinking Indicator */}
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="typing-indicator">
              <span className="text-cyan-300 font-medium mr-2">Adapto is processing</span>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}

        {/* Dialogue Text */}
        {!isLoading && (
          <div className="dialogue-text animate-slide-up">
            <p className="text-gray-100 text-lg md:text-xl leading-relaxed font-medium">
              {sceneData.dialogue}
            </p>
          </div>
        )}

        {/* Choice Buttons */}
        {!isLoading && sceneData.showChoices && sceneData.choices && (
          <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {sceneData.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoiceClick(choice)}
                className="w-full bg-gray-800/80 hover:bg-cyan-700/80 border border-cyan-500/50 hover:border-cyan-400 text-cyan-100 hover:text-white px-6 py-4 rounded-xl transition-all duration-300 text-left group"
              >
                <span className="block font-medium">{choice.text}</span>
                <span className="block text-sm text-gray-400 group-hover:text-cyan-300 mt-1">
                  {choice.description}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Core Puzzle Input */}
        {!isLoading && !sceneData.showChoices && (
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="space-y-2">
              <label className="block text-cyan-300 font-medium font-mono text-sm">
                {sceneData.puzzlePrompt}
              </label>
              <input
                type="text"
                value={puzzleInput}
                onChange={(e) => setPuzzleInput(e.target.value.toUpperCase())}
                className="w-full bg-gray-900/80 border border-cyan-500/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-cyan-100 px-4 py-3 rounded-lg font-mono transition-all duration-300 outline-none"
                placeholder="_ _ _ _ _ _ _ _"
              />
            </div>
            
            <button
              onClick={handlePuzzleSubmit}
              disabled={!puzzleInput.trim()}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 animate-pulse-glow"
            >
              SUBMIT SEQUENCE
            </button>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="mt-8 pt-6 border-t border-gray-700/50 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-cyan-400 font-mono">STATUS:</span>
          <span className="text-green-400 font-mono">ONLINE</span>
          <span className="text-gray-500">|</span>
          <span className="text-cyan-400 font-mono">SCENE:</span>
          <span className="text-yellow-400 font-mono">
            {String(sceneIndex).padStart(2, '0')}_{currentScene.toUpperCase()}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-gray-400 font-mono text-xs">NEURAL_LINK_ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
