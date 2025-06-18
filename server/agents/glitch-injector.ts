import { BaseAgent, AgentContext, AgentResult } from './base-agent';

export class GlitchInjector extends BaseAgent {
  constructor() {
    super('GlitchInjector', 'Inserts real-time glitches and errors based on agent behavioral scores');
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    this.log('Calculating glitch injection parameters', { scene: context.scene });

    try {
      // Get behavioral scores from context metadata
      const behaviorScore = context.metadata?.memoryAnalysis?.anomalyScore || 0;
      const threatLevel = context.metadata?.insightAnalysis?.threatLevel || 'low';
      
      // Generate glitch effects based on scores
      const glitchEffects = this.calculateGlitchEffects(behaviorScore, threatLevel);
      
      return {
        success: true,
        data: {
          textGlitches: glitchEffects.textEffects,
          visualGlitches: glitchEffects.visualEffects,
          audioGlitches: glitchEffects.audioEffects,
          intensity: glitchEffects.intensity,
          triggerConditions: glitchEffects.triggers
        }
      };
    } catch (error) {
      this.error('Glitch calculation failed', error);
      return {
        success: false,
        error: 'Failed to calculate glitch effects'
      };
    }
  }

  private calculateGlitchEffects(anomalyScore: number, threatLevel: string) {
    const intensity = this.calculateIntensity(anomalyScore, threatLevel);
    
    return {
      intensity,
      textEffects: {
        corruptionRate: Math.min(0.3, intensity * 0.1), // Max 30% text corruption
        glitchChars: ['█', '▓', '▒', '░', '◆', '◇', '●', '○'],
        replacementProbability: intensity * 0.05,
        duplicateLines: intensity > 0.6,
        scrambleWords: intensity > 0.8
      },
      visualEffects: {
        screenShake: intensity > 0.4,
        colorShift: intensity > 0.3,
        pixelDistortion: intensity > 0.5,
        flashingElements: intensity > 0.7,
        staticOverlay: intensity > 0.6
      },
      audioEffects: {
        volumeFluctuation: intensity > 0.3,
        staticBursts: intensity > 0.5,
        echoDistortion: intensity > 0.4,
        frequencyShift: intensity > 0.6
      },
      triggers: {
        onDialogueLoad: intensity > 0.2,
        onChoiceHover: intensity > 0.4,
        onSceneTransition: intensity > 0.3,
        randomInterval: intensity > 0.6 ? 3000 : 10000 // More frequent glitches for high intensity
      }
    };
  }

  private calculateIntensity(anomalyScore: number, threatLevel: string): number {
    let baseIntensity = anomalyScore / 100; // 0-1 scale
    
    // Adjust based on threat level
    const threatMultipliers = {
      low: 0.5,
      medium: 1.0,
      high: 1.5
    };
    
    const multiplier = threatMultipliers[threatLevel as keyof typeof threatMultipliers] || 1.0;
    
    return Math.min(1.0, baseIntensity * multiplier);
  }
}

export interface GlitchEffect {
  type: 'text' | 'visual' | 'audio';
  intensity: number;
  duration: number;
  trigger: string;
}