import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const goalCyclesTable = pgTable("goal_cycles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  year: integer("year").notNull(),
  isActive: boolean("is_active").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertGoalCycleSchema = createInsertSchema(goalCyclesTable).omit({ id: true, createdAt: true });
export type InsertGoalCycle = z.infer<typeof insertGoalCycleSchema>;
export type GoalCycle = typeof goalCyclesTable.$inferSelect;
