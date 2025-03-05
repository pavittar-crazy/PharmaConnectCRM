import {
  users, leads, manufacturers, orders, tasks,
  type User, type InsertUser,
  type Lead, type InsertLead,
  type Manufacturer, type InsertManufacturer,
  type Order, type InsertOrder,
  type Task, type InsertTask
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Leads
  getLead(id: number): Promise<Lead | undefined>;
  getLeads(): Promise<Lead[]>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, lead: Partial<InsertLead>): Promise<Lead>;
  
  // Manufacturers
  getManufacturer(id: number): Promise<Manufacturer | undefined>;
  getManufacturers(): Promise<Manufacturer[]>;
  createManufacturer(manufacturer: InsertManufacturer): Promise<Manufacturer>;
  
  // Orders
  getOrder(id: number): Promise<Order | undefined>;
  getOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order>;
  
  // Tasks
  getTask(id: number): Promise<Task | undefined>;
  getTasks(): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private leads: Map<number, Lead>;
  private manufacturers: Map<number, Manufacturer>;
  private orders: Map<number, Order>;
  private tasks: Map<number, Task>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.leads = new Map();
    this.manufacturers = new Map();
    this.orders = new Map();
    this.tasks = new Map();
    this.currentId = 1;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Leads
  async getLead(id: number): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = this.currentId++;
    const lead = { ...insertLead, id };
    this.leads.set(id, lead);
    return lead;
  }

  async updateLead(id: number, lead: Partial<InsertLead>): Promise<Lead> {
    const existingLead = this.leads.get(id);
    if (!existingLead) throw new Error("Lead not found");
    const updatedLead = { ...existingLead, ...lead };
    this.leads.set(id, updatedLead);
    return updatedLead;
  }

  // Manufacturers
  async getManufacturer(id: number): Promise<Manufacturer | undefined> {
    return this.manufacturers.get(id);
  }

  async getManufacturers(): Promise<Manufacturer[]> {
    return Array.from(this.manufacturers.values());
  }

  async createManufacturer(insertManufacturer: InsertManufacturer): Promise<Manufacturer> {
    const id = this.currentId++;
    const manufacturer = { ...insertManufacturer, id };
    this.manufacturers.set(id, manufacturer);
    return manufacturer;
  }

  // Orders
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentId++;
    const order = { ...insertOrder, id };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order> {
    const existingOrder = this.orders.get(id);
    if (!existingOrder) throw new Error("Order not found");
    const updatedOrder = { ...existingOrder, ...order };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Tasks
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentId++;
    const task = { ...insertTask, id };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<Task> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) throw new Error("Task not found");
    const updatedTask = { ...existingTask, ...task };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }
}

export const storage = new MemStorage();
