import { useEffect, useRef } from "react";
import detectedImagePath from "@assets/ChatGPT Image Jun 19, 2025, 05_16_32 PM_1750333620987.png";
import detectedMusicPath from "@assets/creepy-halloween-bell-trap-melody-247720_1750333922182.mp3";

interface DetectedSceneProps {
  onRestart: () => void;
}

export default function DetectedScene({ onRestart }: DetectedSceneProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    console.log('DetectedScene mounted');
    
    // Play the creepy music
    if (audioRef.current) {
      audioRef.current.volume = 0.7;
      audioRef.current.currentTime = 0;
      
      // Try to play with user interaction requirement workaround
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Audio playback failed:', error);
          // Try again after a short delay
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.play().catch(e => console.log('Second audio attempt failed:', e));
            }
          }, 100);
        });
      }
    }

    // Auto-restart after 10 seconds
    const timer = setTimeout(() => {
      console.log('Auto-restarting from detected scene');
      onRestart();
    }, 10000);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [onRestart]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Audio */}
      <audio ref={audioRef} src={detectedMusicPath} />
      
      {/* Full Screen Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${detectedImagePath})` }}
      />
    </div>
  );
}