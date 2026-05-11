import { NavLink, useLocation } from "react-router-dom";
import { BarChart3, GitBranch, LayoutDashboard, ArrowLeft, ClipboardList, Megaphone, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/funnel", label: "Funnel", icon: BarChart3 },
  { to: "/admin/variants", label: "Variants", icon: GitBranch },
  { to: "/admin/submissions", label: "Submissions", icon: ClipboardList },
  { to: "/admin/google-ads", label: "Google Ads", icon: Megaphone },
];

export function AdminSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <aside className="w-56 flex-shrink-0 border-r border-border bg-background">
      <div className="sticky top-0 h-screen flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <NavLink 
            to="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to site
          </NavLink>
          <h1 className="mt-4 font-bold text-lg text-foreground">Analytics</h1>
          <p className="text-xs text-muted-foreground">Internal dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.end 
              ? location.pathname === item.to 
              : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <p className="text-xs text-muted-foreground">
            Data is directional, not exact analytics
          </p>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
}
