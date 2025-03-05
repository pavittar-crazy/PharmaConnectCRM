import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  CheckSquare,
  Factory
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/manufacturers", label: "Manufacturers", icon: Factory }
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-sidebar border-r h-[calc(100vh-4rem)] p-4">
      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <a
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  location === link.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </a>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
