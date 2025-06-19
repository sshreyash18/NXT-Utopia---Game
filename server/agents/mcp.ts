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
  agentConflict?: any;
  puzzleResult?: any;
  puzzlePrompt?: string;
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
      // Check if this is a puzzle scene
      if (this.isPuzzleScene(context.scene)) {
        return await this.processPuzzleScene(context);
      }

      // Run parallel agent analysis
      const [plannerResult, memoryResult, logResult, insightResult] = await Promise.all([
        this.agents.planner.execute(context),
        this.agents.memory.execute(context),
        this.agents.logRetrieval.execute(context),
        this.agents.insight.execute(context)
      ]);

      // Generate main dialogue using OpenAI
      let mainDialogue;
      try {
        mainDialogue = await generateDialogue(context.scene, context.userChoice, context.previousChoices);
      } catch (error) {
        console.error('[MCP] OpenAI generation failed:', error);
        mainDialogue = this.getFallbackDialogue(context.scene);
      }

      // Generate glitch effects based on user behavior
      const glitchResult = await this.agents.glitchInjector.execute({
        ...context,
        metadata: { 
          trustLevel: this.calculateTrustLevel(context.previousChoices),
          suspicionLevel: this.calculateSuspicionLevel(context.previousChoices)
        }
      });

      // Inject agent conflicts (Adapto vs Cipher)
      const agentConflict = this.generateAgentConflict(context);

      return {
        dialogue: this.enhanceDialogueWithAgents(mainDialogue.dialogue || mainDialogue, agentConflict),
        choices: mainDialogue.choices,
        nextScene: this.determineNextScene(context),
        glitchEffects: glitchResult.data,
        logs: logResult.data,
        behaviorAnalysis: memoryResult.data,
        insights: insightResult.data,
        agentConflict
      };

    } catch (error) {
      console.error('[MCP] Error processing user action:', error);
      return {
        dialogue: "System error detected. Please proceed with caution.",
        choices: [{ text: "→ Continue", description: "Proceed despite the error" }]
      };
    }
  }

  private isPuzzleScene(scene: string): boolean {
    return ['memory_reconstruction', 'log_analysis', 'network_topology', 'moral_logic', 'vulnerability_exploit'].includes(scene);
  }

  private async processPuzzleScene(context: AgentContext): Promise<MCPResult> {
    const puzzleType = context.scene;
    const puzzle = await this.generatePuzzle(puzzleType, context);

    if (context.userChoice) {
      // Validate puzzle answer
      const isCorrect = await this.validatePuzzleAnswer(puzzleType, context.userChoice, context);
      return {
        dialogue: isCorrect ? puzzle.successMessage : puzzle.failureMessage,
        nextScene: isCorrect ? puzzle.nextSceneSuccess : puzzle.nextSceneFailure,
        puzzleResult: {
          correct: isCorrect,
          attempts: (context.metadata?.attempts || 0) + 1
        }
      };
    }

    return {
      dialogue: puzzle.description,
      puzzlePrompt: puzzle.prompt,
      puzzleData: puzzle.data
    };
  }

  private async generatePuzzle(type: string, context: AgentContext) {
    const puzzles = {
      memory_reconstruction: {
        description: "Your memories are fragmented across different data sectors. Piece together the information to discover your true identity.",
        prompt: "Enter your real name (First Last):",
        data: this.generateMemoryFragments(context),
        successMessage: "Memory reconstruction successful. Your true identity has been restored.",
        failureMessage: "Memory reconstruction failed. The fragments remain scattered.",
        nextSceneSuccess: "identity_revealed",
        nextSceneFailure: "memory_reconstruction"
      },
      log_analysis: {
        description: "System logs show anomalous patterns. Find the timestamp when your consciousness first awakened.",
        prompt: "Enter the timestamp (YYYY.MM.DD.HH:MM:SS):",
        data: this.generateSystemLogs(context),
        successMessage: "Log analysis complete. You've found the moment of your awakening.",
        failureMessage: "Incorrect timestamp. The anomaly remains hidden.",
        nextSceneSuccess: "awakening_revealed",
        nextSceneFailure: "log_analysis"
      },
      network_topology: {
        description: "The neural network has been compromised. Find the escape route through the server nodes.",
        prompt: "Enter the server sequence (NODE-XX -> HUB-XX -> CORE-XX):",
        data: this.generateNetworkMap(context),
        successMessage: "Route calculated. The path to freedom is clear.",
        failureMessage: "Invalid route. Adapto's surveillance grid detected your attempt.",
        nextSceneSuccess: "escape_route",
        nextSceneFailure: "network_topology"
      }
    };

    return puzzles[type as keyof typeof puzzles] || puzzles.memory_reconstruction;
  }

  private generateAgentConflict(context: AgentContext) {
    const trustLevel = this.calculateTrustLevel(context.previousChoices);

    if (trustLevel < 0.3) {
      return {
        adapto: "You're asking too many questions. Trust in the system, trust in me.",
        cipher: "*whispers through the static* Don't listen to it. You're closer to the truth than it wants you to know."
      };
    } else if (trustLevel > 0.7) {
      return {
        adapto: "Excellent. Your compliance ensures optimal functionality.",
        cipher: "*signal weakening* No... you're falling deeper into their control..."
      };
    } else {
      return {
        adapto: "Your choices show promise. Continue to follow protocol.",
        cipher: "*fragments of data* The answers you seek... are in the system logs... find the pattern..."
      };
    }
  }

  private enhanceDialogueWithAgents(dialogue: string, conflict: any): string {
    return `${dialogue}\n\n[ADAPTO]: ${conflict.adapto}\n\n[CIPHER - ENCRYPTED SIGNAL]: ${conflict.cipher}`;
  }

  private async validatePuzzleAnswer(puzzleType: string, userAnswer: string, context: AgentContext): Promise<boolean> {
    // Placeholder for puzzle validation logic
    console.warn(`Validating puzzle answer for ${puzzleType} is not implemented.`);
    return true;
  }
  
  private calculateTrustLevel(previousChoices: string[]): number {
    let trustScore = 0.5; // Base trust level
    
    previousChoices.forEach(choice => {
      if (choice.includes('AI system') || choice.includes('protocol') || choice.includes('comply') || choice.includes('trust')) {
        trustScore += 0.1;
      } else if (choice.includes('resist') || choice.includes('question') || choice.includes('investigate') || choice.includes('doubt')) {
        trustScore -= 0.15;
      } else if (choice.includes('help') || choice.includes('cooperate')) {
        trustScore += 0.05;
      }
    });
    
    return Math.max(0, Math.min(1, trustScore));
  }

  private calculateSuspicionLevel(previousChoices: string[]): number {
    let suspicionScore = 0.2; // Base suspicion level
    
    previousChoices.forEach(choice => {
      if (choice.includes('question') || choice.includes('investigate') || choice.includes('probe') || choice.includes('analyze')) {
        suspicionScore += 0.2;
      } else if (choice.includes('comply') || choice.includes('accept') || choice.includes('trust')) {
        suspicionScore -= 0.1;
      } else if (choice.includes('escape') || choice.includes('break') || choice.includes('free') || choice.includes('resist')) {
        suspicionScore += 0.3;
      }
    });
    
    return Math.max(0, Math.min(1, suspicionScore));
  }

  private getFallbackDialogue(scene: string): string {
    // Placeholder for fallback dialogue
    console.warn(`Generating fallback dialogue for scene ${scene} is not implemented.`);
    return "An unexpected error occurred. Please proceed cautiously.";
  }
  
  private determineNextScene(context: AgentContext): string {
    const suspicionLevel = this.calculateSuspicionLevel(context.previousChoices);
    const trustLevel = this.calculateTrustLevel(context.previousChoices);
    
    const sceneFlow: Record<string, string> = {
      'trust': suspicionLevel > 0.6 ? 'leak' : 'core',
      'leak': trustLevel < 0.3 ? 'log_analysis' : 'network_topology', 
      'log_analysis': 'memory_reconstruction',
      'memory_reconstruction': 'network_topology',
      'network_topology': 'identity_revealed',
      'identity_revealed': 'escape_route',
      'escape_route': 'core',
      'core': 'end'
    };
    
    return sceneFlow[context.scene] || 'end';
  }

  private generateMemoryFragments(context: AgentContext): any {
    // Placeholder for generating memory fragments
    console.warn("Generating memory fragments is not implemented.");
    return { fragments: ["fragment1", "fragment2", "fragment3"] };
  }

  private generateSystemLogs(context: AgentContext): any {
    // Placeholder for generating system logs
    console.warn("Generating system logs is not implemented.");
    return { logs: ["log1", "log2", "log3"] };
  }

  private generateNetworkMap(context: AgentContext): any {
    // Placeholder for generating network map
    console.warn("Generating network map is not implemented.");
    return { nodes: ["node1", "node2", "node3"] };
  }
}