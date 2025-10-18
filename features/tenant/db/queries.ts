import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { tenantsUsers } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const getTenantById = async (tenantId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }
  const tenant = await db.query.tenantsUsers.findFirst({
    where: and(
      eq(tenantsUsers.userId, session?.user?.id),
      eq(tenantsUsers.tenantId, tenantId),
    ),
    with: {
      tenant: true,
    },
  });
  if (!tenant) {
    redirect("/dashboard");
  }
  return tenant.tenant;
};

export const getTenantByIdWithProjects = async (tenantId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }
  const tenant = await db.query.tenantsUsers.findFirst({
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
  if (!tenant) {
    redirect("/dashboard");
  }
  return tenant.tenant;
};

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
