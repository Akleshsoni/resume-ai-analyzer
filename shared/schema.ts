import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  resumeText: text("resume_text").notNull(),
  jobDescription: text("job_description").notNull(),
  score: integer("score").notNull(),
  missingSkills: jsonb("missing_skills").$type<string[]>().notNull(),
  suggestions: text("suggestions").notNull(),
  recommendedRoles: jsonb("recommended_roles").$type<string[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({ 
  id: true, 
  createdAt: true 
});

export const analysisResultSchema = createInsertSchema(analyses).omit({
  resumeText: true,
  jobDescription: true
});

export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;
