
import { DatabaseStorage, IStorage } from './storage';
import { sheetsService } from './sheets';
import {
  type User, type InsertUser,
  type Lead, type InsertLead,
  type Manufacturer, type InsertManufacturer,
  type Order, type InsertOrder,
  type Task, type InsertTask
} from "@shared/schema";

// This class implements the storage interface but syncs data with Google Sheets
export class HybridStorage implements IStorage {
  private dbStorage: DatabaseStorage;
  private useSheets: boolean;

  constructor(useSheets = true) {
    this.dbStorage = new DatabaseStorage();
    this.useSheets = useSheets;
  }

  // Users - we'll keep these in the database only for security
  async getUser(id: number): Promise<User | undefined> {
    return this.dbStorage.getUser(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.dbStorage.getUserByEmail(email);
  }

  async createUser(user: InsertUser): Promise<User> {
    return this.dbStorage.createUser(user);
  }

  // Leads
  async getLead(id: number): Promise<Lead | undefined> {
    if (this.useSheets) {
      const leads = await sheetsService.getLeads();
      return leads.find(lead => lead.id === id);
    }
    return this.dbStorage.getLead(id);
  }

  async getLeads(): Promise<Lead[]> {
    if (this.useSheets) {
      return sheetsService.getLeads();
    }
    return this.dbStorage.getLeads();
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    // First create in DB to get the ID
    const dbLead = await this.dbStorage.createLead(lead);
    
    // Then sync to sheets if enabled
    if (this.useSheets) {
      await sheetsService.saveLead(dbLead);
    }
    
    return dbLead;
  }

  async updateLead(id: number, lead: Partial<InsertLead>): Promise<Lead> {
    const dbLead = await this.dbStorage.updateLead(id, lead);
    
    if (this.useSheets) {
      await sheetsService.saveLead(dbLead);
    }
    
    return dbLead;
  }

  // Manufacturers
  async getManufacturer(id: number): Promise<Manufacturer | undefined> {
    if (this.useSheets) {
      const manufacturers = await sheetsService.getManufacturers();
      return manufacturers.find(m => m.id === id);
    }
    return this.dbStorage.getManufacturer(id);
  }

  async getManufacturers(): Promise<Manufacturer[]> {
    if (this.useSheets) {
      return sheetsService.getManufacturers();
    }
    return this.dbStorage.getManufacturers();
  }

  async createManufacturer(manufacturer: InsertManufacturer): Promise<Manufacturer> {
    const dbManufacturer = await this.dbStorage.createManufacturer(manufacturer);
    
    // Implementation for Google Sheets sync would go here
    
    return dbManufacturer;
  }

  // Orders
  async getOrder(id: number): Promise<Order | undefined> {
    if (this.useSheets) {
      const orders = await sheetsService.getOrders();
      return orders.find(order => order.id === id);
    }
    return this.dbStorage.getOrder(id);
  }

  async getOrders(): Promise<Order[]> {
    if (this.useSheets) {
      return sheetsService.getOrders();
    }
    return this.dbStorage.getOrders();
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const dbOrder = await this.dbStorage.createOrder(order);
    
    // Implementation for Google Sheets sync would go here
    
    return dbOrder;
  }

  async updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order> {
    const dbOrder = await this.dbStorage.updateOrder(id, order);
    
    // Implementation for Google Sheets sync would go here
    
    return dbOrder;
  }

  // Tasks
  async getTask(id: number): Promise<Task | undefined> {
    if (this.useSheets) {
      const tasks = await sheetsService.getTasks();
      return tasks.find(task => task.id === id);
    }
    return this.dbStorage.getTask(id);
  }

  async getTasks(): Promise<Task[]> {
    if (this.useSheets) {
      return sheetsService.getTasks();
    }
    return this.dbStorage.getTasks();
  }

  async createTask(task: InsertTask): Promise<Task> {
    const dbTask = await this.dbStorage.createTask(task);
    
    // Implementation for Google Sheets sync would go here
    
    return dbTask;
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<Task> {
    const dbTask = await this.dbStorage.updateTask(id, task);
    
    // Implementation for Google Sheets sync would go here
    
    return dbTask;
  }
}

// Usage toggle based on environment variable
const useGoogleSheets = process.env.USE_GOOGLE_SHEETS === 'true';
export const hybridStorage = new HybridStorage(useGoogleSheets);
