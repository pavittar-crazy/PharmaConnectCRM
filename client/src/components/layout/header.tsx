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
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-primary">Pavittar Pharma</h2>
          <p className="text-xs text-muted-foreground">A Rishul Chanana Production</p>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="font-medium text-sm">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.role}</span>
              </div>
              <Button variant="outline" onClick={handleLogout} className="rounded-full">
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}