"use client";

import { Folder, MoreHorizontal, Plus, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { projects } from "@/lib/db/schema";
import { InferSelectModel } from "drizzle-orm";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreateProject } from "@/features/project/create-project";
import { ActionButton } from "./ui/action-button";
import { deleteProjectAction } from "@/features/project/action";

type Project = InferSelectModel<typeof projects>;

export function NavProjects({
  projects,
  activeOrganizationId,
}: {
  projects: Project[];
  activeOrganizationId: string;
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="">
        <span>
          Projects {projects.length > 0 ? `(${projects.length})` : ""}
        </span>
      </SidebarGroupLabel>
      <SidebarGroupAction>
        <CreateProject organizationId={activeOrganizationId}>
          <Plus className="size-4 cursor-pointer" />
        </CreateProject>
      </SidebarGroupAction>
      <SidebarMenu>
        {projects.map((item) => (
          <NavProjectsItem key={item.id} project={item} />
        ))}
        {projects.length === 0 && (
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <span className="text-sm text-muted-foreground italic">
                No projects yet.
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
        <SidebarMenuItem>
          {projects.length <= 3 ? (
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <CreateProject organizationId={activeOrganizationId}>
                <div className="flex items-center gap-2">
                  <Plus className="size-4 cursor-pointer" />
                  <span>Create Project</span>
                </div>
              </CreateProject>
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <MoreHorizontal className="text-sidebar-foreground/70" />
              <Link className="w-full" href={`/dashboard`}>
                <span>More</span>
              </Link>
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function NavProjectsItem({ project }: { project: Project }) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const projectId = pathname.split("/").pop();

  return (
    <SidebarMenuItem key={project.name}>
      <SidebarMenuButton isActive={projectId === project.id} asChild>
        <Link href={`/dashboard/${project.id}`}>
          <Folder className="text-muted-foreground" />
          <span>{project.name}</span>
        </Link>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover>
            <MoreHorizontal />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48 rounded-lg"
          side={isMobile ? "bottom" : "right"}
          align={isMobile ? "end" : "start"}
        >
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/${project.id}`}>
              <Folder className="text-muted-foreground" />
              <span>View Project</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="text-destructive">
            <ActionButton
              action={deleteProjectAction.bind(
                null,
                project.organizationId,
                project.id,
              )}
              requireAreYouSure
              variant="destructive"
              className="text-destructive"
              asChild
            >
              <div className="relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive outline-hidden select-none hover:bg-destructive/10 focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:!text-destructive">
                <Trash2 className="text-destructive" />
                <span>Delete Project</span>
              </div>
            </ActionButton>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
