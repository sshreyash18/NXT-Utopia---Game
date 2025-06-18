import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { storage } from '../storage';
import { db } from '../db';
import { gameStates } from '@shared/schema';
import { eq } from 'drizzle-orm';

export class MemoryAgent extends BaseAgent {
  constructor() {
    super('MemoryAgent', 'Stores decisions and detects behavioral anomalies in player patterns');
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    this.log('Analyzing player behavior', { 
      scene: context.scene, 
      choiceCount: context.previousChoices.length 
    });

    try {
      // Store the current decision
      await this.storeDecision(context);
      
      // Analyze behavioral patterns
      const analysis = await this.analyzePlayerBehavior(context);
      
      return {
        success: true,
        data: {
          anomalyScore: analysis.anomalyScore,
          behaviorPattern: analysis.pattern,
          riskLevel: analysis.riskLevel,
          playerProfile: analysis.profile
        },
        metadata: {
          decisionsStored: context.previousChoices.length,
          analysisTimestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      this.error('Memory analysis failed', error);
      return {
        success: false,
        error: 'Failed to analyze player behavior'
      };
    }
  }

  private async storeDecision(context: AgentContext) {
    const sessionId = context.sessionId || 'anonymous';
    
    // Create a behavior record in the database
    const behaviorData = {
      scene: context.scene,
      choice: context.userChoice || '',
      timestamp: new Date().toISOString(),
      sessionId,
      previousChoices: context.previousChoices
    };

    // Store in game state progress field as behavioral log
    if (context.userId) {
      try {
        const existingState = await storage.getGameStateByUserId(context.userId);
        
        if (existingState) {
          const updatedProgress = {
            ...existingState.progress,
            behaviorLog: [
              ...(existingState.progress?.behaviorLog || []),
              behaviorData
            ]
          };
          
          await storage.updateGameState(existingState.id, { progress: updatedProgress });
        }
      } catch (error) {
        this.error('Failed to store behavior data', error);
      }
    }
  }

  private async analyzePlayerBehavior(context: AgentContext) {
    const choices = context.previousChoices;
    
    // Analyze choice patterns
    const aggressiveChoices = choices.filter(choice => 
      choice.toLowerCase().includes('force') || 
      choice.toLowerCase().includes('attack') ||
      choice.toLowerCase().includes('destroy')
    ).length;

    const trustingChoices = choices.filter(choice => 
      choice.toLowerCase().includes('trust') || 
      choice.toLowerCase().includes('cooperate') ||
      choice.toLowerCase().includes('help')
    ).length;

    const suspiciousChoices = choices.filter(choice => 
      choice.toLowerCase().includes('investigate') || 
      choice.toLowerCase().includes('question') ||
      choice.toLowerCase().includes('doubt')
    ).length;

    // Calculate anomaly score (0-100)
    const totalChoices = choices.length || 1;
    const aggressiveRatio = aggressiveChoices / totalChoices;
    const suspiciousRatio = suspiciousChoices / totalChoices;
    
    const anomalyScore = Math.min(100, 
      (aggressiveRatio * 40) + 
      (suspiciousRatio * 30) + 
      (Math.random() * 20) // Add some randomness for realism
    );

    // Determine behavior pattern
    let pattern = 'balanced';
    if (aggressiveRatio > 0.6) pattern = 'aggressive';
    else if (trustingChoices / totalChoices > 0.6) pattern = 'trusting';
    else if (suspiciousRatio > 0.5) pattern = 'paranoid';

    // Risk assessment
    let riskLevel = 'low';
    if (anomalyScore > 70) riskLevel = 'high';
    else if (anomalyScore > 40) riskLevel = 'medium';

    return {
      anomalyScore: Math.round(anomalyScore),
      pattern,
      riskLevel,
      profile: {
        aggressiveChoices,
        trustingChoices,
        suspiciousChoices,
        totalChoices,
        dominantTrait: this.getDominantTrait(aggressiveRatio, trustingChoices / totalChoices, suspiciousRatio)
      }
    };
  }

  private getDominantTrait(aggressive: number, trusting: number, suspicious: number): string {
    const traits = { aggressive, trusting, suspicious };
    return Object.entries(traits).reduce((a, b) => traits[a[0]] > traits[b[0]] ? a : b)[0];
  }
}