import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  password: text("password").notNull(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contact: text("contact").notNull(),
  status: text("status").notNull(), // New, Contacted, Converted, Lost
  assignedTo: integer("assigned_to").references(() => users.id),
});

export const manufacturers = pgTable("manufacturers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contact: text("contact").notNull(),
  productionCapacity: integer("production_capacity"),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  buyerId: integer("buyer_id").references(() => users.id),
  manufacturerId: integer("manufacturer_id").references(() => manufacturers.id),
  productDetails: text("product_details").notNull(),
  status: text("status").notNull(), // Pending, Approved, In Production, Dispatched, Delivered
  createdAt: timestamp("created_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  assignedTo: integer("assigned_to").references(() => users.id),
  description: text("description").notNull(),
  status: text("status").notNull(), // Pending, In Progress, Completed
  dueDate: timestamp("due_date"),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  name: true,
  role: true,
  password: true,
});

export const insertLeadSchema = createInsertSchema(leads);
export const insertManufacturerSchema = createInsertSchema(manufacturers);
export const insertOrderSchema = createInsertSchema(orders);
export const insertTaskSchema = createInsertSchema(tasks);

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

export type Manufacturer = typeof manufacturers.$inferSelect;
export type InsertManufacturer = z.infer<typeof insertManufacturerSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
