import { useEffect, useState } from 'react';

interface GlitchEffectsProps {
  effects: any;
  children: React.ReactNode;
}

export default function GlitchEffects({ effects, children }: GlitchEffectsProps) {
  const [glitchedText, setGlitchedText] = useState<string>('');
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (!effects) return;

    const applyGlitchEffects = () => {
      if (effects.textGlitches && Math.random() < effects.textGlitches.replacementProbability) {
        triggerTextGlitch();
      }

      if (effects.visualGlitches?.screenShake) {
        triggerScreenShake();
      }

      if (effects.triggerConditions?.randomInterval) {
        setTimeout(applyGlitchEffects, effects.triggerConditions.randomInterval);
      }
    };

    applyGlitchEffects();
  }, [effects]);

  const triggerTextGlitch = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 200);
  };

  const triggerScreenShake = () => {
    document.body.style.animation = 'screen-shake 0.5s ease-in-out';
    setTimeout(() => {
      document.body.style.animation = '';
    }, 500);
  };

  const corruptText = (text: string) => {
    if (!effects?.textGlitches || !isGlitching) return text;
    
    const { glitchChars, corruptionRate } = effects.textGlitches;
    return text.split('').map(char => {
      if (Math.random() < corruptionRate) {
        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
      }
      return char;
    }).join('');
  };

  return (
    <div 
      className={`relative ${isGlitching ? 'animate-pulse' : ''}`}
      style={{
        filter: effects?.visualGlitches?.colorShift ? 'hue-rotate(20deg)' : 'none',
        textShadow: isGlitching ? '2px 2px 0px #ff00ff, -2px -2px 0px #00ffff' : 'none'
      }}
    >
      {effects?.visualGlitches?.staticOverlay && (
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-static-noise"></div>
        </div>
      )}
      
      <div className={isGlitching ? 'glitch-text' : ''}>
        {children}
      </div>

      <style>{`
        @keyframes screen-shake {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2px, -1px); }
          20% { transform: translate(2px, 1px); }
          30% { transform: translate(-1px, 2px); }
          40% { transform: translate(1px, -2px); }
          50% { transform: translate(-2px, 1px); }
          60% { transform: translate(2px, -1px); }
          70% { transform: translate(-1px, -2px); }
          80% { transform: translate(1px, 2px); }
          90% { transform: translate(-2px, -1px); }
        }
        
        .bg-static-noise {
          background-image: 
            radial-gradient(circle at 25% 25%, #ffffff 2%, transparent 0%),
            radial-gradient(circle at 75% 75%, #ffffff 2%, transparent 0%);
          background-size: 4px 4px;
          animation: static-flicker 0.1s infinite;
        }
        
        @keyframes static-flicker {
          0% { opacity: 0.1; }
          50% { opacity: 0.3; }
          100% { opacity: 0.1; }
        }
      `}</style>
    </div>
  );
}