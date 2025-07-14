import { 
  users, chamas, members, contributions, payouts, penalties, notifications,
  type User, type Chama, type Member, type Contribution, type Payout, type Penalty, type Notification,
  type InsertUser, type InsertChama, type InsertMember, type InsertContribution, type InsertPayout, type InsertPenalty, type InsertNotification
} from "@shared/schema";

export interface IStorage {
  // Users
  getUserById(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Chamas
  getAllChamas(): Promise<Chama[]>;
  getChamaById(id: number): Promise<Chama | undefined>;
  createChama(chama: InsertChama): Promise<Chama>;
  updateChama(id: number, chama: Partial<InsertChama>): Promise<Chama | undefined>;
  deleteChama(id: number): Promise<boolean>;
  
  // Members
  getAllMembers(): Promise<(Member & { user: User; chama: Chama })[]>;
  getMembersByChama(chamaId: number): Promise<(Member & { user: User })[]>;
  createMember(member: InsertMember): Promise<Member>;
  updateMember(id: number, member: Partial<InsertMember>): Promise<Member | undefined>;
  deleteMember(id: number): Promise<boolean>;
  
  // Contributions
  getAllContributions(): Promise<(Contribution & { member: Member & { user: User }; chama: Chama })[]>;
  getContributionsByChama(chamaId: number): Promise<(Contribution & { member: Member & { user: User } })[]>;
  createContribution(contribution: InsertContribution): Promise<Contribution>;
  updateContribution(id: number, contribution: Partial<InsertContribution>): Promise<Contribution | undefined>;
  deleteContribution(id: number): Promise<boolean>;
  
  // Payouts
  getAllPayouts(): Promise<(Payout & { member: Member & { user: User }; chama: Chama })[]>;
  createPayout(payout: InsertPayout): Promise<Payout>;
  updatePayout(id: number, payout: Partial<InsertPayout>): Promise<Payout | undefined>;
  deletePayout(id: number): Promise<boolean>;
  
  // Penalties
  getAllPenalties(): Promise<(Penalty & { member: Member & { user: User }; chama: Chama })[]>;
  createPenalty(penalty: InsertPenalty): Promise<Penalty>;
  updatePenalty(id: number, penalty: Partial<InsertPenalty>): Promise<Penalty | undefined>;
  deletePenalty(id: number): Promise<boolean>;
  
  // Notifications
  getNotificationsByUser(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<boolean>;
  
  // Dashboard stats
  getDashboardStats(): Promise<{
    totalChamas: number;
    totalMembers: number;
    totalContributions: number;
    nextPayout: string;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private chamas: Map<number, Chama>;
  private members: Map<number, Member>;
  private contributions: Map<number, Contribution>;
  private payouts: Map<number, Payout>;
  private penalties: Map<number, Penalty>;
  private notifications: Map<number, Notification>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.chamas = new Map();
    this.members = new Map();
    this.contributions = new Map();
    this.payouts = new Map();
    this.penalties = new Map();
    this.notifications = new Map();
    this.currentId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample users
    const adminUser: User = {
      id: this.currentId++,
      name: "Admin User",
      email: "admin@smartchama.co.ke",
      password: "password123",
      role: "admin",
      phone: "+254700123456",
      createdAt: new Date(),
    };
    
    const user1: User = {
      id: this.currentId++,
      name: "Mary Wanjiku",
      email: "mary@example.com",
      password: "password123",
      role: "user",
      phone: "+254700123457",
      createdAt: new Date(),
    };
    
    const user2: User = {
      id: this.currentId++,
      name: "John Kariuki",
      email: "john@example.com",
      password: "password123",
      role: "user",
      phone: "+254700123458",
      createdAt: new Date(),
    };
    
    this.users.set(adminUser.id, adminUser);
    this.users.set(user1.id, user1);
    this.users.set(user2.id, user2);
    
    // Create sample chamas
    const chama1: Chama = {
      id: this.currentId++,
      name: "Jua Kali Chama",
      description: "A savings group for small business owners",
      contributionAmount: "5000.00",
      meetingSchedule: "Monthly",
      createdAt: new Date(),
      createdBy: adminUser.id,
    };
    
    this.chamas.set(chama1.id, chama1);
    
    // Create sample members
    const member1: Member = {
      id: this.currentId++,
      userId: user1.id,
      chamaId: chama1.id,
      joinedAt: new Date(),
      isActive: true,
    };
    
    const member2: Member = {
      id: this.currentId++,
      userId: user2.id,
      chamaId: chama1.id,
      joinedAt: new Date(),
      isActive: true,
    };
    
    this.members.set(member1.id, member1);
    this.members.set(member2.id, member2);
    
    // Create sample contributions
    const contribution1: Contribution = {
      id: this.currentId++,
      memberId: member1.id,
      chamaId: chama1.id,
      amount: "5000.00",
      contributionDate: new Date(),
      status: "completed",
    };
    
    this.contributions.set(contribution1.id, contribution1);
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role || "user",
      phone: insertUser.phone || null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllChamas(): Promise<Chama[]> {
    return Array.from(this.chamas.values());
  }

  async getChamaById(id: number): Promise<Chama | undefined> {
    return this.chamas.get(id);
  }

  async createChama(insertChama: InsertChama): Promise<Chama> {
    const id = this.currentId++;
    const chama: Chama = {
      ...insertChama,
      id,
      description: insertChama.description || null,
      meetingSchedule: insertChama.meetingSchedule || null,
      createdBy: insertChama.createdBy || null,
      createdAt: new Date(),
    };
    this.chamas.set(id, chama);
    return chama;
  }

  async updateChama(id: number, updateData: Partial<InsertChama>): Promise<Chama | undefined> {
    const chama = this.chamas.get(id);
    if (!chama) return undefined;
    
    const updatedChama = { ...chama, ...updateData };
    this.chamas.set(id, updatedChama);
    return updatedChama;
  }

  async deleteChama(id: number): Promise<boolean> {
    return this.chamas.delete(id);
  }

  async getAllMembers(): Promise<(Member & { user: User; chama: Chama })[]> {
    return Array.from(this.members.values()).map(member => {
      const user = this.users.get(member.userId!)!;
      const chama = this.chamas.get(member.chamaId!)!;
      return { ...member, user, chama };
    });
  }

  async getMembersByChama(chamaId: number): Promise<(Member & { user: User })[]> {
    return Array.from(this.members.values())
      .filter(member => member.chamaId === chamaId)
      .map(member => {
        const user = this.users.get(member.userId!)!;
        return { ...member, user };
      });
  }

  async createMember(insertMember: InsertMember): Promise<Member> {
    const id = this.currentId++;
    const member: Member = {
      ...insertMember,
      id,
      userId: insertMember.userId || null,
      chamaId: insertMember.chamaId || null,
      isActive: insertMember.isActive || null,
      joinedAt: new Date(),
    };
    this.members.set(id, member);
    return member;
  }

  async updateMember(id: number, updateData: Partial<InsertMember>): Promise<Member | undefined> {
    const member = this.members.get(id);
    if (!member) return undefined;
    
    const updatedMember = { ...member, ...updateData };
    this.members.set(id, updatedMember);
    return updatedMember;
  }

  async deleteMember(id: number): Promise<boolean> {
    return this.members.delete(id);
  }

  async getAllContributions(): Promise<(Contribution & { member: Member & { user: User }; chama: Chama })[]> {
    return Array.from(this.contributions.values()).map(contribution => {
      const member = this.members.get(contribution.memberId!)!;
      const user = this.users.get(member.userId!)!;
      const chama = this.chamas.get(contribution.chamaId!)!;
      return { ...contribution, member: { ...member, user }, chama };
    });
  }

  async getContributionsByChama(chamaId: number): Promise<(Contribution & { member: Member & { user: User } })[]> {
    return Array.from(this.contributions.values())
      .filter(contribution => contribution.chamaId === chamaId)
      .map(contribution => {
        const member = this.members.get(contribution.memberId!)!;
        const user = this.users.get(member.userId!)!;
        return { ...contribution, member: { ...member, user } };
      });
  }

  async createContribution(insertContribution: InsertContribution): Promise<Contribution> {
    const id = this.currentId++;
    const contribution: Contribution = {
      ...insertContribution,
      id,
      status: insertContribution.status || "pending",
      chamaId: insertContribution.chamaId || null,
      memberId: insertContribution.memberId || null,
      contributionDate: new Date(),
    };
    this.contributions.set(id, contribution);
    return contribution;
  }

  async updateContribution(id: number, updateData: Partial<InsertContribution>): Promise<Contribution | undefined> {
    const contribution = this.contributions.get(id);
    if (!contribution) return undefined;
    
    const updatedContribution = { ...contribution, ...updateData };
    this.contributions.set(id, updatedContribution);
    return updatedContribution;
  }

  async deleteContribution(id: number): Promise<boolean> {
    return this.contributions.delete(id);
  }

  async getAllPayouts(): Promise<(Payout & { member: Member & { user: User }; chama: Chama })[]> {
    return Array.from(this.payouts.values()).map(payout => {
      const member = this.members.get(payout.memberId!)!;
      const user = this.users.get(member.userId!)!;
      const chama = this.chamas.get(payout.chamaId!)!;
      return { ...payout, member: { ...member, user }, chama };
    });
  }

  async createPayout(insertPayout: InsertPayout): Promise<Payout> {
    const id = this.currentId++;
    const payout: Payout = { 
      ...insertPayout, 
      id,
      status: insertPayout.status || "pending",
      chamaId: insertPayout.chamaId || null,
      memberId: insertPayout.memberId || null,
      notes: insertPayout.notes || null,
    };
    this.payouts.set(id, payout);
    return payout;
  }

  async updatePayout(id: number, updateData: Partial<InsertPayout>): Promise<Payout | undefined> {
    const payout = this.payouts.get(id);
    if (!payout) return undefined;
    
    const updatedPayout = { ...payout, ...updateData };
    this.payouts.set(id, updatedPayout);
    return updatedPayout;
  }

  async deletePayout(id: number): Promise<boolean> {
    return this.payouts.delete(id);
  }

  async getAllPenalties(): Promise<(Penalty & { member: Member & { user: User }; chama: Chama })[]> {
    return Array.from(this.penalties.values()).map(penalty => {
      const member = this.members.get(penalty.memberId!)!;
      const user = this.users.get(member.userId!)!;
      const chama = this.chamas.get(penalty.chamaId!)!;
      return { ...penalty, member: { ...member, user }, chama };
    });
  }

  async createPenalty(insertPenalty: InsertPenalty): Promise<Penalty> {
    const id = this.currentId++;
    const penalty: Penalty = {
      ...insertPenalty,
      id,
      status: insertPenalty.status || "pending",
      chamaId: insertPenalty.chamaId || null,
      memberId: insertPenalty.memberId || null,
      penaltyDate: new Date(),
    };
    this.penalties.set(id, penalty);
    return penalty;
  }

  async updatePenalty(id: number, updateData: Partial<InsertPenalty>): Promise<Penalty | undefined> {
    const penalty = this.penalties.get(id);
    if (!penalty) return undefined;
    
    const updatedPenalty = { ...penalty, ...updateData };
    this.penalties.set(id, updatedPenalty);
    return updatedPenalty;
  }

  async deletePenalty(id: number): Promise<boolean> {
    return this.penalties.delete(id);
  }

  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.currentId++;
    const notification: Notification = {
      ...insertNotification,
      id,
      type: insertNotification.type || "info",
      userId: insertNotification.userId || null,
      isRead: insertNotification.isRead || null,
      createdAt: new Date(),
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;
    
    notification.isRead = true;
    this.notifications.set(id, notification);
    return true;
  }

  async getDashboardStats(): Promise<{
    totalChamas: number;
    totalMembers: number;
    totalContributions: number;
    nextPayout: string;
  }> {
    const totalChamas = this.chamas.size;
    const totalMembers = this.members.size;
    const totalContributions = Array.from(this.contributions.values())
      .reduce((sum, contrib) => sum + parseFloat(contrib.amount), 0);
    
    return {
      totalChamas,
      totalMembers,
      totalContributions,
      nextPayout: "Dec 15, 2024",
    };
  }
}

export const storage = new MemStorage();
