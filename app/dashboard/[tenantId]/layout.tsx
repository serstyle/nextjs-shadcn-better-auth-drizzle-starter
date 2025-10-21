import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  getTenantByIdWithProjects,
  getUserTenants,
} from "@/features/tenant/db/queries";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
  params,
}: {
  params: Promise<{ tenantId: string }>;
  children: React.ReactNode;
}) {
  const { tenantId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }
  const [tenants, activeTenant] = await Promise.all([
    getUserTenants(),
    getTenantByIdWithProjects(tenantId, session.user.id),
  ]);

  return (
    <SidebarProvider>
      <AppSidebar
        projects={activeTenant.projects}
        tenants={tenants}
        activeTenant={activeTenant}
      />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
