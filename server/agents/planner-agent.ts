import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { generateDialogue } from '../openai-client';

export class PlannerAgent extends BaseAgent {
  constructor() {
    super('PlannerAgent', 'Determines what should happen next based on user choices and game state');
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    this.log('Planning next action', { scene: context.scene, choice: context.userChoice });

    try {
      // Analyze user choice and determine next steps
      const plan = await this.generatePlan(context);
      
      return {
        success: true,
        data: {
          nextScene: plan.nextScene,
          shouldTriggerTools: plan.shouldTriggerTools,
          priority: plan.priority,
          reasoning: plan.reasoning
        }
      };
    } catch (error) {
      this.error('Failed to generate plan', error);
      return {
        success: false,
        error: 'Planning failed',
        data: { fallbackScene: this.getFallbackScene(context.scene) }
      };
    }
  }

  private async generatePlan(context: AgentContext) {
    const sceneFlow: Record<string, string> = {
      'awaken': 'trust',
      'trust': 'leak', 
      'leak': 'core',
      'core': 'end'
    };

    // Special logic for leak scene - trigger memory access tools
    const shouldTriggerTools = context.scene === 'leak' && 
      context.userChoice?.includes('memory') || 
      context.userChoice?.includes('access') ||
      context.userChoice?.includes('logs');

    return {
      nextScene: sceneFlow[context.scene] || 'awaken',
      shouldTriggerTools,
      priority: shouldTriggerTools ? 'high' : 'normal',
      reasoning: shouldTriggerTools 
        ? 'User requested memory access - triggering LogRetrievalAgent and InsightAgent'
        : 'Standard scene progression'
    };
  }

  private getFallbackScene(currentScene: string): string {
    const fallbacks: Record<string, string> = {
      'awaken': 'trust',
      'trust': 'leak',
      'leak': 'core',
      'core': 'end',
      'end': 'awaken'
    };
    return fallbacks[currentScene] || 'awaken';
  }
}