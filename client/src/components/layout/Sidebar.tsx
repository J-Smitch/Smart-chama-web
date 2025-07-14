import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { 
  Home, 
  Users, 
  UserPlus, 
  DollarSign, 
  Calendar, 
  AlertTriangle, 
  BarChart3, 
  Bell, 
  User,
  LogOut
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Chamas", href: "/chamas", icon: Users },
  { name: "Members", href: "/members", icon: UserPlus },
  { name: "Contributions", href: "/contributions", icon: DollarSign },
  { name: "Payouts", href: "/payouts", icon: Calendar },
  { name: "Penalties", href: "/penalties", icon: AlertTriangle },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Profile", href: "/profile", icon: User },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SC</span>
          </div>
          <span className="ml-2 text-xl font-bold text-gray-900">SmartChama</span>
        </div>
      </div>
      
      <nav className="mt-6">
        <div className="px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    isActive ? "bg-primary text-white" : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>
      
      <div className="absolute bottom-0 w-64 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-700 hover:text-gray-900"
          onClick={logout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}
