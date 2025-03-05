import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { logout } from "@/lib/auth";
import { useLocation } from "wouter";

export function Header() {
  const [, setLocation] = useLocation();
  const { data: user } = useQuery<User>({ 
    queryKey: ["/api/auth/me"],
  });

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <h2 className="text-2xl font-bold text-foreground">Pharma CRM</h2>
        <div className="ml-auto flex items-center space-x-4">
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user.name} ({user.role})
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}