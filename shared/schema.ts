import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User/Company storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  companyName: varchar("company_name"),
  companyLogo: varchar("company_logo"),
  brandColor: varchar("brand_color").default('#F59E0B'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Questionnaires table
export const questionnaires = pgTable("questionnaires", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar("title").notNull(),
  description: text("description"),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertQuestionnaireSchema = createInsertSchema(questionnaires).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertQuestionnaire = z.infer<typeof insertQuestionnaireSchema>;
export type Questionnaire = typeof questionnaires.$inferSelect;

// Questions table
export const questions = pgTable("questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  questionnaireId: varchar("questionnaire_id").notNull().references(() => questionnaires.id, { onDelete: 'cascade' }),
  questionText: text("question_text").notNull(),
  questionType: varchar("question_type").notNull(), // 'multiple-choice', 'rating', 'text'
  options: text("options").array(), // For multiple choice options
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  createdAt: true,
});

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;

// Cheese products table
export const cheeseProducts = pgTable("cheese_products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar("name").notNull(),
  description: text("description"),
  imageUrl: varchar("image_url"),
  tags: text("tags").array(), // For matching with responses
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCheeseProductSchema = createInsertSchema(cheeseProducts).omit({
  id: true,
  createdAt: true,
});

export type InsertCheeseProduct = z.infer<typeof insertCheeseProductSchema>;
export type CheeseProduct = typeof cheeseProducts.$inferSelect;

// Responses table
export const responses = pgTable("responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  questionnaireId: varchar("questionnaire_id").notNull().references(() => questionnaires.id, { onDelete: 'cascade' }),
  customerEmail: varchar("customer_email"),
  answers: jsonb("answers").notNull(), // Store all answers as JSON
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertResponseSchema = createInsertSchema(responses).omit({
  id: true,
  createdAt: true,
}).extend({
  customerEmail: z.string().optional().nullable(),
});

export type InsertResponse = z.infer<typeof insertResponseSchema>;
export type Response = typeof responses.$inferSelect;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  questionnaires: many(questionnaires),
  cheeseProducts: many(cheeseProducts),
}));

export const questionnairesRelations = relations(questionnaires, ({ one, many }) => ({
  user: one(users, {
    fields: [questionnaires.userId],
    references: [users.id],
  }),
  questions: many(questions),
  responses: many(responses),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  questionnaire: one(questionnaires, {
    fields: [questions.questionnaireId],
    references: [questionnaires.id],
  }),
}));

export const cheeseProductsRelations = relations(cheeseProducts, ({ one }) => ({
  user: one(users, {
    fields: [cheeseProducts.userId],
    references: [users.id],
  }),
}));

export const responsesRelations = relations(responses, ({ one }) => ({
  questionnaire: one(questionnaires, {
    fields: [responses.questionnaireId],
    references: [questionnaires.id],
  }),
}));
