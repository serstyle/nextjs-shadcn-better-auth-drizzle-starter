import { getUserOrganizations } from "@/features/organization/auth/queries";
import { AppSidebar } from "./app-sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentOrganization } from "@/features/organization/auth/queries";
import { getProjectsByOrganizationId } from "@/features/project/db/queries";

export async function AppSidebarContainer() {
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
    <AppSidebar
      projects={projectsQuery}
      organizations={organizations}
      activeOrganization={activeOrganization}
    />
  );
}
