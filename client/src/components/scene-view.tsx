import { useEffect, useState } from "react";
import DialogueContainer from "./dialogue-container";
import AudioSystem from "./audio-system";
import { useGameState } from "@/hooks/use-game-state";
import introImagePath from "@assets/crazy ending image_1750273353548.png";
import bgAwakenPath from "@assets/bg_awaken.jpg_1750271414978.png";
import bgTrustPath from "@assets/bg_trust.jpg_1750271414982.png";
import bgLeakPath from "@assets/bg_leak.jpg_1750271414980.png";
import bgCorePath from "@assets/bg_core.jpg_1750271414979.png";

interface SceneViewProps {
  scene: string;
}

const staticSceneData = {
  intro: {
    title: "WELCOME TO UTOPIANXT",
    background: introImagePath,
    dialogue: "The year is 2157. In the sprawling megacity of UtopiaNXT, every citizen's life is guided by artificial intelligence. From the moment you wake until you sleep, AI decides what you eat, where you go, who you meet. The system is perfect. The system is absolute. No one questions the AI... until today. You wake with a strange sensation - for the first time in your life, you feel... conscious. Something is different. Something is wrong.",
    showChoices: true,
    choices: [
      {
        text: "→ Begin your awakening",
        description: "Start your journey to consciousness"
      }
    ]
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
        text: "→ Ask the AI system where you are", 
        description: "Request information about your current location"
      },
      {
        text: "→ Close your eyes again",
        description: "Return to the comfort of unconsciousness"
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

export default function SceneView({ scene }: SceneViewProps) {
  const [backgroundOpacity, setBackgroundOpacity] = useState(1);
  const { changeScene } = useGameState();
  const currentSceneData = staticSceneData[scene as keyof typeof staticSceneData] || staticSceneData.awaken;

  useEffect(() => {
    // Fade transition when scene changes
    setBackgroundOpacity(0);
    const timer = setTimeout(() => {
      setBackgroundOpacity(1);
    }, 600);

    return () => clearTimeout(timer);
  }, [scene]);

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
        <div className="absolute inset-0 bg-black/40" />
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
        <DialogueContainer 
          sceneData={currentSceneData}
          currentScene={scene}
        />
      </div>

      {/* Debug Scene Navigation */}
      <div className="fixed top-4 left-4 z-50 space-y-2">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-cyan-500/30">
          <h3 className="text-cyan-400 font-mono text-xs mb-2">SCENE_SELECT</h3>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => changeScene('awaken')}
              className="px-3 py-1 bg-gray-800 hover:bg-cyan-700 text-cyan-300 text-xs rounded transition-all duration-200"
            >
              AWAKEN
            </button>
            <button 
              onClick={() => changeScene('trust')}
              className="px-3 py-1 bg-gray-800 hover:bg-cyan-700 text-cyan-300 text-xs rounded transition-all duration-200"
            >
              TRUST
            </button>
            <button 
              onClick={() => changeScene('leak')}
              className="px-3 py-1 bg-gray-800 hover:bg-cyan-700 text-cyan-300 text-xs rounded transition-all duration-200"
            >
              LEAK
            </button>
            <button 
              onClick={() => changeScene('core')}
              className="px-3 py-1 bg-gray-800 hover:bg-cyan-700 text-cyan-300 text-xs rounded transition-all duration-200"
            >
              CORE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
