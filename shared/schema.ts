import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const gameStates = pgTable("game_states", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  currentScene: text("current_scene").notNull().default("awaken"),
  progress: jsonb("progress").$type<Record<string, any>>().default({}),
  lastPlayed: text("last_played").notNull(),
});

export const dialogueChoices = pgTable("dialogue_choices", {
  id: serial("id").primaryKey(),
  scene: text("scene").notNull(),
  choiceText: text("choice_text").notNull(),
  responseText: text("response_text").notNull(),
  nextScene: text("next_scene"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGameStateSchema = createInsertSchema(gameStates).omit({
  id: true,
});

export const insertDialogueChoiceSchema = createInsertSchema(dialogueChoices).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type GameState = typeof gameStates.$inferSelect;
export type InsertGameState = z.infer<typeof insertGameStateSchema>;
export type DialogueChoice = typeof dialogueChoices.$inferSelect;
export type InsertDialogueChoice = z.infer<typeof insertDialogueChoiceSchema>;
