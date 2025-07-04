import { pgTable, text, timestamp, boolean, integer, jsonb, uuid, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Automations table
export const automations = pgTable('automations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 50 }).notNull(),
  triggerType: varchar('trigger_type', { length: 50 }).notNull(),
  triggerConfig: jsonb('trigger_config').notNull(),
  actionType: varchar('action_type', { length: 50 }).notNull(),
  actionConfig: jsonb('action_config').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('draft'),
  isActive: boolean('is_active').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastRun: timestamp('last_run'),
  nextRun: timestamp('next_run'),
  executionCount: integer('execution_count').notNull().default(0),
  successCount: integer('success_count').notNull().default(0),
  failureCount: integer('failure_count').notNull().default(0),
});

// Automation logs table
export const automationLogs = pgTable('automation_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  automationId: uuid('automation_id').notNull().references(() => automations.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 50 }).notNull(),
  startedAt: timestamp('started_at').notNull(),
  completedAt: timestamp('completed_at'),
  duration: integer('duration'), // in milliseconds
  errorMessage: text('error_message'),
  triggerData: jsonb('trigger_data'),
  actionResult: jsonb('action_result'),
  metadata: jsonb('metadata'),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  automations: many(automations),
  automationLogs: many(automationLogs),
}));

export const automationsRelations = relations(automations, ({ one, many }) => ({
  user: one(users, {
    fields: [automations.userId],
    references: [users.id],
  }),
  logs: many(automationLogs),
}));

export const automationLogsRelations = relations(automationLogs, ({ one }) => ({
  automation: one(automations, {
    fields: [automationLogs.automationId],
    references: [automations.id],
  }),
  user: one(users, {
    fields: [automationLogs.userId],
    references: [users.id],
  }),
})); 