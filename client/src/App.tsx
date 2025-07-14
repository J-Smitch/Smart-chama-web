import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";

// Public pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Features from "@/pages/Features";
import Pricing from "@/pages/Pricing";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

// Dashboard pages
import Dashboard from "@/pages/Dashboard";
import Chamas from "@/pages/Chamas";
import Members from "@/pages/Members";
import Contributions from "@/pages/Contributions";
import Payouts from "@/pages/Payouts";
import Penalties from "@/pages/Penalties";
import Reports from "@/pages/Reports";
import Notifications from "@/pages/Notifications";
import Profile from "@/pages/Profile";

import Layout from "@/components/layout/Layout";
import PublicLayout from "@/components/layout/PublicLayout";
import NotFound from "@/pages/not-found";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Login />;
  }
  
  return <Layout>{children}</Layout>;
}

function Router() {
  return (
    <Switch>
      {/* Public pages */}
      <Route path="/" component={() => <PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" component={() => <PublicLayout><About /></PublicLayout>} />
      <Route path="/features" component={() => <PublicLayout><Features /></PublicLayout>} />
      <Route path="/pricing" component={() => <PublicLayout><Pricing /></PublicLayout>} />
      <Route path="/contact" component={() => <PublicLayout><Contact /></PublicLayout>} />
      <Route path="/login" component={() => <PublicLayout><Login /></PublicLayout>} />
      <Route path="/signup" component={() => <PublicLayout><Signup /></PublicLayout>} />
      
      {/* Dashboard pages */}
      <Route path="/dashboard" component={() => <PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/chamas" component={() => <PrivateRoute><Chamas /></PrivateRoute>} />
      <Route path="/members" component={() => <PrivateRoute><Members /></PrivateRoute>} />
      <Route path="/contributions" component={() => <PrivateRoute><Contributions /></PrivateRoute>} />
      <Route path="/payouts" component={() => <PrivateRoute><Payouts /></PrivateRoute>} />
      <Route path="/penalties" component={() => <PrivateRoute><Penalties /></PrivateRoute>} />
      <Route path="/reports" component={() => <PrivateRoute><Reports /></PrivateRoute>} />
      <Route path="/notifications" component={() => <PrivateRoute><Notifications /></PrivateRoute>} />
      <Route path="/profile" component={() => <PrivateRoute><Profile /></PrivateRoute>} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
