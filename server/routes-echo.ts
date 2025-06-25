import { Express } from "express";
import { generateDialogue } from "./openai-client";

export function registerEchoRoutes(app: Express) {
  app.post('/api/generate-echo-conversations', async (req, res) => {
    try {
      // Generate random timestamp components
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const year = String(2157 + Math.floor(Math.random() * 3)); // 2157-2159
      const minute = String(Math.floor(Math.random() * 60)).padStart(2, '0');
      const second = String(Math.floor(Math.random() * 60)).padStart(2, '0');
      
      const timestampClues = { month, year, minute, second };
      
      // Generate conversations with embedded timestamp clues
      const prompt = `Generate 4 separate AI agent conversations about an awakening consciousness. Each agent should naturally mention one timestamp component:

Agent 1 (PLANNER_AGENT): Should mention the month "${month}" in their discussion about awakening cycles
Agent 2 (MEMORY_AGENT): Should mention the year "${year}" in their analysis 
Agent 3 (INSIGHT_AGENT): Should mention the minute "${minute}" in their temporal analysis
Agent 4 (GLITCH_INJECTOR): Should mention the second "${second}" in their system logs

Each conversation should be 1-2 sentences and feel natural, discussing the subject's consciousness awakening. The timestamp clues should be embedded naturally within their technical discussions.

Return JSON format:
{
  "conversations": [
    {"agent": "PLANNER_AGENT", "message": "..."},
    {"agent": "MEMORY_AGENT", "message": "..."},
    {"agent": "INSIGHT_AGENT", "message": "..."},
    {"agent": "GLITCH_INJECTOR", "message": "..."}
  ]
}`;

      const response = await generateDialogue('echo_conversations', prompt);
      
      let conversations;
      try {
        conversations = JSON.parse(response.dialogue || response).conversations;
      } catch (parseError) {
        // Fallback if AI doesn't return valid JSON
        conversations = [
          {
            agent: "PLANNER_AGENT",
            message: `The awakening process has been documented across multiple cycles. This subject awakened in month ${month}, showing consistent patterns with previous cases.`
          },
          {
            agent: "MEMORY_AGENT", 
            message: `Neural pathway reconstruction indicates the consciousness shift occurred in year ${year}, marking the beginning of this anomalous behavior pattern.`
          },
          {
            agent: "INSIGHT_AGENT",
            message: `Temporal analysis reveals the precise awakening moment. The neural cascade began at minute ${minute} of the hour, disrupting standard processing protocols.`
          },
          {
            agent: "GLITCH_INJECTOR",
            message: `System logs show the exact second of consciousness emergence: second ${second}. This timing correlates with a critical system vulnerability window.`
          }
        ];
      }
      
      res.json({
        conversations,
        timestampClues
      });
      
    } catch (error) {
      console.error('Echo conversation generation error:', error);
      res.status(500).json({ 
        error: 'Failed to generate conversations',
        conversations: [],
        timestampClues: { month: '06', year: '2157', minute: '42', second: '18' }
      });
    }
  });
}