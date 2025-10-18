"use client";

import { Folder, Loader2, MoreHorizontal, Plus, Trash2 } from "lucide-react";

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
import { startTransition } from "react";
import { cn } from "@/lib/utils";
import { CreateProject } from "@/features/project/create-project";
import { useRemoveProject } from "@/features/project/hooks";

type Project = InferSelectModel<typeof projects>;

export function NavProjects({
  projects,
  activeTenantId,
}: {
  projects: Project[];
  activeTenantId: string;
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="">
        <span>
          Projects {projects.length > 0 ? `(${projects.length})` : ""}
        </span>
      </SidebarGroupLabel>
      <SidebarGroupAction>
        <CreateProject tenantId={activeTenantId}>
          <Plus className="size-4 cursor-pointer" />
        </CreateProject>
      </SidebarGroupAction>
      <SidebarMenu>
        {projects.map((item) => (
          <NavProjectsItem key={item.id} project={item} />
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <Link className="w-full" href={`/dashboard/${activeTenantId}`}>
              <span>More</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function NavProjectsItem({ project }: { project: Project }) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const projectId = pathname.split("/").pop();

  const { formAction, pending } = useRemoveProject(
    project.tenantId,
    project.id,
  );

  return (
    <SidebarMenuItem key={project.name}>
      <SidebarMenuButton isActive={projectId === project.id} asChild>
        <Link
          href={pending ? "#" : `/dashboard/${project.tenantId}/${project.id}`}
          className={cn(pending && "animate-pulse cursor-not-allowed")}
        >
          <Folder className="text-muted-foreground" />
          <span>{project.name}</span>
        </Link>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          disabled={pending}
          className={cn(pending && "animate-pulse cursor-not-allowed")}
        >
          <SidebarMenuAction showOnHover={!pending}>
            {pending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <MoreHorizontal />
            )}
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48 rounded-lg"
          side={isMobile ? "bottom" : "right"}
          align={isMobile ? "end" : "start"}
        >
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/${project.tenantId}/${project.id}`}>
              <Folder className="text-muted-foreground" />
              <span>View Project</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => startTransition(formAction)}
            disabled={pending}
          >
            <Trash2
              className={cn("text-destructive", pending && "animate-pulse")}
            />
            <span>Delete Project</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
