import { useEffect, useRef } from "react";
import detectedImagePath from "@assets/ChatGPT Image Jun 19, 2025, 05_16_32 PM_1750333620987.png";
import detectedMusicPath from "@assets/creepy-halloween-bell-trap-melody-247720_1750333922182.mp3";

interface DetectedSceneProps {
  onRestart: () => void;
}

export default function DetectedScene({ onRestart }: DetectedSceneProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Play the creepy music
    if (audioRef.current) {
      audioRef.current.volume = 0.7;
      audioRef.current.play().catch(error => {
        console.log('Audio playback failed:', error);
      });
    }

    // Auto-restart after 10 seconds
    const timer = setTimeout(() => {
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