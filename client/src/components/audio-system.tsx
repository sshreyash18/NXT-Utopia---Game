import { useEffect } from "react";
import { useAudio } from "@/hooks/use-audio";

interface AudioSystemProps {
  scene: string;
}

export default function AudioSystem({ scene }: AudioSystemProps) {
  const { 
    backgroundMusic, 
    typingSound, 
    playBackgroundMusic, 
    playTypingSound, 
    stopTypingSound 
  } = useAudio();

  useEffect(() => {
    // Change background music when scene changes
    const musicFiles = {
      awaken: '/assets/awaken_theme.mp3_1750271483516.mp3',
      trust: '/assets/trust_theme.mp3_1750271483518.mp3', 
      leak: '/assets/leak_theme.mp3_1750271483517.mp3',
      core: '/assets/core_theme.mp3_1750271483517.mp3'
    };

    const musicFile = musicFiles[scene as keyof typeof musicFiles];
    if (musicFile) {
      playBackgroundMusic(musicFile);
    }
  }, [scene, playBackgroundMusic]);

  return (
    <>
      <audio
        ref={backgroundMusic}
        loop
        preload="auto"
        style={{ display: 'none' }}
      />
      <audio
        ref={typingSound}
        loop
        preload="auto"
        style={{ display: 'none' }}
      >
        <source src="/assets/typing.mp3_1750271483518.mp3" type="audio/mpeg" />
      </audio>
    </>
  );
}
