import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Terminal } from "lucide-react";
import { useAudio } from "@/hooks/use-audio";
import { apiRequest } from "@/lib/queryClient";
import EndingScene from "./ending-scene";
import GlitchEffects from "./glitch-effects";
import AgentTerminal, { type AgentMessage } from "./agent-terminal";

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
  puzzleData?: string;
}

interface DialogueContainerProps {
  sceneData: SceneData;
  currentScene: string;
  onSceneChange: (newScene: string) => void;
}

export default function DialogueContainer({ sceneData, currentScene, onSceneChange }: DialogueContainerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [puzzleInput, setPuzzleInput] = useState("");
  const [dynamicSceneData, setDynamicSceneData] = useState(sceneData);
  const [previousChoices, setPreviousChoices] = useState<string[]>([]);
  const [glitchEffects, setGlitchEffects] = useState<any>(null);
  const [agentLogs, setAgentLogs] = useState<any>(null);
  const [behaviorAnalysis, setBehaviorAnalysis] = useState<any>(null);
  const [puzzleAttempts, setPuzzleAttempts] = useState<number>(0);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
  const { playTypingSound, stopTypingSound } = useAudio();

  // Update scene data when the scene prop changes
  useEffect(() => {
    setDynamicSceneData(sceneData);
    setIsLoading(false);
  }, [sceneData, currentScene]);

  // Load AI-generated content for dynamic scenes
  useEffect(() => {
    const staticScenes = ['intro', 'awaken', 'end'];
    if (!staticScenes.includes(currentScene)) {
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
        
        // Convert agent conflict to terminal messages
        if (data.logs.agentConflict) {
          const messages: AgentMessage[] = [
            {
              agent: 'adapto',
              message: data.logs.agentConflict.adapto,
              timestamp: Date.now()
            },
            {
              agent: 'cipher',
              message: data.logs.agentConflict.cipher,
              timestamp: Date.now() + 100
            }
          ];
          setAgentMessages(prev => [...prev, ...messages]);
        }
      }
      
      if (data.behaviorAnalysis) {
        setBehaviorAnalysis(data.behaviorAnalysis);
      }
      
    } catch (error) {
      console.error('Failed to load AI content:', error);
      setDynamicSceneData(prev => ({
        ...prev,
        dialogue: "Connection lost... attempting to reconnect to the neural network...",
        choices: [
          { text: "→ Try again", description: "Reconnect to the system" }
        ]
      }));
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
      // Handle static scene transitions
      if (currentScene === 'intro') {
        onSceneChange('awaken');
        setIsLoading(false);
        return;
      }
      
      const staticScenes = ['intro', 'awaken'];
      
      // For static scenes, just transition directly
      if (staticScenes.includes(currentScene)) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const nextScene = getNextScene(currentScene);
        onSceneChange(nextScene);
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
        onSceneChange(data.nextScene);
      } else {
        const nextScene = getNextScene(currentScene);
        onSceneChange(nextScene);
      }
      
    } catch (error) {
      console.error('Failed to process choice:', error);
      // Still transition on error for static scenes
      const nextScene = getNextScene(currentScene);
      onSceneChange(nextScene);
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
      // Process puzzle answer through MCP system
      const response = await apiRequest('POST', `/api/generate-dialogue/${currentScene}`, { 
        userChoice: puzzleInput,
        previousChoices: [...previousChoices, puzzleInput],
        userId: 1,
        sessionId: `session-${Date.now()}`
      });
      const data = await response.json();
      
      // Update dialogue with result
      setDynamicSceneData(prev => ({
        ...prev,
        dialogue: data.dialogue || prev.dialogue
      }));

      // Handle puzzle-specific effects
      if (data.puzzleResult) {
        if (data.puzzleResult.correct) {
          // Success - show success message and transition
          await new Promise(resolve => setTimeout(resolve, 2000));
          if (data.nextScene) {
            onSceneChange(data.nextScene);
          }
        } else {
          // Failure - show hint or retry
          setDynamicSceneData(prev => ({
            ...prev,
            dialogue: `${data.dialogue}\n\nAttempts: ${data.puzzleResult.attempts}/3`
          }));
          
          if (data.puzzleResult.attempts >= 3) {
            // Too many attempts - force progression or alternate path
            await new Promise(resolve => setTimeout(resolve, 2000));
            onSceneChange(data.nextSceneFailure || 'end');
          }
        }
      } else {
        // Regular core scene processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        onSceneChange('end');
      }
      
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
      {/* Scene Title and Terminal Button */}
      <div className="text-center mb-6 relative">
        <h1 className="font-orbitron text-cyan-400 text-lg font-bold tracking-[0.2em] mb-2">
          {dynamicSceneData.title}
        </h1>
        <h2 
          className="glitch-text font-orbitron text-4xl md:text-5xl font-black tracking-wider" 
          data-text="ADAPTO"
        >
          ADAPTO
        </h2>
        
        {/* Terminal Access Button */}
        <Button
          onClick={() => setTerminalOpen(true)}
          variant="ghost"
          size="sm"
          className="absolute top-0 right-0 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/30"
        >
          <Terminal className="w-4 h-4 mr-2" />
          Neural Chat
          {agentMessages.length > 0 && (
            <span className="ml-2 bg-cyan-500 text-black text-xs px-2 py-1 rounded-full">
              {agentMessages.length}
            </span>
          )}
        </Button>
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
              <p className="text-gray-100 text-sm md:text-base leading-relaxed font-medium">
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

        {/* Puzzle Data Display */}
        {!isLoading && dynamicSceneData.puzzleData && (
          <div className="mb-6 p-4 bg-gray-900/80 border border-cyan-500/30 rounded-lg">
            <div className="font-mono text-xs text-cyan-300 space-y-2">
              {currentScene === 'log_analysis' && (
                <div>
                  <div className="text-yellow-400">SYSTEM LOGS:</div>
                  <div className="whitespace-pre-wrap">{dynamicSceneData.puzzleData}</div>
                </div>
              )}
              {currentScene === 'memory_reconstruction' && (
                <div>
                  <div className="text-purple-400">MEMORY FRAGMENTS:</div>
                  <div className="whitespace-pre-wrap">{dynamicSceneData.puzzleData}</div>
                </div>
              )}
              {currentScene === 'network_topology' && (
                <div>
                  <div className="text-green-400">NETWORK MAP:</div>
                  <div className="whitespace-pre-wrap">{dynamicSceneData.puzzleData}</div>
                </div>
              )}
            </div>
          </div>
        )}



        {/* Puzzle Input */}
        {!isLoading && !dynamicSceneData.showChoices && (currentScene === 'core' || currentScene.includes('_')) && (
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
              onSceneChange('awaken');
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

      {/* Agent Terminal */}
      <AgentTerminal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        messages={agentMessages}
      />
    </div>
  );
}
