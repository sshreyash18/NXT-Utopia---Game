import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import detectedImagePath from "@assets/ChatGPT Image Jun 19, 2025, 05_16_32 PM_1750334767301.png";
import detectedMusicPath from "@assets/creepy-halloween-bell-trap-melody-247720_1750334772208.mp3";

interface DetectedSceneProps {
  onRestart: () => void;
}

export default function DetectedScene({ onRestart }: DetectedSceneProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    console.log('DetectedScene mounted - should show image and play audio');
    
    // Play the creepy music with user interaction
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.8;
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(error => {
          console.log('Audio playback failed:', error);
        });
      }
    };

    // Try to play immediately
    playAudio();

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Audio */}
      <audio ref={audioRef} src={detectedMusicPath} />
      
      {/* Full Screen Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${detectedImagePath})` }}
      />
      
      {/* Restart Button - positioned at bottom */}
      <div className="absolute bottom-20 z-10">
        <Button 
          onClick={onRestart}
          className="bg-red-600 hover:bg-red-700 text-white font-mono text-xl px-12 py-4 rounded-lg border border-red-500/50 hover:border-red-400 transition-all duration-300 shadow-lg"
        >
          → Start Over
        </Button>
      </div>
    </div>
  );
}