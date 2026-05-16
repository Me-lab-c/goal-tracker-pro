import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, RequireAuth } from "@/lib/auth";
import { AppShell } from "@/components/AppShell";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import GoalsPage from "@/pages/goals/index";
import NewGoalPage from "@/pages/goals/new";
import GoalDetailPage from "@/pages/goals/detail";
import EditGoalPage from "@/pages/goals/edit";
import TeamPage from "@/pages/team";
import AnalyticsPage from "@/pages/analytics";
import AdminPage from "@/pages/admin";
import NotificationsPage from "@/pages/notifications";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 401
        if ((error as { status?: number })?.status === 401) return false;
        return failureCount < 2;
      },
      staleTime: 30_000,
    },
  },
});

function AppRoutes() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route>
        <RequireAuth>
          <AppShell>
            <Switch>
              <Route path="/" component={DashboardPage} />
              <Route path="/goals/new" component={NewGoalPage} />
              <Route path="/goals/:id/edit" component={EditGoalPage} />
              <Route path="/goals/:id" component={GoalDetailPage} />
              <Route path="/goals" component={GoalsPage} />
              <Route path="/team" component={TeamPage} />
              <Route path="/analytics" component={AnalyticsPage} />
              <Route path="/admin" component={AdminPage} />
              <Route path="/notifications" component={NotificationsPage} />
              <Route component={NotFound} />
            </Switch>
          </AppShell>
        </RequireAuth>
      </Route>
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AppRoutes />
          </WouterRouter>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
