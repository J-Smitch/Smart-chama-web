import { User } from "@shared/schema";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

class AuthManager {
  private authState: AuthState = {
    user: null,
    isAuthenticated: false,
  };

  private listeners: ((state: AuthState) => void)[] = [];

  constructor() {
    // Check for stored user on initialization
    this.loadStoredUser();
  }

  private loadStoredUser() {
    const storedUser = localStorage.getItem("smartchama_user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.authState = {
          user,
          isAuthenticated: true,
        };
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("smartchama_user");
      }
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.authState));
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  async login(user: User) {
    this.authState = {
      user,
      isAuthenticated: true,
    };
    localStorage.setItem("smartchama_user", JSON.stringify(user));
    
    // Check for overdue contributions
    this.checkOverdueContributions(user.id);
    
    this.notifyListeners();
  }

  private async checkOverdueContributions(userId: number) {
    // Only check once per day
    const lastCheck = localStorage.getItem("smartchama_last_overdue_check");
    const today = new Date().toDateString();
    
    if (lastCheck === today) {
      return;
    }
    
    try {
      const response = await fetch(`/api/contributions/overdue/${userId}`);
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("smartchama_last_overdue_check", today);
      }
    } catch (error) {
      console.error("Failed to check overdue contributions:", error);
    }
  }

  logout() {
    this.authState = {
      user: null,
      isAuthenticated: false,
    };
    localStorage.removeItem("smartchama_user");
    this.notifyListeners();
  }

  getState(): AuthState {
    return { ...this.authState };
  }
}

export const authManager = new AuthManager();
