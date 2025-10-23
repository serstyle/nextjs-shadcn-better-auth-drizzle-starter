import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateOrganizationForm } from "@/features/organization/create-organization";

import { SignoutButton } from "@/features/user/signout-button";
import { auth } from "@/lib/auth";
import {
  BuildingIcon,
  FolderIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });
  if (!session) {
    return redirect("/login");
  }

  const organizations = await auth.api.listOrganizations({
    headers: headersList,
    query: {
      disableCookieCache: true,
    },
  });
  if (organizations[0]) {
    return redirect(`/select-organization`);
  }
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <SignoutButton />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Onboarding</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-8 p-4 pt-0">
        <div className="mx-auto w-full max-w-2xl space-y-8 py-12">
          <div className="space-y-4 text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <BuildingIcon className="text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome, {session.user.name}!
            </h1>
            <p className="text-lg text-muted-foreground">
              Let&apos;s get you started by creating your first organization
            </p>
          </div>

          <Card className="border-2">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl">
                Create your organization
              </CardTitle>
              <CardDescription className="text-base">
                An organization helps you organize your projects and collaborate
                with your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateOrganizationForm />
            </CardContent>
          </Card>

          <div className="grid gap-4 pt-4 md:grid-cols-3">
            <Card className="border-dashed">
              <CardContent className="space-y-2 pt-6">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                  <FolderIcon className="text-primary" />
                </div>
                <h3 className="font-semibold">Projects</h3>
                <p className="text-sm text-muted-foreground">
                  Organize your work into projects
                </p>
              </CardContent>
            </Card>
            <Card className="border-dashed">
              <CardContent className="space-y-2 pt-6">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                  <UsersIcon className="text-primary" />
                </div>
                <h3 className="font-semibold">Team</h3>
                <p className="text-sm text-muted-foreground">
                  Invite members to collaborate
                </p>
              </CardContent>
            </Card>
            <Card className="border-dashed">
              <CardContent className="space-y-2 pt-6">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                  <SettingsIcon className="text-primary" />
                </div>
                <h3 className="font-semibold">Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Customize your organization
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
