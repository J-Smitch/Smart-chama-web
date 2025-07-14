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

  // M-Pesa STK Push route
  app.post("/api/mpesa/stkpush", async (req, res) => {
    try {
      const { amount, phoneNumber, memberId, chamaId } = req.body;
      
      // Safaricom STK Push endpoint
      const endpoint = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
      
      // Get Bearer token - In production, you'd get this from auth endpoint
      const bearerToken = "Bearer nHJJ3T9EkXZm9K8dIlvzIQEJlDH5AVFf";
      
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
      const businessShortCode = "174379";
      const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
      const password = Buffer.from(businessShortCode + passkey + timestamp).toString('base64');

      const requestPayload = {
        "BusinessShortCode": businessShortCode,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phoneNumber,
        "PartyB": businessShortCode,
        "PhoneNumber": phoneNumber,
        "CallBackURL": "https://smartchama.repl.co/api/mpesa/callback",
        "AccountReference": `CHAMA-${chamaId}`,
        "TransactionDesc": "Chama Contribution"
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': bearerToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPayload)
      });

      const data = await response.json();
      
      if (data.ResponseCode === "0") {
        // Create a pending contribution record
        const contributionData = {
          memberId: memberId,
          chamaId: chamaId,
          amount: amount,
          status: "pending"
        };
        
        await storage.createContribution(contributionData);
        
        // Create notification for successful payment request
        await storage.createNotification({
          userId: memberId,
          title: "M-Pesa Payment Initiated",
          message: `Payment request for KSh ${amount} has been sent to your phone.`,
          type: "info"
        });
      }
      
      res.json(data);
    } catch (error) {
      console.error('M-Pesa STK Push error:', error);
      res.status(500).json({ message: "Failed to process M-Pesa payment" });
    }
  });

  // Check overdue contributions
  app.get("/api/contributions/overdue/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const members = await storage.getAllMembers();
      const contributions = await storage.getAllContributions();
      
      // Find user's memberships
      const userMemberships = members.filter(m => m.userId === userId);
      
      for (const membership of userMemberships) {
        // Get member's contributions for this chama
        const memberContributions = contributions.filter(c => 
          c.memberId === membership.id && c.status === "completed"
        );
        
        // Check if last contribution was more than 30 days ago
        const lastContribution = memberContributions
          .sort((a, b) => {
            const dateA = a.contributionDate ? new Date(a.contributionDate).getTime() : 0;
            const dateB = b.contributionDate ? new Date(b.contributionDate).getTime() : 0;
            return dateB - dateA;
          })[0];
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const lastContributionDate = lastContribution?.contributionDate ? new Date(lastContribution.contributionDate) : null;
        if (!lastContribution || !lastContributionDate || lastContributionDate < thirtyDaysAgo) {
          // Create overdue notification
          await storage.createNotification({
            userId: userId,
            title: "Contribution Reminder",
            message: "Reminder: Please make your monthly contribution",
            type: "warning"
          });
        }
      }
      
      res.json({ status: "checked" });
    } catch (error) {
      console.error('Overdue check error:', error);
      res.status(500).json({ message: "Failed to check overdue contributions" });
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

  // M-Pesa STK Push route
  app.post("/api/mpesa/stkpush", async (req, res) => {
    try {
      const { amount, phoneNumber, memberId, chamaId } = req.body;
      
      if (!amount || !phoneNumber || !memberId || !chamaId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const payload = {
        "BusinessShortCode": "174379",
        "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1ZTk3ZGQ3MWE0NjdjZDJiN2YwOGExNWM1NGM1N2U5N2IzM2YyODI3YjdjMWY1MDIwMjUwNzE0MTUzMDAw",
        "Timestamp": "20250714153000",
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount.toString(),
        "PartyA": phoneNumber,
        "PartyB": "174379",
        "PhoneNumber": phoneNumber,
        "CallBackURL": "https://my-smartchama.com/callback",
        "AccountReference": "SmartChama",
        "TransactionDesc": "Monthly contribution"
      };

      const headers = {
        "Authorization": "Bearer oipkXCmPnRijas732Wb+gkwa/fDTG0QkMcPMoBcNWThMuUtlYx/xloZI4Qcrj6I3yVL3g6i7877tfr/sfpe3HHkrC19ze/83fC7guX38UJC0i6VsWdNs0Zelgh36OFlQFX8K1MpfO+DX7wOGjvMFkTtRa9CnvL55Uk7GIDsMEdhrVtR0skl4xA/baLMSKYr7KXF7FSBhmgovVvOfRCxZXnd16I8NslQjAJdVgszSRcSRgGN45f60ooPx7yZ4gc2eg8+wtdl051VcxU5B5sjRiJmWW7rTMiNcdsz9uw5qL9rapQfb3jvTQLBnak/cITz4AAtlGqL4gCeF1lIegVedEg==",
        "Content-Type": "application/json"
      };

      const response = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.ResponseCode === "0") {
        // Create a pending contribution record
        const contributionData = {
          memberId: parseInt(memberId),
          chamaId: parseInt(chamaId),
          amount: amount.toString(),
          status: "pending"
        };
        
        await storage.createContribution(contributionData);
        
        // Create notification for successful payment prompt
        await storage.createNotification({
          userId: parseInt(memberId),
          title: "Payment Prompt Sent",
          message: `M-Pesa payment prompt for KSh ${amount} has been sent to your phone. Please complete the payment.`,
          type: "info"
        });
      }
      
      res.json(data);
    } catch (error) {
      console.error("M-Pesa STK Push error:", error);
      res.status(500).json({ message: "Failed to process M-Pesa payment" });
    }
  });

  // Check for overdue contributions
  app.get("/api/contributions/overdue/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const contributions = await storage.getAllContributions();
      
      // Find user's contributions
      const userContributions = contributions.filter(c => c.member.userId === userId);
      
      // Check if last contribution was more than 30 days ago
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const lastContribution = userContributions
        .filter(c => c.contributionDate)
        .sort((a, b) => new Date(b.contributionDate!).getTime() - new Date(a.contributionDate!).getTime())[0];
      
      const isOverdue = !lastContribution || new Date(lastContribution.contributionDate!) < thirtyDaysAgo;
      
      if (isOverdue) {
        // Create notification for overdue contribution
        await storage.createNotification({
          userId: userId,
          title: "Contribution Reminder",
          message: "Reminder: Please make your monthly contribution.",
          type: "warning"
        });
      }
      
      res.json({ isOverdue });
    } catch (error) {
      res.status(500).json({ message: "Failed to check overdue contributions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
