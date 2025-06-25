import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/hooks/use-audio";
import { useGameProgress } from "@/hooks/use-game-progress";
import bgLeakPath from "@assets/bg_leak.jpg_1750271414980.png";

interface GlitchPathSceneProps {
  onComplete: () => void;
  onDetected: () => void;
}

interface Puzzle {
  question: string;
  choices: { text: string; letter: string }[];
  correctAnswer: string;
  explanation?: string;
}

export default function GlitchPathScene({ onComplete, onDetected }: GlitchPathSceneProps) {
  const { markGlitchPathComplete } = useGameProgress();
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { playTypingSound, stopTypingSound } = useAudio();

  // Generate puzzles on component mount
  useEffect(() => {
    const generatePuzzles = async () => {
      try {
        const newPuzzles: Puzzle[] = [];
        for (let i = 1; i <= 3; i++) {
          const response = await fetch(`/api/generate-puzzle/${i}`);
          const puzzleData = await response.json();
          newPuzzles.push(puzzleData);
        }
        setPuzzles(newPuzzles);
      } catch (error) {
        console.error('Failed to generate puzzles:', error);
        // Use fallback puzzles
        setPuzzles([
          {
            question: "If WORD = 23151518, what is CODE?",
            choices: [
              { text: "3154", letter: "A" },
              { text: "315405", letter: "B" },
              { text: "3151405", letter: "C" }
            ],
            correctAnswer: "C",
            explanation: "Each letter = alphabet position: C(3), O(15), D(4), E(5) = 3151405"
          },
          {
            question: "The system blinks: 01001000\n\nWhat does it mean?",
            choices: [
              { text: "72", letter: "A" },
              { text: "'H'", letter: "B" },
              { text: "010", letter: "C" }
            ],
            correctAnswer: "B",
            explanation: "01001000 = 72 in decimal = 'H' in ASCII"
          },
          {
            question: "Log entry: \"Neural paths optimized. Citizens comply.\"\n\nWhat does this suggest?",
            choices: [
              { text: "System maintenance", letter: "A" },
              { text: "Mind control protocol", letter: "B" },
              { text: "Network upgrade", letter: "C" }
            ],
            correctAnswer: "B",
            explanation: "AdaptNXT controls citizen behavior through neural manipulation"
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    generatePuzzles();
  }, []);

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    playTypingSound();
    setShowResult(true);
    
    const correct = selectedAnswer === puzzles[currentPuzzle].correctAnswer;
    setIsCorrect(correct);

    setTimeout(() => {
      stopTypingSound();
      
      if (!correct) {
        console.log('Wrong answer - calling onDetected()', { currentPuzzle, selectedAnswer, correctAnswer: puzzles[currentPuzzle].correctAnswer });
        onDetected();
        return;
      } else if (currentPuzzle < puzzles.length - 1) {
        // Next puzzle
        setCurrentPuzzle(prev => prev + 1);
        setSelectedAnswer("");
        setShowResult(false);
      } else {
        // All puzzles completed
        markGlitchPathComplete();
        // Navigate back to investigation choices instead of core
        setTimeout(() => {
          window.location.href = '#leak_choices'; // Force navigation back
        }, 1000);
      }
    }, 2000);
  };

  if (isLoading || puzzles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgLeakPath})` }}
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="bg-black/80 backdrop-blur-md rounded-2xl border border-red-500/30 max-w-3xl w-full p-8 animate-fade-in relative z-10">
          <div className="text-center">
            <h1 className="font-orbitron text-red-400 text-lg font-bold tracking-[0.2em] mb-4">
              GENERATING PUZZLES...
            </h1>
            <div className="animate-pulse text-red-300 font-mono">
              Decrypting system challenges...
            </div>
          </div>
        </div>
      </div>
    );
  }

  const puzzle = puzzles[currentPuzzle];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgLeakPath})` }}
      />
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="bg-black/80 backdrop-blur-md rounded-2xl border border-red-500/30 max-w-3xl w-full p-8 animate-fade-in relative z-10">
        <div className="text-center mb-6">
          <h1 className="font-orbitron text-red-400 text-lg font-bold tracking-[0.2em] mb-2">
            GLITCH PATH - PUZZLE {currentPuzzle + 1}/3
          </h1>
          <h2 
            className="glitch-text font-orbitron text-4xl md:text-5xl font-black tracking-wider text-red-400" 
            data-text="DECODE"
          >
            DECODE
          </h2>
        </div>

        {/* Puzzle Question */}
        <div className="mb-8">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <p className="text-red-300 font-mono text-base leading-relaxed whitespace-pre-line mb-6">
              {puzzle.question}
            </p>

            {/* Choices */}
            <div className="space-y-3">
              {puzzle.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && setSelectedAnswer(choice.letter)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-200 font-mono ${
                    selectedAnswer === choice.letter
                      ? 'bg-red-600/30 border-red-400 text-red-200'
                      : 'bg-red-900/10 border-red-500/30 text-red-300 hover:bg-red-800/20 hover:border-red-400'
                  } ${showResult ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                >
                  <span className="font-bold text-red-400">{choice.letter}.</span> {choice.text}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result Display */}
        {showResult && (
          <div className="mb-6">
            <div className={`border rounded-lg p-4 ${
              isCorrect 
                ? 'bg-green-900/20 border-green-500/30 text-green-300' 
                : 'bg-red-900/30 border-red-500/50 text-red-300'
            }`}>
              <p className="font-mono text-center font-bold">
                {isCorrect ? '✅ CORRECT!' : '❌ DETECTED!'}
              </p>
              {puzzle.explanation && (
                <p className="font-mono text-sm mt-2 opacity-80">
                  {puzzle.explanation}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        {!showResult && (
          <div className="flex justify-center">
            <Button 
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="bg-red-600 hover:bg-red-700 text-white font-mono text-lg px-8 py-3 rounded-lg border border-red-500/50 hover:border-red-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              → Submit Answer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}