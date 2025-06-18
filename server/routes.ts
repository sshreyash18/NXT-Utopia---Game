import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameStateSchema, insertDialogueChoiceSchema } from "@shared/schema";
import { z } from "zod";
import { generateDialogue, generateFinalSummary } from "./openai-client";

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

  // AI Dialogue Generation endpoints
  app.post("/api/generate-dialogue/:scene", async (req, res) => {
    try {
      const scene = req.params.scene;
      const { userChoice, previousChoices } = req.body;
      
      const result = await generateDialogue(scene, userChoice, previousChoices);
      res.json(result);
    } catch (error) {
      console.error("AI dialogue generation error:", error);
      res.status(500).json({ error: "Failed to generate dialogue" });
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

  // Serve static assets
  app.use('/assets', (req, res, next) => {
    // In development, we'll serve placeholder responses for missing audio files
    if (req.path.endsWith('.mp3')) {
      res.status(404).json({ error: 'Audio file not found' });
      return;
    }
    next();
  });

  const httpServer = createServer(app);
  return httpServer;
}
