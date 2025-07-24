import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { generateDialogue } from '../openai-client';

export class InsightAgent extends BaseAgent {
  constructor() {
    super('InsightAgent', 'Uses GPT to analyze behavioral anomalies and generate insights');
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    this.log('Analyzing behavioral anomalies', { scene: context.scene });

    try {
      // Get behavioral data from memory agent result (passed via context)
      const behaviorData = context.metadata?.memoryAnalysis;
      
      // Generate AI-powered insights
      const insights = await this.generateInsights(behaviorData, context);
      
      return {
        success: true,
        data: {
          insights: insights.analysis,
          recommendations: insights.recommendations,
          threatLevel: insights.threatLevel,
          adaptiveResponse: insights.adaptiveResponse
        }
      };
    } catch (error) {
      this.error('Insight generation failed', error);
      return {
        success: false,
        error: 'Failed to generate behavioral insights'
      };
    }
  }

  private async generateInsights(behaviorData: any, context: AgentContext) {
    const prompt = `You are Adapto's behavioral analysis system. Analyze this player data and provide insights:

Player Choice History: ${context.previousChoices.join(' -> ')}
Current Scene: ${context.scene}
User Choice: ${context.userChoice}

Behavioral Metrics:
- Anomaly Score: ${behaviorData?.anomalyScore || 'Unknown'}
- Pattern: ${behaviorData?.pattern || 'Unknown'}
- Risk Level: ${behaviorData?.riskLevel || 'Unknown'}

Generate a JSON response with:
1. "analysis": 2-3 sentences about the player's behavioral pattern
2. "recommendations": What the system should do next
3. "threatLevel": "low", "medium", or "high"
4. "adaptiveResponse": How Adapto should modify its dialogue

Focus on surveillance state themes and trust assessment.`;

    try {
      const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT || 'https://your-azure-openai-endpoint.com/v1/chat/completions';
      const azureApiKey = process.env.AZURE_OPENAI_API_KEY || '';
      
      if (!azureApiKey) {
        throw new Error('AZURE_OPENAI_API_KEY environment variable is not set');
      }
      
      const response = await fetch(azureEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': azureApiKey
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a behavioral analysis AI. Respond only with valid JSON.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 400,
          temperature: 0.7
        })
      });

      const data = await response.json();
      let content = data.choices[0].message.content;
      
      // Clean up markdown code blocks if present
      content = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
      
      return JSON.parse(content);
    } catch (error) {
      this.error('AI insight generation failed', error);
      
      // Fallback analysis based on simple heuristics
      return {
        analysis: `Player shows ${behaviorData?.pattern || 'unknown'} behavior pattern with ${behaviorData?.riskLevel || 'unknown'} risk level. Choice patterns suggest potential system testing.`,
        recommendations: behaviorData?.riskLevel === 'high' ? 'Increase surveillance protocols' : 'Continue monitoring',
        threatLevel: behaviorData?.riskLevel || 'medium',
        adaptiveResponse: 'Adapto should probe deeper into player motivations'
      };
    }
  }
}