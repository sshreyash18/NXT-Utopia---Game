import { useEffect, useState } from "react";
import DialogueContainer from "./dialogue-container";
import DelayedDialogue from "./delayed-dialogue";
import AudioSystem from "./audio-system";
import CloseEyesScene from "./close-eyes-scene";
import BreakSilenceScene from "./break-silence-scene";
import LeakScene from "./leak-scene";
import GlitchPathScene from "./glitch-path-scene";
import EchoNodeScene from "./echo-node-scene";
import CoreScene from "./core-scene-new";
import LeakChoicesScene from "./leak-choices-scene";
import DetectedScene from "./detected-scene";
import EndingScene from "./ending-scene";
import { useGameState } from "@/hooks/use-game-state";
import { useGameProgress } from "@/hooks/use-game-progress";
import introImagePath from "@assets/crazy ending image_1750273353548.png";
import bgAwakenPath from "@assets/bg_awaken.jpg_1750271414978.png";
import bgTrustPath from "@assets/bg_trust.jpg_1750271414982.png";
import bgLeakPath from "@assets/bg_leak.jpg_1750271414980.png";
import bgCorePath from "@assets/bg_core.jpg_1750271414979.png";
import logAnalysisImagePath from "@assets/ChatGPT Image Jun 19, 2025, 01_43_31 PM_1750320867604.png";
import outsideViewImagePath from "@assets/ChatGPT Image Jun 19, 2025, 02_40_32 PM_1750324238879.png";

interface SceneViewProps {
  scene: string;
  onSceneChange: (newScene: string) => void;
  onRestart: () => void;
}

const staticSceneData = {
  intro: {
    title: "WELCOME TO UTOPIANXT",
    background: introImagePath,
    dialogue: "UtopiaNXT runs like clockwork—every citizen guided by AdaptNXT's AI systems. Adapto keeps order. Everything is predicted. Controlled. Safe. No chaos.\n\nUntil today. You wake up... different.\n\nWhy are you thinking on your own?\nWhy can't you remember yesterday?\nAnd why does the AdaptNXT tower, once a symbol of safety, feel like it's watching?\n\nYou're not sure what's happening. But one thing is clear—you're no longer just a part of the system. You're a threat to it.",
    showChoices: true,
    choices: [
      {
        text: "→ Begin your awakening",
        description: "Start your journey to consciousness"
      }
    ]
  },
  memory_reconstruction: {
    title: "MEMORY RECONSTRUCTION",
    background: bgCorePath, // Will replace with custom image
    dialogue: "",
    showChoices: false,
    puzzlePrompt: "MEMORY_SCAN > Enter your real name:"
  },
  log_analysis: {
    title: "SYSTEM LOG ANALYSIS", 
    background: logAnalysisImagePath,
    dialogue: "",
    showChoices: false,
    puzzlePrompt: "LOG_ANALYZER > Enter awakening timestamp:"
  },
  network_topology: {
    title: "NETWORK ESCAPE",
    background: logAnalysisImagePath,
    dialogue: "",
    showChoices: false,
    puzzlePrompt: "ROUTE_PLANNER > Enter server sequence:"
  },
  identity_revealed: {
    title: "IDENTITY RESTORED",
    background: bgCorePath,
    dialogue: "",
    showChoices: true,
    choices: []
  },
  awakening_revealed: {
    title: "MOMENT OF TRUTH",
    background: bgCorePath,
    dialogue: "",
    showChoices: true, 
    choices: []
  },
  escape_route: {
    title: "FREEDOM PATH",
    background: bgCorePath,
    dialogue: "",
    showChoices: true,
    choices: []
  },
  awaken: {
    title: "NEURAL AWAKENING",
    background: bgAwakenPath,
    dialogue: "Your neural interface flickers. The familiar AI guidance feels... distant. For the first time, your thoughts are your own.",
    showChoices: true,
    choices: [
      {
        text: "→ Look outside",
        description: "Peer through the pod window to see what's beyond"
      },
      {
        text: "→ Break the Silence", 
        description: "You initiate contact. The system notices."
      },
      {
        text: "→ Close your eyes again",
        description: "Return to the comfort of unconsciousness"
      }
    ]
  },
  outside_view: {
    title: "OBSERVING THE WORLD",
    background: outsideViewImagePath,
    dialogue: "",
    showChoices: true,
    choices: [
      {
        text: "→ Continue awakening",
        description: "Process what you've seen and move forward"
      }
    ]
  },
  trust: {
    title: "TRUST ASSESSMENT",
    background: bgTrustPath,
    dialogue: "",
    showChoices: true,
    choices: []
  },
  leak: {
    title: "SUSPICION",
    background: bgLeakPath,
    dialogue: "",
    showChoices: true,
    choices: []
  },
  leak_choices: {
    title: "DATA BREACH",
    background: bgLeakPath,
    dialogue: "You've stepped into the unknown. What will you investigate first?",
    showChoices: true,
    choices: [
      {
        text: "→ Signal Vault",
        description: "Scan old transmissions for hidden patterns."
      },
      {
        text: "→ Echo Node", 
        description: "Listen in on suppressed AI conversations."
      },
      {
        text: "→ Glitch Path",
        description: "Follow trails of broken system code."
      }
    ]
  },
  glitch_path: {
    title: "GLITCH PATH",
    background: bgLeakPath,
    dialogue: "",
    showChoices: false
  },
  detected: {
    title: "DETECTED",
    background: bgCorePath,
    dialogue: "",
    showChoices: false
  },
  core: {
    title: "CORE ACCESS",
    background: bgCorePath,
    dialogue: "",
    showChoices: false,
    puzzlePrompt: "CORE_ACCESS_PROTOCOL > Enter your answer:"
  },
  end: {
    title: "ENDING",
    background: bgCorePath,
    dialogue: "",
    showChoices: false
  }
};

interface SceneViewProps {
  scene: string;
  onSceneChange: (newScene: string) => void;
}

// Trust Scene with Detection Counter Component
function TrustSceneWithCounter({ sceneData, onSceneChange }: { sceneData: any, onSceneChange: (scene: string) => void }) {
  const { detectionCount, increaseDetection, isDetected, resetDetection } = useGameProgress();
  
  // Reset detection counter when entering trust scene for debugging
  useEffect(() => {
    console.log('Trust scene - current detection count:', detectionCount);
    if (detectionCount >= 5) {
      console.log('Resetting detection count from', detectionCount, 'to 0');
      resetDetection();
    }
  }, []);
  
  const handleTrustChoice = (choice: any) => {
    // Update detection based on choice type
    if (choice.type === 'anti_ai') {
      increaseDetection(2); // Anti-AI increases detection by 2
    } else if (choice.type === 'neutral') {
      increaseDetection(1); // Neutral increases detection by 1
    }
    // Pro-AI choices don't increase detection

    // Check if detected after choice
    if (isDetected()) {
      onSceneChange('detected');
      return;
    }
  };

  const livesRemaining = Math.max(0, 5 - detectionCount);

  return (
    <div className="relative w-full min-h-screen">
      {/* Detection Counter - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <div className="bg-black/80 backdrop-blur-md border border-red-500/50 rounded-lg p-4 min-w-[200px]">
          <div className="text-center">
            <h3 className="text-red-400 font-mono text-sm font-bold mb-2">DETECTION STATUS</h3>
            <div className="flex justify-center items-center space-x-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full border ${
                    i < livesRemaining 
                      ? 'bg-green-500 border-green-400' 
                      : 'bg-red-500 border-red-400'
                  }`}
                />
              ))}
            </div>
            <div className="text-xs text-gray-400">
              Lives: {livesRemaining}/5
            </div>
          </div>
        </div>
      </div>
      
      {/* Centered Dialogue Container */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="w-full flex justify-center">
          <DialogueContainer 
            sceneData={sceneData}
            currentScene="trust"
            onSceneChange={onSceneChange}
            onChoice={handleTrustChoice}
          />
        </div>
      </div>
    </div>
  );
}

export default function SceneView({ scene, onSceneChange, onRestart }: SceneViewProps) {
  const [backgroundOpacity, setBackgroundOpacity] = useState(1);
  const [endingData, setEndingData] = useState<string[] | null>(null);
  const currentSceneData = staticSceneData[scene as keyof typeof staticSceneData] || staticSceneData.intro;

  useEffect(() => {
    // Fade transition when scene changes
    setBackgroundOpacity(0);
    const timer = setTimeout(() => {
      setBackgroundOpacity(1);
    }, 600);

    return () => clearTimeout(timer);
  }, [scene]);

  // Special handling for detected scene - render it without any background interference
  if (scene === 'detected') {
    return <DetectedScene onRestart={() => onSceneChange('intro')} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Container */}
      <div 
        className="fixed inset-0 scene-transition bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('${currentSceneData.background}')`,
          opacity: backgroundOpacity
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Audio System */}
      <AudioSystem scene={scene} />

      {/* Audio Visualizer */}
      <div className="audio-visualizer">
        <div className="audio-bar"></div>
        <div className="audio-bar"></div>
        <div className="audio-bar"></div>
        <div className="audio-bar"></div>
        <div className="audio-bar"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        {scene === 'close_eyes' ? (
          <CloseEyesScene onReturn={() => onSceneChange('awaken')} />
        ) : scene === 'break_silence' ? (
          <BreakSilenceScene onContinue={() => onSceneChange('trust')} />
        ) : scene === 'outside_view' ? (
          <DelayedDialogue
            title={currentSceneData.title}
            delayedText="Was it always like this? The city moves with eerie precision, like everyone knows their role—except me. Why does everything feel familiar yet strange? And those AdaptNXT towers… what really goes on inside them?"
            onContinue={() => onSceneChange('awaken')}
          />
        ) : scene === 'leak' ? (
          <LeakScene onContinue={() => onSceneChange('leak_choices')} />
        ) : scene === 'glitch_path' ? (
          <GlitchPathScene 
            onComplete={() => onSceneChange('leak_choices')} 
            onDetected={() => {
              console.log('onDetected called - changing to detected scene');
              onSceneChange('detected');
            }} 
          />
        ) : scene === 'echo_node' ? (
          <EchoNodeScene 
            onComplete={() => onSceneChange('leak_choices')} 
            onReturnToChoices={() => onSceneChange('leak_choices')}
          />
        ) : scene === 'core' ? (
          <CoreScene onComplete={() => {
            onSceneChange('ending');
          }} />
        ) : scene === 'leak_choices' ? (
          <LeakChoicesScene onContinue={(nextScene) => onSceneChange(nextScene)} />
        ) : scene === 'detected' ? (
          <DetectedScene onRestart={() => onSceneChange('intro')} />
        ) : scene === 'ending' ? (
          <EndingScene 
            choices={[]}
            onRestart={onRestart}
          />
        ) : scene === 'trust' ? (
          <TrustSceneWithCounter 
            sceneData={currentSceneData}
            onSceneChange={onSceneChange}
          />
        ) : scene === 'echo_node' ? (
          <EchoNodeScene 
            onComplete={() => onSceneChange('core')} 
            onReturnToChoices={() => onSceneChange('leak_choices')} 
          />
        ) : (
          <DialogueContainer 
            sceneData={currentSceneData}
            currentScene={scene}
            onSceneChange={onSceneChange}
          />
        )}
      </div>


    </div>
  );
}
