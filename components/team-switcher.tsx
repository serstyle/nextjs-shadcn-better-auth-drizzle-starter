"use client";

import { ChevronsUpDown, GalleryVerticalEnd, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { CreateOrganization } from "@/features/organization/create-organization";
import { Organization } from "better-auth/plugins";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { BetterAuthActionButton } from "./auth/better-auth-action-button";

export function OrganizationSwitcher({
  organizations,
  activeOrganization,
}: {
  organizations: Organization[];
  activeOrganization: Organization;
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const handleChangeOrganization = async (organizationId: string) => {
    return await authClient.organization.setActive(
      {
        organizationId,
      },
      {
        onSuccess: () => {
          router.refresh();
        },
      },
    );
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeOrganization.name}
                </span>
                <span className="truncate text-xs">
                  {JSON.parse(activeOrganization.metadata).description}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Organizations
            </DropdownMenuLabel>
            {organizations.map((organization, index) => (
              <DropdownMenuItem
                key={organization.id}
                asChild
                className="gap-2 p-2"
              >
                <BetterAuthActionButton
                  action={() => handleChangeOrganization(organization.id)}
                  variant="ghost"
                  className="flex w-full items-center justify-between"
                  successMessage={`Switching to ${organization.name}`}
                >
                  <div className="flex w-full items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded-md border">
                      <GalleryVerticalEnd className="size-3.5 shrink-0" />
                    </div>
                    {organization.name}
                  </div>

                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </BetterAuthActionButton>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <CreateOrganization>
                <div className="flex cursor-default items-center gap-2 p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">
                    Add organization
                  </div>
                </div>
              </CreateOrganization>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
