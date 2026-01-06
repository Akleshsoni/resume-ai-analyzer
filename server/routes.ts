import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import multer from "multer";
import * as pdfParseLib from "pdf-parse";
import { OpenAI } from "openai";

const pdfParse = (pdfParseLib as any).default || pdfParseLib;

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.analyze.path, upload.single('resume'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No resume file uploaded" });
      }

      const jobDescription = req.body.jobDescription;
      if (!jobDescription) {
        return res.status(400).json({ message: "Job description is required" });
      }

      // 1. Extract text from PDF
      let resumeText = "";
      try {
        const data = await pdfParse(req.file.buffer);
        resumeText = data.text;
      } catch (e) {
        return res.status(500).json({ message: "Failed to parse PDF" });
      }

      // 2. Analyze with OpenAI
      const openai = new OpenAI({ 
        apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL
      });

      const prompt = `
        You are an expert Resume Analyzer and ATS (Applicant Tracking System).
        Analyze the following resume against the provided job description.
        
        Resume Content:
        ${resumeText.slice(0, 4000)}... (truncated if too long)

        Job Description:
        ${jobDescription.slice(0, 2000)}... (truncated if too long)

        Provide the output in the following JSON format ONLY:
        {
          "score": (integer 0-100),
          "missingSkills": ["skill1", "skill2", ...],
          "suggestions": "Detailed suggestions for improvement...",
          "recommendedRoles": ["role1", "role2", ...]
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No response from AI");
      }

      const result = JSON.parse(content);

      // 3. Store result
      const analysis = await storage.createAnalysis({
        resumeText,
        jobDescription,
        score: result.score,
        missingSkills: result.missingSkills,
        suggestions: result.suggestions,
        recommendedRoles: result.recommendedRoles,
      });

      res.json(analysis);

    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: err.message || "Internal server error" });
    }
  });

  return httpServer;
}
