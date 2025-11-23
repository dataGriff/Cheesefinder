import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Questionnaires from "@/pages/questionnaires";
import QuestionnaireEditor from "@/pages/questionnaire-editor";
import Products from "@/pages/products";
import Settings from "@/pages/settings";
import TakeQuestionnaire from "@/pages/take-questionnaire";

function MainApp() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();
  const queryClientInstance = useQueryClient();
  
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  // Check for post-login state and invalidate auth cache if needed
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasLoginRedirect = window.location.pathname === "/" && !urlParams.toString();
    
    // If we're on the root path with no params, it might be a post-login redirect
    // Force a refresh of the auth state
    if (hasLoginRedirect) {
      console.log("Detected potential login redirect, refreshing auth state");
      queryClientInstance.invalidateQueries({ queryKey: ["auth", "user"] });
    }
  }, [queryClientInstance]);

  // Debug logging
  console.log("App debug:", { isAuthenticated, isLoading, location });

  // Show loading state during authentication check
  if (isLoading) {
    console.log("App: showing loading state");
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Public questionnaire route should not show sidebar
  const isPublicRoute = location.startsWith('/q/');

  if (!isAuthenticated || isPublicRoute) {
    console.log("App: showing unauthenticated routes");
    return (
      <Switch>
        <Route path="/q/:id" component={TakeQuestionnaire} />
        <Route path="/" component={Landing} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b px-6">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/questionnaires" component={Questionnaires} />
              <Route path="/questionnaires/:id" component={QuestionnaireEditor} />
              <Route path="/products" component={Products} />
              <Route path="/settings" component={Settings} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <MainApp />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
