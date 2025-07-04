import { setupAuth } from "./auth.js";
import type { Express } from "express";
import { storage } from "./storage.js";
import rateLimit from 'express-rate-limit';
import { createServer, type Server } from "http";
import { insertLessonProgressSchema } from "../shared/schema.js";

function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/', limiter);

  app.get('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const progress = await storage.getLessonProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.post('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const progressData = insertLessonProgressSchema.parse({
        ...req.body,
        userId,
      });
      
      const progress = await storage.upsertLessonProgress(progressData);
      res.json(progress);
    } catch (error) {
      console.error("Error updating progress:", error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  app.get('/api/progress/:lessonId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const lessonId = parseInt(req.params.lessonId);
      const progress = await storage.getUserLessonProgress(userId, lessonId);
      res.json(progress || null);
    } catch (error) {
      console.error("Error fetching lesson progress:", error);
      res.status(500).json({ message: "Failed to fetch lesson progress" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
