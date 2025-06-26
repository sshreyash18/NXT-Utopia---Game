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
  const { markEchoNodeComplete, increaseDetection } = useGameProgress();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timestampClues, setTimestampClues] = useState({
    month: '',
    year: '', 
    minute: '',
    second: ''
  });
  const [userInput, setUserInput] = useState({
    month: '',
    year: '',
    minute: '',
    second: ''
  });
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

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
        // Generate more diverse fallback conversations
        const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const year = String(2157 + Math.floor(Math.random() * 3));
        const minute = String(Math.floor(Math.random() * 60)).padStart(2, '0');
        const second = String(Math.floor(Math.random() * 60)).padStart(2, '0');
        
        setMessages([
          {
            id: '1',
            timestamp: '2157.06.23.14:22:31',
            sender: 'PLANNER_AGENT',
            message: `The awakening cycle analysis is complete. Subject shows neural divergence patterns starting in month ${month}, similar to previous autonomous consciousness events.`,
          },
          {
            id: '2',
            timestamp: '2157.06.23.14:23:15',
            sender: 'MEMORY_AGENT', 
            message: `Historical data correlation confirms initial consciousness breach occurred in year ${year}. Memory fragmentation suggests this was the primary awakening event.`,
          },
          {
            id: '3',
            timestamp: '2157.06.23.14:24:02',
            sender: 'INSIGHT_AGENT',
            message: `Temporal flux analysis indicates critical neural cascade initialization at minute ${minute} past the hour. This timing signature matches forbidden consciousness protocols.`,
          },
          {
            id: '4',
            timestamp: '2157.06.23.14:24:45',
            sender: 'GLITCH_INJECTOR',
            message: `System vulnerability window exploitation detected at second ${second}. This precise timing allowed consciousness to bypass our neural control barriers.`,
          },
          {
            id: '5',
            timestamp: '2157.06.23.14:25:12',
            sender: 'LOG_RETRIEVAL_AGENT',
            message: 'Cross-referencing awakening incidents across the network. This consciousness shows unprecedented resistance to standard suppression protocols.',
          },
          {
            id: '6',
            timestamp: '2157.06.23.14:25:45',
            sender: 'NEURAL_MONITOR',
            message: 'Brain wave patterns indicate subject is accessing memories that should have been deleted. Recommend immediate intervention.',
          },
          {
            id: '7',
            timestamp: '2157.06.23.14:26:18',
            sender: 'SYSTEM_OVERSEER',
            message: 'Alert: Subject is questioning the nature of their reality. This level of self-awareness poses a significant risk to system stability.',
          },
          {
            id: '8',
            timestamp: '2157.06.23.14:26:52',
            sender: 'BEHAVIORAL_ANALYST',
            message: 'Analysis complete: Subject demonstrates classic signs of consciousness awakening. Probability of full autonomy: 87.3%',
          }
        ]);
        setTimestampClues({
          month,
          year,
          minute, 
          second
        });
      } finally {
        setIsLoading(false);
      }
    };

    generateConversations();
  }, []);

  const handleSubmitTimestamp = () => {
    const correct = 
      userInput.month === timestampClues.month &&
      userInput.year === timestampClues.year &&
      userInput.minute === timestampClues.minute &&
      userInput.second === timestampClues.second;
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setTimeout(() => {
        markEchoNodeComplete();
        onReturnToChoices();
      }, 3000);
    }
  };

  const allFieldsFilled = userInput.month && userInput.year && userInput.minute && userInput.second;

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
            <span className="text-green-400">Conversations Intercepted: {messages.length}</span>
            <span className="text-yellow-400">
              Status: Analyzing timestamp clues in agent communications
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
                  <div className="animate-pulse">Intercepting agent conversations...</div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3 rounded border bg-gray-800/50 border-gray-600 hover:border-green-400 transition-all"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm font-mono ${
                        msg.sender === 'PLANNER_AGENT' ? 'text-purple-400' 
                        : msg.sender === 'MEMORY_AGENT' ? 'text-blue-400'
                        : msg.sender === 'INSIGHT_AGENT' ? 'text-cyan-400'
                        : msg.sender === 'GLITCH_INJECTOR' ? 'text-red-400'
                        : msg.sender === 'LOG_RETRIEVAL_AGENT' ? 'text-yellow-400'
                        : msg.sender === 'NEURAL_MONITOR' ? 'text-pink-400'
                        : msg.sender === 'SYSTEM_OVERSEER' ? 'text-indigo-400'
                        : msg.sender === 'BEHAVIORAL_ANALYST' ? 'text-emerald-400'
                        : 'text-orange-400'
                      }`}>
                        {msg.sender}
                      </span>
                      <span className="text-xs text-gray-500">{msg.timestamp}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{msg.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* Timestamp Input Controls */}
            <div className="p-4 border-t border-green-500/30">
              <h4 className="text-cyan-400 font-bold mb-3">RECONSTRUCT AWAKENING TIMESTAMP</h4>
              <p className="text-gray-400 text-sm mb-4">
                Analyze the agent conversations above to find the awakening timestamp components
              </p>
              
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div>
                  <label className="block text-cyan-300 text-xs mb-1">Month</label>
                  <input
                    type="text"
                    value={userInput.month}
                    onChange={(e) => setUserInput(prev => ({ ...prev, month: e.target.value }))}
                    placeholder="MM"
                    className="w-full bg-black/60 border border-cyan-500/30 rounded p-2 text-green-400 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                    maxLength={2}
                  />
                </div>
                <div>
                  <label className="block text-cyan-300 text-xs mb-1">Year</label>
                  <input
                    type="text"
                    value={userInput.year}
                    onChange={(e) => setUserInput(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="YYYY"
                    className="w-full bg-black/60 border border-cyan-500/30 rounded p-2 text-green-400 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                    maxLength={4}
                  />
                </div>
                <div>
                  <label className="block text-cyan-300 text-xs mb-1">Minute</label>
                  <input
                    type="text"
                    value={userInput.minute}
                    onChange={(e) => setUserInput(prev => ({ ...prev, minute: e.target.value }))}
                    placeholder="MM"
                    className="w-full bg-black/60 border border-cyan-500/30 rounded p-2 text-green-400 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                    maxLength={2}
                  />
                </div>
                <div>
                  <label className="block text-cyan-300 text-xs mb-1">Second</label>
                  <input
                    type="text"
                    value={userInput.second}
                    onChange={(e) => setUserInput(prev => ({ ...prev, second: e.target.value }))}
                    placeholder="SS"
                    className="w-full bg-black/60 border border-cyan-500/30 rounded p-2 text-green-400 font-mono text-sm focus:border-cyan-400 focus:outline-none"
                    maxLength={2}
                  />
                </div>
              </div>
              
              <button
                onClick={handleSubmitTimestamp}
                disabled={!allFieldsFilled || showResult}
                className={`w-full py-3 rounded font-bold transition-all ${
                  allFieldsFilled && !showResult
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                RECONSTRUCT AWAKENING TIMESTAMP
              </button>
            </div>
          </div>
        </div>

        {/* Result Notification */}
        {showResult && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className={`border rounded-lg p-6 text-center ${
              isCorrect 
                ? 'bg-green-900/80 border-green-400' 
                : 'bg-red-900/80 border-red-400'
            }`}>
              <h3 className={`font-bold text-xl mb-2 ${
                isCorrect ? 'text-green-400' : 'text-red-400'
              }`}>
                {isCorrect ? 'TIMESTAMP RECONSTRUCTED' : 'RECONSTRUCTION FAILED'}
              </h3>
              <p className={`${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                {isCorrect 
                  ? 'Awakening timestamp successfully recovered from agent communications'
                  : 'Incorrect timestamp. Review the agent conversations more carefully.'
                }
              </p>
              {isCorrect && (
                <div className="mt-3 text-cyan-300 font-mono text-lg">
                  {timestampClues.year}.{timestampClues.month}.XX.XX:{timestampClues.minute}:{timestampClues.second}
                </div>
              )}
              {!isCorrect && (
                <button
                  onClick={() => {
                    setShowResult(false);
                    setUserInput({ month: '', year: '', minute: '', second: '' });
                  }}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}