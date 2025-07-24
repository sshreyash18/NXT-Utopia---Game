import { users, gameStates, dialogueChoices, type User, type InsertUser, type GameState, type InsertGameState, type DialogueChoice, type InsertDialogueChoice } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getGameStateByUserId(userId: number): Promise<GameState | undefined>;
  createGameState(gameState: InsertGameState): Promise<GameState>;
  updateGameState(id: number, updates: Partial<InsertGameState>): Promise<GameState>;
  getDialogueChoicesByScene(scene: string): Promise<DialogueChoice[]>;
  createDialogueChoice(choice: InsertDialogueChoice): Promise<DialogueChoice>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private gameStates: Map<number, GameState>;
  private dialogueChoices: Map<string, DialogueChoice[]>;
  currentId: number;
  currentGameStateId: number;
  currentChoiceId: number;

  constructor() {
    this.users = new Map();
    this.gameStates = new Map();
    this.dialogueChoices = new Map();
    this.currentId = 1;
    this.currentGameStateId = 1;
    this.currentChoiceId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getGameStateByUserId(userId: number): Promise<GameState | undefined> {
    return Array.from(this.gameStates.values()).find(
      (gameState) => gameState.userId === userId
    );
  }

  async createGameState(insertGameState: InsertGameState): Promise<GameState> {
    const id = this.currentGameStateId++;
    const gameState: GameState = { 
      ...insertGameState, 
      id,
      userId: insertGameState.userId || null,
      currentScene: insertGameState.currentScene || "awaken",
      progress: insertGameState.progress || null
    };
    this.gameStates.set(id, gameState);
    return gameState;
  }

  async updateGameState(id: number, updates: Partial<InsertGameState>): Promise<GameState> {
    const existing = this.gameStates.get(id);
    if (!existing) {
      throw new Error("Game state not found");
    }
    const updated: GameState = { ...existing, ...updates };
    this.gameStates.set(id, updated);
    return updated;
  }

  async getDialogueChoicesByScene(scene: string): Promise<DialogueChoice[]> {
    return this.dialogueChoices.get(scene) || [];
  }

  async createDialogueChoice(insertChoice: InsertDialogueChoice): Promise<DialogueChoice> {
    const id = this.currentChoiceId++;
    const choice: DialogueChoice = { 
      ...insertChoice, 
      id,
      nextScene: insertChoice.nextScene || null
    };
    
    const sceneChoices = this.dialogueChoices.get(insertChoice.scene) || [];
    sceneChoices.push(choice);
    this.dialogueChoices.set(insertChoice.scene, sceneChoices);
    
    return choice;
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    if (!db) {
      throw new Error("Database not initialized. Set DATABASE_URL to use DatabaseStorage.");
    }
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getGameStateByUserId(userId: number): Promise<GameState | undefined> {
    const [gameState] = await db.select().from(gameStates).where(eq(gameStates.userId, userId));
    return gameState || undefined;
  }

  async createGameState(insertGameState: InsertGameState): Promise<GameState> {
    const [gameState] = await db
      .insert(gameStates)
      .values(insertGameState)
      .returning();
    return gameState;
  }

  async updateGameState(id: number, updates: Partial<InsertGameState>): Promise<GameState> {
    const [gameState] = await db
      .update(gameStates)
      .set(updates)
      .where(eq(gameStates.id, id))
      .returning();
    return gameState;
  }

  async getDialogueChoicesByScene(scene: string): Promise<DialogueChoice[]> {
    return await db.select().from(dialogueChoices).where(eq(dialogueChoices.scene, scene));
  }

  async createDialogueChoice(insertChoice: InsertDialogueChoice): Promise<DialogueChoice> {
    const [choice] = await db
      .insert(dialogueChoices)
      .values(insertChoice)
      .returning();
    return choice;
  }
}

export const storage = new MemStorage();
