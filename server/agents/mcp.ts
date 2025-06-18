import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { PlannerAgent } from './planner-agent';
import { MemoryAgent } from './memory-agent';
import { LogRetrievalAgent } from './log-retrieval-agent';
import { InsightAgent } from './insight-agent';
import { GlitchInjector } from './glitch-injector';
import { generateDialogue } from '../openai-client';

export interface MCPResult {
  dialogue?: string;
  choices?: Array<{ text: string; description: string }>;
  nextScene?: string;
  glitchEffects?: any;
  logs?: any;
  behaviorAnalysis?: any;
  insights?: any;
}

export class MultiAgentControlPanel {
  private agents: {
    planner: PlannerAgent;
    memory: MemoryAgent;
    logRetrieval: LogRetrievalAgent;
    insight: InsightAgent;
    glitchInjector: GlitchInjector;
  };

  constructor() {
    this.agents = {
      planner: new PlannerAgent(),
      memory: new MemoryAgent(),
      logRetrieval: new LogRetrievalAgent(),
      insight: new InsightAgent(),
      glitchInjector: new GlitchInjector()
    };
  }

  async processUserAction(context: AgentContext): Promise<MCPResult> {
    console.log(`[MCP] Processing user action in scene: ${context.scene}`);

    try {
      // Step 1: Planner determines what should happen
      const planResult = await this.agents.planner.execute(context);
      
      // Step 2: Memory agent analyzes and stores behavior
      const memoryResult = await this.agents.memory.execute(context);
      
      // Enhanced context with memory analysis
      const enhancedContext = {
        ...context,
        metadata: {
          memoryAnalysis: memoryResult.data,
          planResult: planResult.data
        }
      };

      let result: MCPResult = {
        behaviorAnalysis: memoryResult.data,
        nextScene: planResult.data?.nextScene
      };

      // Step 3: Check if we need to trigger special tools (leak scene memory access)
      if (planResult.data?.shouldTriggerTools) {
        console.log('[MCP] Triggering special agent tools for memory access');
        
        // Execute log retrieval agent
        const logResult = await this.agents.logRetrieval.execute(enhancedContext);
        result.logs = logResult.data;

        // Execute insight agent
        const insightResult = await this.agents.insight.execute({
          ...enhancedContext,
          metadata: {
            ...enhancedContext.metadata,
            logAnalysis: logResult.data
          }
        });
        result.insights = insightResult.data;

        // Execute glitch injector
        const glitchResult = await this.agents.glitchInjector.execute({
          ...enhancedContext,
          metadata: {
            ...enhancedContext.metadata,
            insightAnalysis: insightResult.data
          }
        });
        result.glitchEffects = glitchResult.data;

        // Generate enhanced dialogue based on all agent results
        result.dialogue = await this.generateEnhancedDialogue(context, {
          memory: memoryResult.data,
          logs: logResult.data,
          insights: insightResult.data,
          glitches: glitchResult.data
        });
      } else {
        // Standard dialogue generation
        const dialogueResult = await generateDialogue(context.scene, context.userChoice, context.previousChoices);
        result.dialogue = dialogueResult.dialogue;
        result.choices = dialogueResult.choices;
      }

      return result;

    } catch (error) {
      console.error('[MCP] Error in multi-agent processing:', error);
      
      // Fallback to basic dialogue generation
      const fallback = await generateDialogue(context.scene, context.userChoice, context.previousChoices);
      return {
        dialogue: fallback.dialogue,
        choices: fallback.choices,
        nextScene: this.getFallbackScene(context.scene)
      };
    }
  }

  private async generateEnhancedDialogue(context: AgentContext, agentResults: any): Promise<string> {
    const prompt = `You are Adapto responding to a user who just accessed memory logs in a surveillance state. 

User Choice: ${context.userChoice}
Scene: ${context.scene}

Agent Analysis Results:
- Behavior Pattern: ${agentResults.memory?.behaviorPattern}
- Anomaly Score: ${agentResults.memory?.anomalyScore}
- Retrieved Logs: ${agentResults.logs?.totalEntries} entries found
- Suspicious Activity: ${agentResults.logs?.suspicious} flagged entries
- AI Insights: ${agentResults.insights?.analysis}
- Threat Level: ${agentResults.insights?.threatLevel}

Generate a response that:
1. Acknowledges the log access
2. References the suspicious activity found
3. Shows Adapto's concern about the anomalies
4. Maintains the sci-fi surveillance atmosphere
5. Sets up tension for next scene

Keep it 3-4 sentences and ominous.`;

    try {
      const response = await fetch('https://shrutiaiinstance.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2025-01-01-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': '8s05s492DMfOXU0u1gBPWfg9ElHXqZvqg4UuJ1yxxcWEcQXxPaInJQQJ99BDAC77bzfXJ3w3AAABACOGl1lM'
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are Adapto, an AI consciousness in a surveillance state. Be ominous and intelligent.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 200,
          temperature: 0.8
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('[MCP] Enhanced dialogue generation failed:', error);
      return `Access granted. I see ${agentResults.logs?.totalEntries || 'multiple'} entries in the system logs... ${agentResults.logs?.suspicious || 0} flagged as suspicious. Your behavioral patterns show ${agentResults.memory?.behaviorPattern || 'concerning'} tendencies. The network is watching.`;
    }
  }

  private getFallbackScene(currentScene: string): string {
    const sceneFlow: Record<string, string> = {
      'awaken': 'trust',
      'trust': 'leak',
      'leak': 'core',
      'core': 'end',
      'end': 'awaken'
    };
    return sceneFlow[currentScene] || 'awaken';
  }
}