import { useRef, useCallback } from "react";

export function useAudio() {
  const backgroundMusic = useRef<HTMLAudioElement>(null);
  const typingSound = useRef<HTMLAudioElement>(null);
  const currentMusicFile = useRef<string>('');

  const playBackgroundMusic = useCallback((musicFile: string) => {
    if (!backgroundMusic.current || currentMusicFile.current === musicFile) return;

    const audio = backgroundMusic.current;
    
    // Fade out current music
    if (!audio.paused) {
      const fadeOut = () => {
        if (audio.volume > 0.1) {
          audio.volume = Math.max(0, audio.volume - 0.1);
          setTimeout(fadeOut, 50);
        } else {
          audio.pause();
          audio.currentTime = 0;
          
          // Load new music and fade in
          audio.src = musicFile;
          audio.volume = 0;
          
          audio.play().then(() => {
            currentMusicFile.current = musicFile;
            const fadeIn = () => {
              if (audio.volume < 0.5) {
                audio.volume = Math.min(0.5, audio.volume + 0.05);
                setTimeout(fadeIn, 50);
              }
            };
            fadeIn();
          }).catch(error => {
            console.log('Audio playback failed:', error);
          });
        }
      };
      fadeOut();
    } else {
      // No current music, just start new track
      audio.src = musicFile;
      audio.volume = 0.5;
      currentMusicFile.current = musicFile;
      audio.play().catch(error => {
        console.log('Audio playback failed:', error);
      });
    }
  }, []);

  const playTypingSound = useCallback(() => {
    if (typingSound.current) {
      typingSound.current.volume = 0.3;
      typingSound.current.play().catch(error => {
        console.log('Typing sound failed:', error);
      });
    }
  }, []);

  const stopTypingSound = useCallback(() => {
    if (typingSound.current) {
      typingSound.current.pause();
      typingSound.current.currentTime = 0;
    }
  }, []);

  return {
    backgroundMusic,
    typingSound,
    playBackgroundMusic,
    playTypingSound,
    stopTypingSound
  };
}
