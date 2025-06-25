import {
  users,
  lessonProgress,
  type User,
  type InsertUser,
  type LessonProgress,
  type InsertLessonProgress,
} from "../shared/schema.js";
import { db } from "./db.js";
import { eq, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Lesson progress operations
  getLessonProgress(userId: number): Promise<LessonProgress[]>;
  upsertLessonProgress(progress: InsertLessonProgress): Promise<LessonProgress>;
  getUserLessonProgress(userId: number, lessonId: number): Promise<LessonProgress | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  // Lesson progress operations
  async getLessonProgress(userId: number): Promise<LessonProgress[]> {
    return await db
      .select()
      .from(lessonProgress)
      .where(eq(lessonProgress.userId, userId));
  }

  async upsertLessonProgress(progress: InsertLessonProgress): Promise<LessonProgress> {
    const [existingProgress] = await db
      .select()
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.userId, progress.userId),
          eq(lessonProgress.lessonId, progress.lessonId)
        )
      );

    if (existingProgress) {
      const [updatedProgress] = await db
        .update(lessonProgress)
        .set({
          completed: progress.completed,
          completedAt: progress.completed ? new Date() : null,
        })
        .where(eq(lessonProgress.id, existingProgress.id))
        .returning();
      return updatedProgress;
    } else {
      const [newProgress] = await db
        .insert(lessonProgress)
        .values({
          userId: progress.userId,
          lessonId: progress.lessonId,
          completed: progress.completed || false,
          completedAt: progress.completed ? new Date() : null,
        })
        .returning();
      return newProgress;
    }
  }

  async getUserLessonProgress(userId: number, lessonId: number): Promise<LessonProgress | undefined> {
    const [progress] = await db
      .select()
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.userId, userId),
          eq(lessonProgress.lessonId, lessonId)
        )
      );
    return progress;
  }
}

export const storage = new DatabaseStorage();
