"use client";

import * as React from "react";
import { Home, Settings2 } from "lucide-react";

import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { OrganizationSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { InferSelectModel } from "drizzle-orm";
import { projects } from "@/lib/db/schema";
import { NavMain } from "./nav-main";
import { usePathname } from "next/navigation";
import { Organization } from "better-auth/plugins";

type Project = InferSelectModel<typeof projects>;
export function AppSidebar({
  organizations,
  activeOrganization,
  projects,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  organizations: Organization[];
  activeOrganization: Organization;
  projects: Project[];
}) {
  const pathname = usePathname();
  const isDashboardActive = pathname === `/dashboard`;

  const navMain = [
    {
      title: "Dashboard",
      url: `/dashboard`,
      icon: Home,
      isActive: isDashboardActive,
      items: [
        {
          title: "Overview",
          url: `/dashboard`,
          isActive: isDashboardActive,
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      isActive: pathname.startsWith(`/dashboard/settings`),
      items: [
        {
          title: "General",
          url: `/dashboard/settings/general`,
          isActive: pathname === `/dashboard/settings/general`,
        },
        {
          title: "Team",
          url: `/dashboard/settings/team`,
          isActive: pathname === `/dashboard/settings/team`,
        },
        {
          title: "Billing",
          url: `/dashboard/settings/billing`,
          isActive: pathname === `/dashboard/settings/billing`,
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrganizationSwitcher
          organizations={organizations}
          activeOrganization={activeOrganization}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects
          projects={projects}
          activeOrganizationId={activeOrganization.id}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
