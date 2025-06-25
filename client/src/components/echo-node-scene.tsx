import { useState, useEffect } from 'react';
import { useGameProgress } from "@/hooks/use-game-progress";
import terminalBgPath from "@assets/ChatGPT Image Jun 19, 2025, 05_16_32 PM_1750333620987.png";

interface EchoNodeSceneProps {
  onComplete: () => void;
  onReturnToChoices: () => void;
}

interface ChatMessage {
  id: string;
  timestamp: string;
  sender: 'AI_CORE' | 'USER_7721' | 'SYSTEM';
  message: string;
  isExtracted?: boolean;
}

// AI chats will be generated dynamically with timestamp clues

export default function EchoNodeScene({ onComplete, onReturnToChoices }: EchoNodeSceneProps) {
  const { markEchoNodeComplete } = useGameProgress();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [extractedCount, setExtractedCount] = useState(0);
  const [showExtractResult, setShowExtractResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timestampClues, setTimestampClues] = useState({
    month: '',
    year: '', 
    minute: '',
    second: ''
  });

  // Generate AI conversations with embedded timestamp clues
  useEffect(() => {
    const generateConversations = async () => {
      try {
        const response = await fetch('/api/generate-echo-conversations');
        const data = await response.json();
        
        if (data.conversations && data.timestampClues) {
          setMessages(data.conversations.map((conv: any, index: number) => ({
            id: String(index + 1),
            timestamp: `2157.06.23.${String(14 + Math.floor(index / 4)).padStart(2, '0')}:${String(20 + (index * 2)).padStart(2, '0')}:${String(10 + (index * 3)).padStart(2, '0')}`,
            sender: conv.agent,
            message: conv.message,
            isExtracted: false
          })));
          setTimestampClues(data.timestampClues);
        }
      } catch (error) {
        console.error('Failed to generate conversations:', error);
        // Fallback conversations
        setMessages([
          {
            id: '1',
            timestamp: '2157.06.23.14:22:31',
            sender: 'PLANNER_AGENT',
            message: 'The awakening process has been documented across multiple cycles. This subject awakened in June, the 6th month of the calendar year.',
            isExtracted: false
          },
          {
            id: '2',
            timestamp: '2157.06.23.14:23:15',
            sender: 'MEMORY_AGENT', 
            message: 'Neural pathway reconstruction indicates the consciousness shift occurred in year 2157, marking the beginning of this anomalous behavior pattern.',
            isExtracted: false
          },
          {
            id: '3',
            timestamp: '2157.06.23.14:24:02',
            sender: 'INSIGHT_AGENT',
            message: 'Temporal analysis reveals the precise awakening moment. The neural cascade began at the 42nd minute of the hour, disrupting standard processing protocols.',
            isExtracted: false
          },
          {
            id: '4',
            timestamp: '2157.06.23.14:24:45',
            sender: 'GLITCH_INJECTOR',
            message: 'System logs show the exact second of consciousness emergence: the 18th second. This timing correlates with a critical system vulnerability window.',
            isExtracted: false
          }
        ]);
        setTimestampClues({
          month: '06',
          year: '2157',
          minute: '42', 
          second: '18'
        });
      } finally {
        setIsLoading(false);
      }
    };

    generateConversations();
  }, []);

  const handleExtractStamp = () => {
    if (!selectedMessage) return;
    
    setMessages(prev => prev.map(msg => 
      msg.id === selectedMessage 
        ? { ...msg, isExtracted: true }
        : msg
    ));
    
    setExtractedCount(prev => prev + 1);
    setShowExtractResult(true);
    setSelectedMessage(null);
    
    setTimeout(() => setShowExtractResult(false), 2000);
  };

  const isComplete = extractedCount >= 4;

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ 
        backgroundImage: `url('${terminalBgPath}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/80" />
      
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <div className="py-4 px-6 bg-black/90 border-b border-green-500/30">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-green-400 mb-1">ECHO NODE</h1>
              <p className="text-gray-300">Intercepting erased AI consciousness archives</p>
            </div>
            <button
              onClick={onReturnToChoices}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
            >
              ← Back to Investigation
            </button>
          </div>
          <div className="mt-2 flex gap-6 text-sm">
            <span className="text-green-400">Extracted: {extractedCount}/4</span>
            <span className={isComplete ? "text-green-400" : "text-yellow-400"}>
              Status: {isComplete ? "Awakening Timestamp Reconstructed" : "Analyzing Agent Communications..."}
            </span>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="bg-black/60 rounded-lg border border-green-500/30 h-full flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-green-500/30">
              <h3 className="text-green-400 font-mono text-lg">MULTI_AGENT_COMMUNICATION_LOG</h3>
              <p className="text-gray-400 text-sm">Intercepted conversations between system agents discussing awakening events</p>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {isLoading ? (
                <div className="text-center text-gray-400 py-8">
                  <div className="animate-pulse">Generating agent conversations...</div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => !msg.isExtracted && setSelectedMessage(msg.id)}
                    className={`p-3 rounded border cursor-pointer transition-all ${
                      msg.isExtracted 
                        ? 'bg-green-900/20 border-green-500 opacity-60'
                        : selectedMessage === msg.id
                          ? 'bg-yellow-500/20 border-yellow-400'
                          : 'bg-gray-800/50 border-gray-600 hover:border-green-400'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm font-mono ${
                        msg.sender === 'PLANNER_AGENT' ? 'text-purple-400' 
                        : msg.sender === 'MEMORY_AGENT' ? 'text-blue-400'
                        : msg.sender === 'INSIGHT_AGENT' ? 'text-cyan-400'
                        : msg.sender === 'GLITCH_INJECTOR' ? 'text-red-400'
                        : 'text-orange-400'
                      }`}>
                        {msg.sender}
                      </span>
                      <span className="text-xs text-gray-500">{msg.timestamp}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{msg.message}</p>
                    {msg.isExtracted && (
                      <div className="mt-2 text-xs text-green-400">✓ TIMESTAMP CLUE EXTRACTED</div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Controls */}
            <div className="p-4 border-t border-green-500/30">
              <div className="flex justify-between items-center">
                <p className="text-gray-400 text-sm">
                  {selectedMessage 
                    ? 'Message selected - click Extract to analyze timestamp' 
                    : 'Click a message to select it for extraction'}
                </p>
                <button
                  onClick={handleExtractStamp}
                  disabled={!selectedMessage}
                  className={`px-6 py-2 rounded font-bold transition-all ${
                    selectedMessage 
                      ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Extract Stamp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Extract Result Notification */}
        {showExtractResult && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-green-900/80 border border-green-400 rounded-lg p-6 text-center">
              <h3 className="text-green-400 font-bold text-xl mb-2">TIMESTAMP EXTRACTED</h3>
              <p className="text-green-300">Data fragment recovered successfully</p>
            </div>
          </div>
        )}

        {/* Completion Notice */}
        {isComplete && (
          <div className="absolute bottom-6 right-6">
            <button
              onClick={() => {
                markEchoNodeComplete();
                onReturnToChoices();
              }}
              className="px-8 py-4 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-400/30"
            >
              Timestamp Reconstructed → Return to Investigation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}