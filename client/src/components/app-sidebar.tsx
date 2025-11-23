import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    testId: "sidebar-link-dashboard",
  },
  {
    title: "Questionnaires",
    url: "/questionnaires",
    icon: ClipboardList,
    testId: "sidebar-link-questionnaires",
  },
  {
    title: "Cheese Products",
    url: "/products",
    icon: Package,
    testId: "sidebar-link-products",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    testId: "sidebar-link-settings",
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2 rounded-md p-2 no-underline hover-elevate active-elevate-2" data-testid="sidebar-logo">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
            <span className="text-lg font-bold text-primary-foreground">🧀</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">CheeseFinder</span>
            {user?.companyName && (
              <span className="text-xs text-muted-foreground">{user.companyName}</span>
            )}
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={location === item.url} data-testid={item.testId}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Separator className="mb-4" />
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.profileImageUrl || undefined} />
            <AvatarFallback className="text-xs">{getInitials()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="truncate text-sm font-medium" data-testid="text-user-name">
              {user?.firstName || user?.lastName 
                ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
                : user?.email || 'User'}
            </span>
            <span className="truncate text-xs text-muted-foreground" data-testid="text-user-email">
              {user?.email}
            </span>
          </div>
        </div>
        <a 
          href="/api/logout" 
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover-elevate active-elevate-2"
          data-testid="button-logout"
        >
          <LogOut className="h-4 w-4" />
          <span>Log Out</span>
        </a>
      </SidebarFooter>
    </Sidebar>
  );
}
