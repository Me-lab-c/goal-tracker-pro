import { pgTable, text, serial, integer, numeric, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const goalsTable = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  cycleId: integer("cycle_id"),
  title: text("title").notNull(),
  description: text("description"),
  thrustArea: text("thrust_area"),
  uom: text("uom"),
  target: numeric("target", { precision: 15, scale: 4 }),
  achievement: numeric("achievement", { precision: 15, scale: 4 }),
  weightage: numeric("weightage", { precision: 5, scale: 2 }).notNull().default("0"),
  progressType: text("progress_type").notNull().default("min"), // min | max | timeline | zero
  deadline: text("deadline"),
  status: text("status").notNull().default("not_started"), // not_started | on_track | completed
  approvalStatus: text("approval_status").notNull().default("draft"), // draft | submitted | approved | rejected
  locked: boolean("locked").notNull().default(false),
  isShared: boolean("is_shared").notNull().default(false),
  managerComment: text("manager_comment"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertGoalSchema = createInsertSchema(goalsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goalsTable.$inferSelect;
