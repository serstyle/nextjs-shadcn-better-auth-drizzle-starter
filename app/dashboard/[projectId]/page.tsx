import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import {
  FolderIcon,
  FileTextIcon,
  ActivityIcon,
  UsersIcon,
  CalendarIcon,
  SettingsIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getProjectById } from "@/features/project/db/queries";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }

  const activeOrganizationId = session.session.activeOrganizationId;
  if (!activeOrganizationId) {
    redirect(`/onboarding`);
  }

  const projectQuery = await getProjectById(projectId, activeOrganizationId);

  if (!projectQuery) {
    redirect(`/dashboard`);
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard`}>
                  {projectQuery.organization.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{projectQuery.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        {/* Project Hero Section */}
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <FolderIcon className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">
                {projectQuery.name}
              </h1>
              {projectQuery.description && (
                <p className="text-lg text-muted-foreground">
                  {projectQuery.description}
                </p>
              )}
            </div>
            <Button variant="outline" size="sm">
              <SettingsIcon className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <FileTextIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">No tasks yet</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Team Members
              </CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {/* <div className="text-2xl font-bold">{members.length}</div> */}
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">team members</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activity</CardTitle>
              <ActivityIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Recent updates</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Created</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(projectQuery.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(projectQuery.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions / Features */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-dashed">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <FileTextIcon className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>
                Create and manage tasks for this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" disabled size="sm" className="w-full">
                Add First Task (Coming Soon)
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <UsersIcon className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Team</CardTitle>
              <CardDescription>
                Collaborate with your team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="secondary" size="sm" className="w-full">
                <Link href={`/dashboard/settings/team`}>Invite Members</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ActivityIcon className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Activity Feed</CardTitle>
              <CardDescription>
                Track project updates and changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" disabled size="sm" className="w-full">
                View Activity (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates and changes in this project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <ActivityIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No activity yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Start working on tasks to see activity here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
