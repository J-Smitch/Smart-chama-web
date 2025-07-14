import { pgTable, text, serial, integer, boolean, timestamp, decimal, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // user or admin
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chamas = pgTable("chamas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  contributionAmount: decimal("contribution_amount", { precision: 10, scale: 2 }).notNull(),
  meetingSchedule: text("meeting_schedule"),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: integer("created_by").references(() => users.id),
});

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  chamaId: integer("chama_id").references(() => chamas.id),
  joinedAt: timestamp("joined_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

export const contributions = pgTable("contributions", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").references(() => members.id),
  chamaId: integer("chama_id").references(() => chamas.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  contributionDate: timestamp("contribution_date").defaultNow(),
  status: text("status").notNull().default("completed"), // completed, pending, failed
});

export const payouts = pgTable("payouts", {
  id: serial("id").primaryKey(),
  chamaId: integer("chama_id").references(() => chamas.id),
  memberId: integer("member_id").references(() => members.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  payoutDate: timestamp("payout_date").notNull(),
  status: text("status").notNull().default("scheduled"), // scheduled, completed, cancelled
  notes: text("notes"),
});

export const penalties = pgTable("penalties", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").references(() => members.id),
  chamaId: integer("chama_id").references(() => chamas.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  reason: text("reason").notNull(),
  penaltyDate: timestamp("penalty_date").defaultNow(),
  status: text("status").notNull().default("pending"), // pending, paid, waived
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("info"), // info, warning, error, success
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertChamaSchema = createInsertSchema(chamas).omit({ id: true, createdAt: true });
export const insertMemberSchema = createInsertSchema(members).omit({ id: true, joinedAt: true });
export const insertContributionSchema = createInsertSchema(contributions).omit({ id: true, contributionDate: true });
export const insertPayoutSchema = createInsertSchema(payouts).omit({ id: true });
export const insertPenaltySchema = createInsertSchema(penalties).omit({ id: true, penaltyDate: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });

// Login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  role: z.enum(["user", "admin"]).optional(),
});

// Types
export type User = typeof users.$inferSelect;
export type Chama = typeof chamas.$inferSelect;
export type Member = typeof members.$inferSelect;
export type Contribution = typeof contributions.$inferSelect;
export type Payout = typeof payouts.$inferSelect;
export type Penalty = typeof penalties.$inferSelect;
export type Notification = typeof notifications.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertChama = z.infer<typeof insertChamaSchema>;
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type InsertContribution = z.infer<typeof insertContributionSchema>;
export type InsertPayout = z.infer<typeof insertPayoutSchema>;
export type InsertPenalty = z.infer<typeof insertPenaltySchema>;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type LoginData = z.infer<typeof loginSchema>;
