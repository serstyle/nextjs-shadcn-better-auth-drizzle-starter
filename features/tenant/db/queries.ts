import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { tenantsUsers } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

// React Cache: https://react.dev/reference/react/cache#cache-expensive-computation
//
// When multiple components make the same data fetch, only one request is made
// and the data returned is cached and shared across components. All components
// refer to the same snapshot of data across the server render.
export const getTenantByIdWithProjects = cache(async (tenantId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }
  const tenantsUsersResult = await db.query.tenantsUsers.findFirst({
    where: and(
      eq(tenantsUsers.userId, session?.user?.id),
      eq(tenantsUsers.tenantId, tenantId),
    ),
    with: {
      tenant: {
        with: {
          projects: true,
        },
      },
    },
  });
  if (!tenantsUsersResult) {
    redirect("/dashboard");
  }
  return tenantsUsersResult.tenant;
});

export const getMembersByTenantId = async (tenantId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }
  const members = await db.query.tenantsUsers
    .findMany({
      where: eq(tenantsUsers.tenantId, tenantId),
      columns: {
        userId: true,
        createdAt: true,
        tenantId: true,
      },
      with: {
        user: {
          columns: {
            name: true,
            email: true,
          },
        },
      },
    })
    .then((members) =>
      members.map((member) => ({
        memberId: member.userId,
        tenantId: member.tenantId,
        name: member.user.name,
        email: member.user.email,
        createdAt: member.createdAt,
      })),
    );

  return members;
};

export const hasTenant = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }
  const tenant = await db.query.tenantsUsers.findFirst({
    where: eq(tenantsUsers.userId, session?.user?.id),
  });
  if (!tenant) {
    return false;
  }
  redirect(`/dashboard/${tenant.tenantId}`);
};

export const getUserTenants = async () => {
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
        tenant: true,
      },
    })
    .then((tenants) => tenants.map((tenant) => tenant.tenant))
    .catch((error) => {
      console.error(error);
      return null;
    });

  if (!tenants) {
    return redirect("/dashboard");
  }
  return tenants;
};
