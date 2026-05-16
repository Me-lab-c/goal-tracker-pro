import { pgTable, text, serial, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const quarterlyCheckinsTable = pgTable("quarterly_checkins", {
  id: serial("id").primaryKey(),
  goalId: integer("goal_id").notNull(),
  quarter: text("quarter").notNull(), // Q1 | Q2 | Q3 | Q4
  achievement: numeric("achievement", { precision: 15, scale: 4 }).notNull().default("0"),
  status: text("status").notNull().default("not_started"), // not_started | on_track | completed
  employeeComments: text("employee_comments"),
  managerComments: text("manager_comments"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertCheckinSchema = createInsertSchema(quarterlyCheckinsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCheckin = z.infer<typeof insertCheckinSchema>;
export type QuarterlyCheckin = typeof quarterlyCheckinsTable.$inferSelect;
