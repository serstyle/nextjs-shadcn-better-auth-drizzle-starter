import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  getTenantByIdWithProjects,
  getUserTenants,
} from "@/features/tenant/db/queries";

export default async function Layout({
  children,
  params,
}: {
  params: Promise<{ tenantId: string }>;
  children: React.ReactNode;
}) {
  const { tenantId } = await params;

  const [tenants, activeTenant] = await Promise.all([
    getUserTenants(),
    getTenantByIdWithProjects(tenantId),
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
