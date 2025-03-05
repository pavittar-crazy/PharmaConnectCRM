import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertLeadSchema, insertOrderSchema, insertTaskSchema, insertManufacturerSchema } from "@shared/schema";
import { hashPassword, comparePasswords } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);

      if (!user || !(await comparePasswords(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      const { password: _, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const parseResult = insertUserSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid user data" });
      }

      const existingUser = await storage.getUserByEmail(req.body.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await hashPassword(req.body.password);
      const user = await storage.createUser({
        ...parseResult.data,
        password: hashedPassword
      });

      req.session.userId = user.id;
      const { password: _, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: "Error during logout" });
      }
      res.status(200).json({ message: "Logged out" });
    });
  });

  // Auth check middleware
  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Auth check error:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Leads routes
  app.get("/api/leads", async (req, res) => {
    const leads = await storage.getLeads();
    res.json(leads);
  });

  app.post("/api/leads", async (req, res) => {
    const parseResult = insertLeadSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid lead data" });
    }

    const lead = await storage.createLead(parseResult.data);
    res.json(lead);
  });

  app.patch("/api/leads/:id", async (req, res) => {
    const lead = await storage.updateLead(parseInt(req.params.id), req.body);
    res.json(lead);
  });

  // Orders routes
  app.get("/api/orders", async (req, res) => {
    const orders = await storage.getOrders();
    res.json(orders);
  });

  app.post("/api/orders", async (req, res) => {
    const parseResult = insertOrderSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const order = await storage.createOrder(parseResult.data);
    res.json(order);
  });

  app.patch("/api/orders/:id", async (req, res) => {
    const order = await storage.updateOrder(parseInt(req.params.id), req.body);
    res.json(order);
  });

  // Tasks routes
  app.get("/api/tasks", async (req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.post("/api/tasks", async (req, res) => {
    const parseResult = insertTaskSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid task data" });
    }

    const task = await storage.createTask(parseResult.data);
    res.json(task);
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    const task = await storage.updateTask(parseInt(req.params.id), req.body);
    res.json(task);
  });

  // Manufacturers routes
  app.get("/api/manufacturers", async (req, res) => {
    const manufacturers = await storage.getManufacturers();
    res.json(manufacturers);
  });

  app.post("/api/manufacturers", async (req, res) => {
    const parseResult = insertManufacturerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid manufacturer data" });
    }

    const manufacturer = await storage.createManufacturer(parseResult.data);
    res.json(manufacturer);
  });

  const httpServer = createServer(app);
  return httpServer;
}