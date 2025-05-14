import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import NotFound from "@/pages/not-found";
import { useUserStore } from "@/stores/userStore";

function App() {
  const { isAuthenticated, checkAuth } = useUserStore();
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuthentication = async () => {
      await checkAuth();
      setIsLoading(false);
    };
    
    checkAuthentication();
  }, [checkAuth]);

  useEffect(() => {
    // Redirect based on authentication state
    if (!isLoading) {
      if (isAuthenticated && location === "/login") {
        setLocation("/");
      } else if (!isAuthenticated && location !== "/login") {
        setLocation("/login");
      }
    }
  }, [isAuthenticated, location, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/" component={DashboardPage} />
          <Route component={NotFound} />
        </Switch>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
