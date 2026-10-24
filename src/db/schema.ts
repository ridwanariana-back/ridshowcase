import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  shortDescEn: text('short_desc_en').notNull(),
  shortDescId: text('short_desc_id').notNull(),
  longDescEn: text('long_desc_en').notNull(),
  longDescId: text('long_desc_id').notNull(),
  techStack: text('tech_stack').array().notNull(), // Disimpan sebagai Array string
  databaseUsed: varchar('database_used', { length: 255 }).notNull(),
  demoUrl: varchar('demo_url', { length: 255 }).notNull(),
  imageUrl: varchar('image_url', { length: 255 }).notNull(), // Path gambar, misal: /projects/app1.jpg
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;