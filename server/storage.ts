import {
  users,
  questionnaires,
  questions,
  cheeseProducts,
  responses,
  type User,
  type UpsertUser,
  type Questionnaire,
  type InsertQuestionnaire,
  type Question,
  type InsertQuestion,
  type CheeseProduct,
  type InsertCheeseProduct,
  type Response,
  type InsertResponse,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Questionnaire operations
  getQuestionnaires(userId: string): Promise<Questionnaire[]>;
  getQuestionnaire(id: string): Promise<Questionnaire | undefined>;
  getPublicQuestionnaire(id: string): Promise<Questionnaire | undefined>;
  createQuestionnaire(questionnaire: InsertQuestionnaire): Promise<Questionnaire>;
  updateQuestionnaire(id: string, data: Partial<Questionnaire>): Promise<Questionnaire>;
  deleteQuestionnaire(id: string): Promise<void>;

  // Question operations
  getQuestions(questionnaireId: string): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  deleteQuestion(id: string): Promise<void>;

  // Cheese product operations
  getProducts(userId: string): Promise<CheeseProduct[]>;
  createProduct(product: InsertCheeseProduct): Promise<CheeseProduct>;
  deleteProduct(id: string): Promise<void>;

  // Response operations
  getResponses(userId: string): Promise<Response[]>;
  getQuestionnaireResponses(questionnaireId: string): Promise<Response[]>;
  createResponse(response: InsertResponse): Promise<Response>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Questionnaire operations
  async getQuestionnaires(userId: string): Promise<Questionnaire[]> {
    return await db
      .select()
      .from(questionnaires)
      .where(eq(questionnaires.userId, userId))
      .orderBy(desc(questionnaires.createdAt));
  }

  async getQuestionnaire(id: string): Promise<Questionnaire | undefined> {
    const [questionnaire] = await db
      .select()
      .from(questionnaires)
      .where(eq(questionnaires.id, id));
    return questionnaire || undefined;
  }

  async getPublicQuestionnaire(id: string): Promise<Questionnaire | undefined> {
    const [questionnaire] = await db
      .select()
      .from(questionnaires)
      .where(eq(questionnaires.id, id));
    return questionnaire || undefined;
  }

  async createQuestionnaire(
    questionnaireData: InsertQuestionnaire
  ): Promise<Questionnaire> {
    const [questionnaire] = await db
      .insert(questionnaires)
      .values(questionnaireData)
      .returning();
    return questionnaire;
  }

  async updateQuestionnaire(
    id: string,
    data: Partial<Questionnaire>
  ): Promise<Questionnaire> {
    const [questionnaire] = await db
      .update(questionnaires)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(questionnaires.id, id))
      .returning();
    return questionnaire;
  }

  async deleteQuestionnaire(id: string): Promise<void> {
    await db.delete(questionnaires).where(eq(questionnaires.id, id));
  }

  // Question operations
  async getQuestions(questionnaireId: string): Promise<Question[]> {
    return await db
      .select()
      .from(questions)
      .where(eq(questions.questionnaireId, questionnaireId))
      .orderBy(questions.order);
  }

  async createQuestion(questionData: InsertQuestion): Promise<Question> {
    const [question] = await db
      .insert(questions)
      .values(questionData)
      .returning();
    return question;
  }

  async deleteQuestion(id: string): Promise<void> {
    await db.delete(questions).where(eq(questions.id, id));
  }

  // Cheese product operations
  async getProducts(userId: string): Promise<CheeseProduct[]> {
    return await db
      .select()
      .from(cheeseProducts)
      .where(eq(cheeseProducts.userId, userId))
      .orderBy(desc(cheeseProducts.createdAt));
  }

  async createProduct(productData: InsertCheeseProduct): Promise<CheeseProduct> {
    const [product] = await db
      .insert(cheeseProducts)
      .values(productData)
      .returning();
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(cheeseProducts).where(eq(cheeseProducts.id, id));
  }

  // Response operations
  async getResponses(userId: string): Promise<Response[]> {
    // Get all responses for questionnaires owned by this user
    const userQuestionnaires = await this.getQuestionnaires(userId);
    const questionnaireIds = userQuestionnaires.map((q) => q.id);

    if (questionnaireIds.length === 0) {
      return [];
    }

    return await db
      .select()
      .from(responses)
      .where(eq(responses.questionnaireId, questionnaireIds[0]))
      .orderBy(desc(responses.createdAt));
  }

  async getQuestionnaireResponses(questionnaireId: string): Promise<Response[]> {
    return await db
      .select()
      .from(responses)
      .where(eq(responses.questionnaireId, questionnaireId))
      .orderBy(desc(responses.createdAt));
  }

  async createResponse(responseData: InsertResponse): Promise<Response> {
    const [response] = await db
      .insert(responses)
      .values(responseData)
      .returning();
    return response;
  }
}

export const storage = new DatabaseStorage();
