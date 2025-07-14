import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertChamaSchema, 
  insertMemberSchema, 
  insertContributionSchema, 
  insertPayoutSchema, 
  insertPenaltySchema, 
  insertNotificationSchema, 
  loginSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password, role } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      if (role && user.role !== role) {
        return res.status(401).json({ message: "Invalid role" });
      }
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      const user = await storage.createUser(userData);
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Chamas routes
  app.get("/api/chamas", async (req, res) => {
    try {
      const chamas = await storage.getAllChamas();
      res.json(chamas);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chamas" });
    }
  });

  app.get("/api/chamas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const chama = await storage.getChamaById(id);
      if (!chama) {
        return res.status(404).json({ message: "Chama not found" });
      }
      res.json(chama);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chama" });
    }
  });

  app.post("/api/chamas", async (req, res) => {
    try {
      const chamaData = insertChamaSchema.parse(req.body);
      const chama = await storage.createChama(chamaData);
      res.status(201).json(chama);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.put("/api/chamas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertChamaSchema.partial().parse(req.body);
      const chama = await storage.updateChama(id, updateData);
      if (!chama) {
        return res.status(404).json({ message: "Chama not found" });
      }
      res.json(chama);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.delete("/api/chamas/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteChama(id);
      if (!success) {
        return res.status(404).json({ message: "Chama not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete chama" });
    }
  });

  // Members routes
  app.get("/api/members", async (req, res) => {
    try {
      const members = await storage.getAllMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch members" });
    }
  });

  app.get("/api/chamas/:id/members", async (req, res) => {
    try {
      const chamaId = parseInt(req.params.id);
      const members = await storage.getMembersByChama(chamaId);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch members" });
    }
  });

  app.post("/api/members", async (req, res) => {
    try {
      const memberData = insertMemberSchema.parse(req.body);
      const member = await storage.createMember(memberData);
      res.status(201).json(member);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.put("/api/members/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertMemberSchema.partial().parse(req.body);
      const member = await storage.updateMember(id, updateData);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      res.json(member);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.delete("/api/members/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteMember(id);
      if (!success) {
        return res.status(404).json({ message: "Member not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete member" });
    }
  });

  // Contributions routes
  app.get("/api/contributions", async (req, res) => {
    try {
      const contributions = await storage.getAllContributions();
      res.json(contributions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contributions" });
    }
  });

  app.post("/api/contributions", async (req, res) => {
    try {
      const contributionData = insertContributionSchema.parse(req.body);
      const contribution = await storage.createContribution(contributionData);
      res.status(201).json(contribution);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.put("/api/contributions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertContributionSchema.partial().parse(req.body);
      const contribution = await storage.updateContribution(id, updateData);
      if (!contribution) {
        return res.status(404).json({ message: "Contribution not found" });
      }
      res.json(contribution);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.delete("/api/contributions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteContribution(id);
      if (!success) {
        return res.status(404).json({ message: "Contribution not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete contribution" });
    }
  });

  // Payouts routes
  app.get("/api/payouts", async (req, res) => {
    try {
      const payouts = await storage.getAllPayouts();
      res.json(payouts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payouts" });
    }
  });

  app.post("/api/payouts", async (req, res) => {
    try {
      const payoutData = insertPayoutSchema.parse(req.body);
      const payout = await storage.createPayout(payoutData);
      res.status(201).json(payout);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.put("/api/payouts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertPayoutSchema.partial().parse(req.body);
      const payout = await storage.updatePayout(id, updateData);
      if (!payout) {
        return res.status(404).json({ message: "Payout not found" });
      }
      res.json(payout);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.delete("/api/payouts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePayout(id);
      if (!success) {
        return res.status(404).json({ message: "Payout not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete payout" });
    }
  });

  // Penalties routes
  app.get("/api/penalties", async (req, res) => {
    try {
      const penalties = await storage.getAllPenalties();
      res.json(penalties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch penalties" });
    }
  });

  app.post("/api/penalties", async (req, res) => {
    try {
      const penaltyData = insertPenaltySchema.parse(req.body);
      const penalty = await storage.createPenalty(penaltyData);
      res.status(201).json(penalty);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.put("/api/penalties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertPenaltySchema.partial().parse(req.body);
      const penalty = await storage.updatePenalty(id, updateData);
      if (!penalty) {
        return res.status(404).json({ message: "Penalty not found" });
      }
      res.json(penalty);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.delete("/api/penalties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePenalty(id);
      if (!success) {
        return res.status(404).json({ message: "Penalty not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete penalty" });
    }
  });

  // Notifications routes
  app.get("/api/notifications/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const notifications = await storage.getNotificationsByUser(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const notificationData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(notificationData);
      res.status(201).json(notification);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.put("/api/notifications/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.markNotificationAsRead(id);
      if (!success) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
