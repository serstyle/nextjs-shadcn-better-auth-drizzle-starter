import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { tenantsUsers } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

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
    return redirect("/login");
  }
  const tenants = await db.query.tenantsUsers
    .findMany({
      where: and(eq(tenantsUsers.userId, session?.user?.id)),
      with: {
        tenant: {
          with: {
            projects: true,
          },
        },
      },
    })
    .then((tenants) => tenants.map((tenant) => tenant.tenant))
    .catch((error) => {
      console.error(error);
      return null;
    });
  const activeTenant = tenants?.find((tenant) => tenant.id === tenantId);
  if (!tenants || !activeTenant) {
    return redirect("/dashboard");
  }
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
