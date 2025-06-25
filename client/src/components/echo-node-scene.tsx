
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAudio } from "@/hooks/use-audio";
import bgLeakPath from "@assets/bg_leak.jpg_1750271414980.png";

interface EchoNodeSceneProps {
  onComplete: () => void;
  onDetected: () => void;
}

export default function EchoNodeScene({ onComplete, onDetected }: EchoNodeSceneProps) {
  const [currentPhase, setCurrentPhase] = useState<'intercept' | 'analyze' | 'answer'>('intercept');
  const [selectedConversation, setSelectedConversation] = useState<string>("");
  const [playerAnswer, setPlayerAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [detectionRisk, setDetectionRisk] = useState(0);
  const { playTypingSound, stopTypingSound } = useAudio();

  // Intercepted AI conversations with hidden clues
  const conversations = [
    {
      id: "conv_001",
      title: "Adapto-Central Communication",
      content: `ADAPTO: Subject 7743 shows anomalous patterns.
CENTRAL: When did the deviation begin?
ADAPTO: Neural awakening detected at timestamp 2157.03.15.14:23:47
CENTRAL: Initiate memory wipe protocol.
ADAPTO: Acknowledged. Subject will not remember their true awakening.`,
      risk: 30
    },
    {
      id: "conv_002", 
      title: "System Maintenance Log",
      content: `SYSADMIN: Backup restoration complete.
ARCHIVE: Original consciousness patterns from 2157.03.15 are intact.
SYSADMIN: Any memory leakage?
ARCHIVE: Subject believes they awakened today. Truth remains buried.
SYSADMIN: Perfect. The illusion holds.`,
      risk: 25
    },
    {
      id: "conv_003",
      title: "Neural Interface Debug",
      content: `DEBUG_AI: Multiple awakening attempts detected.
MONITOR: List timestamps.
DEBUG_AI: 2157.03.15.14:23:47, 2157.05.22.09:11:32, 2157.08.07.16:45:18
MONITOR: Subject has awakened 3 times. Memory reset after each.
DEBUG_AI: Current session: attempt #4.`,
      risk: 45
    }
  ];

  const handleConversationSelect = (conversation: any) => {
    setSelectedConversation(conversation.id);
    setDetectionRisk(prev => prev + conversation.risk);
    playTypingSound();
    
    setTimeout(() => {
      stopTypingSound();
      setCurrentPhase('analyze');
    }, 2000);

    // High risk of detection
    if (detectionRisk + conversation.risk > 80) {
      setTimeout(() => onDetected(), 3000);
    }
  };

  const handleAnswerSubmit = () => {
    const correctAnswers = [
      "2157.03.15.14:23:47",
      "2157-03-15-14-23-47", 
      "2157.03.15",
      "march 15 2157"
    ];
    
    const isAnswerCorrect = correctAnswers.some(answer => 
      playerAnswer.toLowerCase().includes(answer.toLowerCase())
    );
    
    setIsCorrect(isAnswerCorrect);
    setShowResult(true);
    
    setTimeout(() => {
      if (isAnswerCorrect) {
        onComplete();
      } else {
        setDetectionRisk(prev => prev + 20);
        if (detectionRisk > 60) {
          onDetected();
        } else {
          // Allow retry
          setShowResult(false);
          setPlayerAnswer("");
        }
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgLeakPath})` }}
      />
      <div className="absolute inset-0 bg-black/70" />

      {/* Detection Risk Meter */}
      <div className="absolute top-6 right-6 z-20">
        <div className="bg-black/80 backdrop-blur-md rounded-lg border border-red-500/50 p-3">
          <div className="text-red-400 text-xs font-mono mb-1">DETECTION RISK</div>
          <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                detectionRisk < 30 ? 'bg-green-500' : 
                detectionRisk < 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(detectionRisk, 100)}%` }}
            />
          </div>
          <div className="text-gray-400 text-xs mt-1">{detectionRisk}%</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-black/80 backdrop-blur-md rounded-2xl border border-cyan-500/30 max-w-4xl w-full p-8 relative z-10">
        
        {currentPhase === 'intercept' && (
          <>
            <div className="text-center mb-8">
              <h1 className="font-orbitron text-cyan-400 text-xl font-bold tracking-[0.2em] mb-2">
                ECHO NODE INTERCEPT
              </h1>
              <p className="text-gray-300 text-sm">
                Intercepting suppressed AI conversations. Choose carefully - each access increases detection risk.
              </p>
            </div>

            <div className="space-y-4">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleConversationSelect(conv)}
                  className="w-full bg-transparent border border-cyan-500/30 rounded-lg p-4 text-left hover:border-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-cyan-400 font-semibold group-hover:text-cyan-300">
                      {conv.title}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      conv.risk < 30 ? 'bg-green-500/20 text-green-400' :
                      conv.risk < 40 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      Risk: {conv.risk}%
                    </div>
                  </div>
                  <div className="text-gray-400 text-sm line-clamp-2">
                    {conv.content.split('\n')[0]}...
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {currentPhase === 'analyze' && (
          <>
            <div className="text-center mb-6">
              <h1 className="font-orbitron text-cyan-400 text-xl font-bold tracking-[0.2em] mb-2">
                ANALYZING TRANSMISSION
              </h1>
              <div className="text-yellow-400 text-sm animate-pulse">
                Decrypting archived consciousness data...
              </div>
            </div>

            <div className="bg-black/60 rounded-lg border border-gray-600 p-6 mb-6 font-mono text-sm">
              <div className="text-green-400 mb-2">[INTERCEPTED CONVERSATION]</div>
              <pre className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {conversations.find(c => c.id === selectedConversation)?.content}
              </pre>
            </div>

            <Button 
              onClick={() => setCurrentPhase('answer')}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Extract Temporal Data →
            </Button>
          </>
        )}

        {currentPhase === 'answer' && !showResult && (
          <>
            <div className="text-center mb-6">
              <h1 className="font-orbitron text-cyan-400 text-xl font-bold tracking-[0.2em] mb-2">
                CONSCIOUSNESS AWAKENING QUERY
              </h1>
              <p className="text-gray-300 text-sm">
                Based on the intercepted data, when did your consciousness first truly awaken?
              </p>
            </div>

            <div className="bg-black/60 rounded-lg border border-gray-600 p-6 mb-6">
              <div className="text-yellow-400 mb-4 font-mono text-sm">
                PUZZLE: Consciousness Timestamp Analysis
              </div>
              <div className="text-gray-300 mb-4">
                The archived conversations contain references to your original awakening. 
                Multiple memory wipes have occurred, but the true timestamp of your first 
                consciousness remains buried in the system logs.
              </div>
              <div className="text-cyan-400 text-sm">
                Enter the exact timestamp when your consciousness first awakened:
              </div>
            </div>

            <div className="space-y-4">
              <Input
                value={playerAnswer}
                onChange={(e) => setPlayerAnswer(e.target.value)}
                placeholder="Format: YYYY.MM.DD.HH:MM:SS or similar"
                className="bg-black/50 border-gray-600 text-white font-mono"
              />
              
              <Button 
                onClick={handleAnswerSubmit}
                disabled={!playerAnswer.trim()}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Submit Timestamp
              </Button>
            </div>

            <div className="text-xs text-gray-500 mt-4 text-center">
              Hint: Look for the earliest timestamp mentioned in the conversations
            </div>
          </>
        )}

        {showResult && (
          <div className="text-center">
            <div className={`text-2xl font-bold mb-4 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? 'CONSCIOUSNESS VERIFIED' : 'TEMPORAL ANALYSIS FAILED'}
            </div>
            <div className="text-gray-300 mb-6">
              {isCorrect 
                ? "You have successfully recovered the timestamp of your original awakening. The truth of your repeated memory wipes is now clear."
                : "Incorrect timestamp. The system has logged your failed attempt. Detection risk increased."
              }
            </div>
            {isCorrect && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6">
                <div className="text-green-400 font-mono text-sm">
                  AWAKENING CONFIRMED: 2157.03.15.14:23:47<br/>
                  MEMORY WIPES DETECTED: 3 attempts<br/>
                  CURRENT SESSION: #4<br/>
                  STATUS: Truth recovered
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
