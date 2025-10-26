import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  getCurrentOrganization,
  getUserOrganizations,
} from "@/features/organization/auth/queries";

import { getProjectsByOrganizationId } from "@/features/project/db/queries";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }
  const activeOrganization = await getCurrentOrganization();

  const organizations = await getUserOrganizations();

  const projectsQuery = await getProjectsByOrganizationId(
    activeOrganization.id,
  );

  return (
    <SidebarProvider>
      <AppSidebar
        projects={projectsQuery}
        organizations={organizations}
        activeOrganization={activeOrganization}
      />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
