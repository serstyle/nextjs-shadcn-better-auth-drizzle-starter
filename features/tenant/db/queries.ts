import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { tenantsUsers } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

export const getTenantByIdWithProjects = async (tenantId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return null;
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
  return tenant?.tenant;
};
