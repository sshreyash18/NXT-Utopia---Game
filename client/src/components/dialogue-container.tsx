import { useState, useEffect } from "react";
import { useGameState } from "@/hooks/use-game-state";
import { useAudio } from "@/hooks/use-audio";
import { apiRequest } from "@/lib/queryClient";
import EndingScene from "./ending-scene";
import GlitchEffects from "./glitch-effects";

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
  const [dynamicSceneData, setDynamicSceneData] = useState(sceneData);
  const [previousChoices, setPreviousChoices] = useState<string[]>([]);
  const [glitchEffects, setGlitchEffects] = useState<any>(null);
  const [agentLogs, setAgentLogs] = useState<any>(null);
  const [behaviorAnalysis, setBehaviorAnalysis] = useState<any>(null);
  const { changeScene } = useGameState();
  const { playTypingSound, stopTypingSound } = useAudio();

  // Update scene data when the scene prop changes
  useEffect(() => {
    setDynamicSceneData(sceneData);
    setIsLoading(false);
  }, [sceneData, currentScene]);

  // Load AI-generated content for dynamic scenes
  useEffect(() => {
    const staticScenes = ['intro', 'awaken', 'end'];
    if (!staticScenes.includes(currentScene) && (!dynamicSceneData.dialogue || dynamicSceneData.choices?.length === 0)) {
      loadAIContent();
    }
  }, [currentScene]);

  const loadAIContent = async () => {
    const staticScenes = ['intro', 'awaken', 'end'];
    if (staticScenes.includes(currentScene)) return;
    
    setIsLoading(true);
    playTypingSound();
    
    try {
      const userId = 1; 
      const sessionId = `session-${Date.now()}`;
      
      const response = await apiRequest('POST', `/api/generate-dialogue/${currentScene}`, { 
        previousChoices,
        userId,
        sessionId
      });
      const data = await response.json();
      
      setDynamicSceneData(prev => ({
        ...prev,
        dialogue: data.dialogue || prev.dialogue,
        choices: data.choices || prev.choices
      }));

      // Handle multi-agent system outputs
      if (data.glitchEffects) {
        setGlitchEffects(data.glitchEffects);
      }
      
      if (data.logs) {
        setAgentLogs(data.logs);
      }
      
      if (data.behaviorAnalysis) {
        setBehaviorAnalysis(data.behaviorAnalysis);
      }
      
    } catch (error) {
      console.error('Failed to load AI content:', error);
    } finally {
      stopTypingSound();
      setIsLoading(false);
    }
  };

  const handleChoiceClick = async (choice: Choice) => {
    if (isLoading) return; // Prevent multiple clicks
    
    setIsLoading(true);
    playTypingSound();
    
    // Add choice to history
    const newChoices = [...previousChoices, choice.text];
    setPreviousChoices(newChoices);
    
    try {
      // For intro scene, hardcode the transition to awaken
      if (currentScene === 'intro') {
        console.log('About to transition from intro to awaken');
        // Use setTimeout to ensure state update happens after current render cycle
        setTimeout(() => {
          console.log('Executing changeScene to awaken');
          changeScene('awaken');
          setIsLoading(false);
        }, 1000);
        return;
      }
      
      const staticScenes = ['intro', 'awaken'];
      
      // For static scenes, just transition directly
      if (staticScenes.includes(currentScene)) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const nextScene = getNextScene(currentScene);
        console.log('Transitioning from', currentScene, 'to', nextScene);
        changeScene(nextScene);
        setIsLoading(false);
        return;
      }
      
      // For dynamic scenes, use AI processing
      const userId = 1;
      const sessionId = `session-${Date.now()}`;
      
      const response = await apiRequest('POST', `/api/generate-dialogue/${currentScene}`, { 
        userChoice: choice.text,
        previousChoices: newChoices,
        userId,
        sessionId
      });
      const data = await response.json();
      
      // Handle multi-agent system outputs
      if (data.glitchEffects) {
        setGlitchEffects(data.glitchEffects);
      }
      
      if (data.logs) {
        setAgentLogs(data.logs);
      }
      
      if (data.behaviorAnalysis) {
        setBehaviorAnalysis(data.behaviorAnalysis);
      }
      
      // Auto-transition to next scene
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (data.nextScene) {
        changeScene(data.nextScene);
      } else {
        const nextScene = getNextScene(currentScene);
        changeScene(nextScene);
      }
      
    } catch (error) {
      console.error('Failed to process choice:', error);
      // Still transition on error for static scenes
      const nextScene = getNextScene(currentScene);
      changeScene(nextScene);
    } finally {
      stopTypingSound();
      setIsLoading(false);
    }
  };

  const getNextScene = (current: string): string => {
    const sceneFlow: Record<string, string> = {
      'intro': 'awaken',
      'awaken': 'trust',
      'trust': 'leak', 
      'leak': 'core',
      'core': 'end'
    };
    return sceneFlow[current] || 'intro';
  };

  const handlePuzzleSubmit = async () => {
    if (!puzzleInput.trim()) return;
    
    setIsLoading(true);
    playTypingSound();
    
    try {
      // Generate AI response for core puzzle
      const response = await apiRequest('POST', `/api/generate-dialogue/core`, { 
        userChoice: puzzleInput,
        previousChoices: [...previousChoices, puzzleInput]
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      changeScene('end');
      
    } catch (error) {
      console.error('Failed to process puzzle:', error);
    } finally {
      stopTypingSound();
      setIsLoading(false);
      setPuzzleInput("");
    }
  };

  const sceneIndex = ['intro', 'awaken', 'trust', 'leak', 'core'].indexOf(currentScene) + 1;

  return (
    <div className="bg-black/70 backdrop-blur-md rounded-2xl border border-cyan-500/30 max-w-3xl w-full p-8 animate-fade-in">
      {/* Scene Title */}
      <div className="text-center mb-6">
        <h1 className="font-orbitron text-cyan-400 text-lg font-bold tracking-[0.2em] mb-2">
          {dynamicSceneData.title}
        </h1>
        <h2 
          className="glitch-text font-orbitron text-4xl md:text-5xl font-black tracking-wider" 
          data-text="ADAPTO"
        >
          ADAPTO
        </h2>
        <div className="text-xs text-yellow-400 mt-2">
          Current: {currentScene} | Title: {dynamicSceneData.title} | Loading: {isLoading ? 'YES' : 'NO'} | Prop Scene: {currentScene}
        </div>
      </div>



      {/* Dialogue Content */}
      <GlitchEffects effects={glitchEffects}>
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
                {dynamicSceneData.dialogue}
              </p>
            </div>
          )}

        {/* Choice Buttons */}
        {!isLoading && dynamicSceneData.showChoices && dynamicSceneData.choices && dynamicSceneData.choices.length > 0 && (
          <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {dynamicSceneData.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoiceClick(choice)}
                disabled={isLoading}
                className="w-full bg-gray-800/80 hover:bg-cyan-700/80 border border-cyan-500/50 hover:border-cyan-400 text-cyan-100 hover:text-white px-6 py-4 rounded-xl transition-all duration-300 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
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
        {!isLoading && !dynamicSceneData.showChoices && currentScene === 'core' && (
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="space-y-2">
              <label className="block text-cyan-300 font-medium font-mono text-sm">
                {dynamicSceneData.puzzlePrompt}
              </label>
              <input
                type="text"
                value={puzzleInput}
                onChange={(e) => setPuzzleInput(e.target.value)}
                className="w-full bg-gray-900/80 border border-cyan-500/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-cyan-100 px-4 py-3 rounded-lg font-mono transition-all duration-300 outline-none"
                placeholder="Type your answer here..."
              />
            </div>
            
            <button
              onClick={handlePuzzleSubmit}
              disabled={!puzzleInput.trim()}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 animate-pulse-glow"
            >
              SUBMIT ANSWER
            </button>
          </div>
        )}

        {/* Ending Scene */}
        {!isLoading && currentScene === 'end' && (
          <EndingScene 
            choices={previousChoices}
            onRestart={() => {
              setPreviousChoices([]);
              changeScene('awaken');
            }}
          />
        )}
      </div>
      </GlitchEffects>

      {/* Status Bar */}
      <div className="mt-8 pt-6 border-t border-gray-700/50 flex items-center justify-center text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-gray-400 font-mono text-xs">NEURAL LINK ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
