import {
  LayoutDashboard,
  Webhook,
  ClipboardList,
  CreditCard,
  Settings,
  Megaphone,
  BarChart3,
  GitBranch,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const mainMenuItems = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard, end: true },
  { title: "Funnel", url: "/admin/funnel", icon: BarChart3 },
  { title: "Variants", url: "/admin/variants", icon: GitBranch },
  { title: "Submissions", url: "/admin/submissions", icon: ClipboardList },
  { title: "Google Ads", url: "/admin/google-ads", icon: Megaphone },
];

const settingsItems = [
  { title: "Webhooks", url: "/admin/webhooks", icon: Webhook },
];

export function WebhooksTopBar() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const { signOut } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-4 shrink-0">
      <SidebarTrigger />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {dark ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
          <Switch checked={dark} onCheckedChange={setDark} aria-label="Toggle theme" />
        </div>
        <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground normal-case font-normal">
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>
      </div>
    </header>
  );
}

export function WebhooksSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const isActive = (path: string, end?: boolean) =>
    end ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 border-b border-border">
        <NavLink to="/admin" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <LayoutDashboard className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="font-bold text-lg">InstallPros</span>}
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url, item.end)}>
                    <NavLink to={item.url} end={item.end} className="hover:bg-muted/50" activeClassName="bg-muted text-primary font-medium">
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} className="hover:bg-muted/50" activeClassName="bg-muted text-primary font-medium">
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border">
        {!collapsed && (
          <p className="text-xs text-muted-foreground">Admin Panel v1.0</p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
