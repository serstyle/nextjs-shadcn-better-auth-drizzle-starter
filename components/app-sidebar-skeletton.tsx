import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "./ui/sidebar";
import { Skeleton } from "./ui/skeleton";

export function AppSidebarSkeletton() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Skeleton className="h-12 w-full bg-accent-foreground/10" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <Skeleton className="h-8 w-full bg-accent-foreground/10" />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Skeleton className="h-8 w-full bg-accent-foreground/10" />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <Skeleton className="h-8 w-full bg-accent-foreground/10" />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Skeleton className="h-8 w-full bg-accent-foreground/10" />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Skeleton className="h-12 w-full bg-accent-foreground/10" />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
