import { AppSidebarContainer } from "@/components/app-sidebar-container";
import { AppSidebarSkeletton } from "@/components/app-sidebar-skeletton";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Suspense } from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Suspense fallback={<AppSidebarSkeletton />}>
        <AppSidebarContainer />
      </Suspense>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
