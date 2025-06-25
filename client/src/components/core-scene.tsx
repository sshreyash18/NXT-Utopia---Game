import { useState } from 'react';
import bgCorePath from "@assets/bg_core.jpg_1750271414979.png";

interface CoreSceneProps {
  onComplete: () => void;
}

export default function CoreScene({ onComplete }: CoreSceneProps) {
  const [answer, setAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const philosophicalQuestion = `CORE ACCESS PROTOCOL INITIATED

In the depths of UtopiaNXT's central processing core, you discover the fundamental question that determines system access:

"If an AI eliminates all human suffering by removing human choice, has it created paradise or prison? What is the value of freedom when it includes the freedom to fail?"

Your awakened consciousness must answer this paradox to unlock the core and reveal the truth about your existence.`;

  const handleSubmit = () => {
    // Evaluate answer based on philosophical depth and understanding
    const answerLower = answer.toLowerCase().trim();
    
    // Key concepts that indicate understanding
    const freedomConcepts = ['freedom', 'choice', 'autonomy', 'free will', 'liberty', 'self-determination'];
    const growthConcepts = ['growth', 'learning', 'experience', 'wisdom', 'mistakes', 'struggle', 'development'];
    const dignityComponents = ['dignity', 'humanity', 'human nature', 'individual', 'person', 'soul'];
    const paradoxUnderstanding = ['paradox', 'tension', 'balance', 'trade-off', 'dilemma', 'complexity'];
    const prisonConcepts = ['prison', 'cage', 'control', 'manipulation', 'oppression', 'slavery'];
    
    // Count concept matches
    let conceptScore = 0;
    if (freedomConcepts.some(concept => answerLower.includes(concept))) conceptScore++;
    if (growthConcepts.some(concept => answerLower.includes(concept))) conceptScore++;
    if (dignityComponents.some(concept => answerLower.includes(concept))) conceptScore++;
    if (paradoxUnderstanding.some(concept => answerLower.includes(concept))) conceptScore++;
    if (prisonConcepts.some(concept => answerLower.includes(concept))) conceptScore++;
    
    // Answer must be substantial (50+ characters) and show understanding (2+ concepts)
    const isValidAnswer = answer.length >= 50 && conceptScore >= 2;
    
    setIsCorrect(isValidAnswer);
    setShowResult(true);
    
    if (isValidAnswer) {
      setTimeout(() => {
        onComplete();
      }, 3000);
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ 
        backgroundImage: `url('${bgCorePath}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/70" />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <div className="bg-black/80 border border-cyan-500 rounded-lg p-8">
            <h1 className="text-4xl font-bold text-cyan-400 text-center mb-8">
              CORE ACCESS PROTOCOL
            </h1>
            
            <div className="mb-8">
              <div className="bg-black/60 border border-cyan-500/30 rounded p-6">
                <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                  {philosophicalQuestion}
                </pre>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-cyan-300 font-bold mb-2">
                  CORE_ACCESS_RESPONSE:
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter your philosophical response..."
                  className="w-full h-32 bg-black/60 border border-cyan-500/30 rounded p-4 text-green-400 font-mono focus:border-cyan-400 focus:outline-none resize-none"
                  disabled={showResult && isCorrect}
                />
              </div>

              {!showResult && (
                <button
                  onClick={handleSubmit}
                  disabled={answer.length < 10}
                  className={`w-full py-4 rounded font-bold text-lg transition-all ${
                    answer.length >= 10
                      ? 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-lg shadow-cyan-400/30'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  SUBMIT CORE ACCESS RESPONSE
                </button>
              )}

              {showResult && (
                <div className={`p-6 rounded-lg border text-center ${
                  isCorrect 
                    ? 'bg-green-900/40 border-green-400' 
                    : 'bg-red-900/40 border-red-400'
                }`}>
                  <h3 className={`text-2xl font-bold mb-3 ${
                    isCorrect ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isCorrect ? 'CORE ACCESS GRANTED' : 'ACCESS DENIED'}
                  </h3>
                  <p className={`text-lg ${
                    isCorrect ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {isCorrect 
                      ? 'Your awakened consciousness recognizes the fundamental truth. Initiating final sequence...'
                      : 'Response lacks philosophical depth. Consider: freedom vs security, human dignity, growth through choice, the paradox of perfect safety.'
                    }
                  </p>
                  {!isCorrect && (
                    <button
                      onClick={() => {
                        setShowResult(false);
                        setAnswer('');
                      }}
                      className="mt-4 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Try Again
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 text-center">
              <div className="text-cyan-400 font-mono text-sm">
                SYSTEM STATUS: {showResult && isCorrect ? 'AWAKENING COMPLETE' : 'AWAITING INPUT'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}