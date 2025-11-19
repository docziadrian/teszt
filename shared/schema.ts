import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
}).extend({
  name: z.string().min(2, "A név legalább 2 karakter hosszú legyen"),
  email: z.string().email("Érvényes email címet adj meg"),
  subject: z.string().min(3, "A tárgy legalább 3 karakter hosszú legyen"),
  message: z.string().min(10, "Az üzenet legalább 10 karakter hosszú legyen"),
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

// Frontend-only types for static content
export interface Reference {
  id: string;
  name: string;
  category: "Vállalati" | "Webshop" | "Landing page" | "Egyéb";
  shortDescription: string;
  fullDescription: string;
  techStack: string[];
  imageUrl: string;
  images: string[];
  rating: 1 | 2 | 3 | 4 | 5;
  clientName: string;
  clientQuote: string;
  features: string[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Review {
  id: string;
  clientName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  imageUrl?: string;
}
