"use client";

import * as React from "react";
import { Home, Settings2 } from "lucide-react";

import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TenantSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { InferSelectModel } from "drizzle-orm";
import { projects, tenants } from "@/lib/db/schema";
import { NavMain } from "./nav-main";
import { usePathname } from "next/navigation";

type User = {
  name: string;
  email: string;
  avatar: string;
};

type Tenant = InferSelectModel<typeof tenants>;
type Project = InferSelectModel<typeof projects>;
export function AppSidebar({
  user,
  tenants,
  activeTenant,
  projects,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: User;
  tenants: Tenant[];
  activeTenant: Tenant;
  projects: Project[];
}) {
  const pathname = usePathname();
  const isDashboardActive = pathname === `/dashboard/${activeTenant.id}`;

  const navMain = [
    {
      title: "Dashboard",
      url: `/dashboard/${activeTenant.id}`,
      icon: Home,
      isActive: isDashboardActive,
      items: [
        {
          title: "Overview",
          url: `/dashboard/${activeTenant.id}`,
          isActive: isDashboardActive,
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      isActive: pathname.startsWith(`/dashboard/${activeTenant.id}/settings`),
      items: [
        {
          title: "General",
          url: `/dashboard/${activeTenant.id}/settings/general`,
          isActive:
            pathname === `/dashboard/${activeTenant.id}/settings/general`,
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TenantSwitcher tenants={tenants} activeTenant={activeTenant} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={projects} activeTenantId={activeTenant.id} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
