import { useState, useEffect } from 'react';
import { useGameProgress } from '../hooks/use-game-progress';

interface CoreSceneProps {
  onComplete: (userResponses: string[]) => void;
}

interface AIQuestion {
  question: string;
  id: string;
}

export default function CoreScene({ onComplete }: CoreSceneProps) {
  const { markCoreAccessGranted } = useGameProgress();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<AIQuestion[]>([]);
  const [userResponses, setUserResponses] = useState<string[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalQuestions = 3;

  // Generate AI questions on component mount
  useEffect(() => {
    const generateQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/generate-core-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (response.ok) {
          const data = await response.json();
          setQuestions(data.questions || []);
        } else {
          // Fallback questions if API fails
          setQuestions([
            { id: '1', question: 'What does freedom mean to you in an AI-integrated world?' },
            { id: '2', question: 'How do you balance efficiency with human autonomy?' },
            { id: '3', question: 'What role should humans play in the future of technology?' }
          ]);
        }
      } catch (error) {
        console.error('Failed to generate questions:', error);
        // Fallback questions
        setQuestions([
          { id: '1', question: 'What does freedom mean to you in an AI-integrated world?' },
          { id: '2', question: 'How do you balance efficiency with human autonomy?' },
          { id: '3', question: 'What role should humans play in the future of technology?' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    generateQuestions();
  }, []);

  const handleSubmitResponse = async () => {
    if (!currentResponse.trim()) return;
    
    const newResponses = [...userResponses, currentResponse.trim()];
    setUserResponses(newResponses);
    
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
      setCurrentResponse('');
    } else {
      // All questions answered
      markCoreAccessGranted();
      onComplete(newResponses);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-blue-900/20 via-purple-900/30 to-cyan-900/20">
        <div className="relative z-10 max-w-4xl w-full bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
              CORE ACCESS PROTOCOL
            </h1>
            <div className="text-cyan-300 mb-4">Generating personalized questions...</div>
            <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-blue-900/20 via-purple-900/30 to-cyan-900/20">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-blue-500/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-purple-500/25 rounded-full blur-lg animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
            CORE ACCESS PROTOCOL
          </h1>
          <div className="text-cyan-300 mb-2">
            Question {currentQuestion + 1} of {totalQuestions}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
            <h2 className="text-xl text-white font-medium mb-4 leading-relaxed">
              {questions[currentQuestion]?.question || 'Loading question...'}
            </h2>
          </div>

          <div className="space-y-4">
            <textarea
              value={currentResponse}
              onChange={(e) => setCurrentResponse(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full p-4 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              rows={4}
            />
            
            <button
              onClick={handleSubmitResponse}
              disabled={!currentResponse.trim() || isSubmitting}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              {currentQuestion < totalQuestions - 1 ? 'Next Question' : 'Complete Assessment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}