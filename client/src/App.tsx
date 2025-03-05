import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import Login from "@/pages/auth/login";
import Dashboard from "@/pages/dashboard";
import Leads from "@/pages/leads";
import Orders from "@/pages/orders";
import Tasks from "@/pages/tasks";
import NotFound from "@/pages/not-found";
import { useQuery } from "@tanstack/react-query";
import React from 'react';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useQuery({ 
    queryKey: ["/api/auth/me"],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return <Layout>{children}</Layout>;
}

function RedirectToLogin() {
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    setLocation("/login");
  }, [setLocation]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={RedirectToLogin} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard">
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      </Route>
      <Route path="/leads">
        <PrivateRoute>
          <Leads />
        </PrivateRoute>
      </Route>
      <Route path="/orders">
        <PrivateRoute>
          <Orders />
        </PrivateRoute>
      </Route>
      <Route path="/tasks">
        <PrivateRoute>
          <Tasks />
        </PrivateRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;