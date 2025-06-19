import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameStateSchema, insertDialogueChoiceSchema } from "@shared/schema";
import { z } from "zod";
import { generateDialogue, generateFinalSummary, generateCipherWarning } from "./openai-client";
import { promises as fs } from 'fs';
import path from 'path';

export async function registerRoutes(app: Express): Promise<Server> {
  // Game state endpoints
  app.get("/api/game-state/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const gameState = await storage.getGameStateByUserId(userId);
      res.json(gameState);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch game state" });
    }
  });

  app.post("/api/game-state", async (req, res) => {
    try {
      const gameState = insertGameStateSchema.parse(req.body);
      const newGameState = await storage.createGameState(gameState);
      res.json(newGameState);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid game state data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create game state" });
      }
    }
  });

  app.put("/api/game-state/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertGameStateSchema.partial().parse(req.body);
      const updatedGameState = await storage.updateGameState(id, updates);
      res.json(updatedGameState);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid update data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update game state" });
      }
    }
  });

  // Dialogue choices endpoints
  app.get("/api/dialogue-choices/:scene", async (req, res) => {
    try {
      const scene = req.params.scene;
      const choices = await storage.getDialogueChoicesByScene(scene);
      res.json(choices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dialogue choices" });
    }
  });

  app.post("/api/dialogue-choices", async (req, res) => {
    try {
      const choice = insertDialogueChoiceSchema.parse(req.body);
      const newChoice = await storage.createDialogueChoice(choice);
      res.json(newChoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid choice data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create dialogue choice" });
      }
    }
  });

  // MCP Agent System endpoints
  app.post("/api/generate-dialogue/:scene", async (req, res) => {
    try {
      const scene = req.params.scene;
      const { userChoice, previousChoices, userId, sessionId } = req.body;
      
      // Use Multi-Agent Control Panel for enhanced processing
      const { MultiAgentControlPanel } = await import('./agents/mcp');
      const mcp = new MultiAgentControlPanel();
      
      const context = {
        scene,
        userChoice,
        previousChoices: previousChoices || [],
        userId: userId || 1,
        sessionId: sessionId || `session-${Date.now()}`
      };
      
      const result = await mcp.processUserAction(context);
      res.json(result);
    } catch (error) {
      console.error("MCP processing error:", error);
      res.status(500).json({ error: "Failed to process with agent system" });
    }
  });

  app.post("/api/generate-summary", async (req, res) => {
    try {
      const { choices } = req.body;
      
      if (!choices || !Array.isArray(choices)) {
        return res.status(400).json({ error: "Choices array is required" });
      }
      
      const summary = await generateFinalSummary(choices);
      res.json({ summary });
    } catch (error) {
      console.error("AI summary generation error:", error);
      res.status(500).json({ error: "Failed to generate summary" });
    }
  });

  app.post("/api/generate-cipher-warning", async (req, res) => {
    try {
      const warning = await generateCipherWarning();
      res.json({ warning });
    } catch (error) {
      console.error("Cipher warning generation error:", error);
      res.status(500).json({ error: "Failed to generate cipher warning" });
    }
  });

  app.get("/api/generate-puzzle/:puzzleNumber", async (req, res) => {
    try {
      const puzzleNumber = parseInt(req.params.puzzleNumber);
      const { generateGlitchPuzzle } = await import('./openai-client');
      const puzzle = await generateGlitchPuzzle(puzzleNumber);
      res.json(puzzle);
    } catch (error) {
      console.error('Failed to generate puzzle:', error);
      res.status(500).json({ error: "Failed to generate puzzle" });
    }
  });

  // Log file download endpoint
  app.get("/api/download/logs/:filename", async (req, res) => {
    try {
      const filename = req.params.filename;
      const filepath = path.join(process.cwd(), 'temp', filename);
      
      if (await fs.access(filepath).then(() => true).catch(() => false)) {
        res.download(filepath, filename, (err) => {
          if (err) {
            console.error('Download error:', err);
            res.status(500).json({ error: 'Download failed' });
          }
        });
      } else {
        res.status(404).json({ error: 'Log file not found' });
      }
    } catch (error) {
      console.error('Log download error:', error);
      res.status(500).json({ error: 'Failed to download logs' });
    }
  });

  // Serve static assets including audio files
  app.use('/assets', (req, res) => {
    const filepath = path.join(process.cwd(), 'attached_assets', req.path);
    res.sendFile(filepath, (err) => {
      if (err) {
        res.status(404).json({ error: 'Asset not found' });
      }
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
