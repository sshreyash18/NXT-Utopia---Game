export interface AgentContext {
  scene: string;
  userChoice?: string;
  previousChoices: string[];
  userId?: number;
  sessionId?: string;
  metadata?: Record<string, any>;
}

export interface AgentResult {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: Record<string, any>;
}

export abstract class BaseAgent {
  protected name: string;
  protected description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  abstract execute(context: AgentContext): Promise<AgentResult>;

  protected log(message: string, data?: any) {
    console.log(`[${this.name}] ${message}`, data || '');
  }

  protected error(message: string, error?: any) {
    console.error(`[${this.name}] ERROR: ${message}`, error || '');
  }
}